import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { name, email, phone, category, message } = await req.json();
  
    if (!message) {
      return new NextResponse("Message is required", { status: 400 });
    }
  
    const feedback = await prisma.feedback.create({
      data: { name, email, phone, category, message },
    });
  
    return NextResponse.json({ success: true, feedback });
  }
  
