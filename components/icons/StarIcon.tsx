// components/icons/StarIcon.tsx
import { Star } from "lucide-react";

export default function StarIcon({ filled }: { filled: boolean }) {
  return (
    <Star
      className={`w-4 h-4 ${
        filled ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
      }`}
    />
  );
}
