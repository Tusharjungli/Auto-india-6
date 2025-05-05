"use client";

import { useState } from "react";

export default function DeleteButton({ productId }: { productId: string }) {
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    setSubmitting(true);

    // Create a form and submit it to the API route
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/admin/delete-product"; // ✅ Correct route

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "id";
    input.value = productId;
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:opacity-90 disabled:opacity-60"
      disabled={submitting}
    >
      {submitting ? "Deleting..." : "Delete"}
    </button>
  );
}
