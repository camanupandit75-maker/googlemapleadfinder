import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import Razorpay from "razorpay";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { amount, plan_name, credits } = body;

    if (amount == null || !plan_name || credits == null) {
      return NextResponse.json(
        { error: "amount, plan_name, and credits are required" },
        { status: 400 }
      );
    }

    const amountPaise = Math.round(Number(amount) * 100);
    if (!Number.isFinite(amountPaise) || amountPaise < 100) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay not configured" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        plan_name: String(plan_name),
        credits: String(credits),
        user_id: user.id,
      },
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency || "INR",
    });
  } catch (err) {
    console.error("[POST /api/razorpay/create-order]", err);
    return NextResponse.json(
      { error: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
