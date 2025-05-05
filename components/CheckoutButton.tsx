"use client";

import { useEffect, useState } from "react";

// ✅ Type Razorpay options interface
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_payment_id: string }) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
}

// ✅ Extend global window with Razorpay type
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export default function CheckoutButton({ total }: { total: number }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);

    const res = await fetch("/api/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });

    const data: RazorpayOrderResponse = await res.json();

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: data.amount,
      currency: data.currency,
      name: "Auto India Spare Parts",
      description: "Order Payment",
      order_id: data.id,
      handler: async (response) => {
        await fetch("/api/razorpay/success", {
          method: "POST",
        });
      
        alert("Payment successful! Razorpay ID: " + response.razorpay_payment_id);
        window.location.href = "/orders";
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#1a1a1a",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    setIsLoading(false);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
    >
      {isLoading ? "Processing..." : "Pay with Razorpay"}
    </button>
  );
}
