import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  let response = "I'm not sure how to help with that yet.";

  // 🧠 Simulated AI-like static replies
  if (/brake|pad|disc/i.test(message)) {
    response = "Looking for brake pads? Check out our Brakes category!";
  } else if (/oil|filter/i.test(message)) {
    response = "Try searching 'Filters' – we have genuine oil filters.";
  } else if (/order|track/i.test(message)) {
    response = "You can view or track your orders in your Dashboard → Orders.";
  } else if (/return|refund/i.test(message)) {
    response = "Returns are easy! Just reach out via Contact page within 7 days.";
  } else if (/hi|hello|hey/i.test(message)) {
    response = "Hey there! 👋 How can I help you today?";
  } else if (/help|support|assist/i.test(message)) {
    response = "I'm here to help! You can ask about products, orders, or anything else.";
  }

  return NextResponse.json({ reply: response });
}
