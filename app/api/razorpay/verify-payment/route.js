import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";
import { addCredits } from "@/lib/credits";
import Razorpay from "razorpay";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function verifySignature(orderId, paymentId, signature, secret) {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expected === signature;
}

export async function POST(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing razorpay_order_id, razorpay_payment_id, or razorpay_signature" },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, error: "Razorpay not configured" },
        { status: 500 }
      );
    }

    if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, secret)) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { success: false, error: "Razorpay not configured" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const notes = order.notes || {};
    const orderUserId = notes.user_id;
    const credits = parseInt(notes.credits, 10);
    const planName = notes.plan_name || "Credits";

    if (orderUserId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 403 }
      );
    }

    if (!Number.isFinite(credits) || credits < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid order data" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();
    const { data: existing } = await supabase
      .from("payments")
      .select("id")
      .eq("razorpay_payment_id", razorpay_payment_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Payment already processed" },
        { status: 409 }
      );
    }

    const newBalance = await addCredits(
      user.id,
      credits,
      `Purchase: ${planName}`,
      razorpay_payment_id,
      razorpay_order_id
    );

    const amount = order.amount || 0;
    await supabase.from("payments").insert({
      user_id: user.id,
      razorpay_order_id,
      razorpay_payment_id,
      amount,
      credits,
      plan_name: planName,
      status: "completed",
    });

    return NextResponse.json({
      success: true,
      credits_added: credits,
      new_balance: newBalance,
    });
  } catch (err) {
    console.error("[POST /api/razorpay/verify-payment]", err);
    return NextResponse.json(
      { success: false, error: err.message || "Verification failed" },
      { status: 500 }
    );
  }
}
