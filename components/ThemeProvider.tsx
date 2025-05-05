"use client";
import { useEffect, useState } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored || (prefersDark ? "dark" : "light");

    document.documentElement.classList.toggle("dark", theme === "dark");
    setIsReady(true); // Only render children after theme is applied
  }, []);

  if (!isReady) return null; // Wait for theme to apply before rendering

  return <>{children}</>;
}
