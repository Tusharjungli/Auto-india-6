import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount } = body;

    const payment_capture = 1;
    const currency = "INR";

    const options = {
      amount: amount * 100, // Amount in paisa
      currency,
      receipt: `receipt_order_${Date.now()}`,
      payment_capture,
    };

    const response = await razorpay.orders.create(options);

    return NextResponse.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return new NextResponse("Failed to create Razorpay order", { status: 500 });
  }
}
