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

    const current = saved === "dark" || saved === "light"
        ? saved
        : prefersDark
        ? "dark"
        : "light";

    setTheme(current); // ✅ Now it's guaranteed to be "light" or "dark"
    // document.documentElement.classList.toggle("dark", current === "dark");
}, []);


  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    // document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <>
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-50 px-4 py-2 text-sm rounded bg-gray-200 dark:bg-gray-800"
      >
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
      {children}
    </>
  );
}
