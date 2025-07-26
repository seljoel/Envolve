"use client";

import { useEffect, useState } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const current =
      saved === "dark" || saved === "light"
        ? saved
        : prefersDark
        ? "dark"
        : "light";

    setTheme(current);
    document.documentElement.classList.toggle("dark", current === "dark");
  }, []);

  return <>{children}</>;
}
