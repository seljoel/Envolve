"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const [showPopup, setShowPopup] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="relative flex items-center justify-between px-6 py-4 bg-green-200 text-black shadow-md z-50">
      <div className="text-xl font-bold">Envolve</div>

      <div className="flex items-center gap-6 text-base font-medium">
        <Link
          href="/"
          className="hover:underline hover:underline-offset-4 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="hover:underline hover:underline-offset-4 transition-colors"
        >
          About
        </Link>

        <div className="relative">
          <button className="ml-6 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Connect
            </button>
        </div>
      </div>
    </nav>
  );
}
