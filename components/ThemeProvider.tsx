"use client";

import { useEffect, useState } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Prevent FOUC by applying theme before rendering
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored || (prefersDark ? "dark" : "light");

    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme); // always save
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  return <>{children}</>;
}
