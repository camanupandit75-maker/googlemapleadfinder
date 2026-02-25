import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";
import Razorpay from "razorpay";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const packageId = body.package_id;
    if (!packageId) {
      return NextResponse.json(
        { error: "package_id is required" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();
    const { data: pkg, error: pkgError } = await supabase
      .from("credit_packages")
      .select("id, name, credits, price_inr, is_active")
      .eq("id", packageId)
      .single();

    if (pkgError || !pkg || !pkg.is_active) {
      return NextResponse.json(
        { error: "Invalid or inactive package" },
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
    const receipt = `lf_${String(user.id).slice(0, 8)}_${Date.now()}`;
    const order = await razorpay.orders.create({
      amount: pkg.price_inr,
      currency: "INR",
      receipt,
      notes: {
        user_id: user.id,
        email: user.email ?? "",
        package_id: pkg.id,
        package_name: pkg.name,
        credits: String(pkg.credits),
      },
    });

    const priceDisplay = `₹${(pkg.price_inr / 100).toLocaleString("en-IN")}`;
    return NextResponse.json({
      order_id: order.id,
      amount: pkg.price_inr,
      currency: "INR",
      package: {
        name: pkg.name,
        credits: pkg.credits,
        price_display: priceDisplay,
      },
    });
  } catch (err) {
    console.error("[POST /api/razorpay/create-order]", err);
    return NextResponse.json(
      { error: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
