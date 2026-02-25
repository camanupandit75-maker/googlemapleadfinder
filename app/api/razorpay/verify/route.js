import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";
import { addCredits } from "@/lib/credits";
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      package_id,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing razorpay_order_id, razorpay_payment_id, or razorpay_signature" },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Razorpay not configured" },
        { status: 500 }
      );
    }

    if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, secret)) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();
    const { data: existing } = await supabase
      .from("credit_transactions")
      .select("id")
      .eq("razorpay_payment_id", razorpay_payment_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Payment already processed" },
        { status: 409 }
      );
    }

    const pkgId = package_id;
    if (!pkgId) {
      return NextResponse.json(
        { error: "package_id is required" },
        { status: 400 }
      );
    }

    const { data: pkg, error: pkgError } = await supabase
      .from("credit_packages")
      .select("id, name, credits")
      .eq("id", pkgId)
      .single();

    if (pkgError || !pkg) {
      return NextResponse.json(
        { error: "Invalid package" },
        { status: 400 }
      );
    }

    const newBalance = await addCredits(
      user.id,
      pkg.credits,
      `Purchase: ${pkg.name}`,
      razorpay_payment_id,
      razorpay_order_id
    );

    return NextResponse.json({
      success: true,
      credits_added: pkg.credits,
      new_balance: newBalance,
    });
  } catch (err) {
    console.error("[POST /api/razorpay/verify]", err);
    return NextResponse.json(
      { error: err.message || "Verification failed" },
      { status: 500 }
    );
  }
}
