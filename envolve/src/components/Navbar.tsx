"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useWeb3 } from "../../contexts/Web3Provider"; // ✅ Correct import

export default function Navbar() {
  const [showPopup, setShowPopup] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const { connectWallet, disconnectWallet, address } = useWeb3(); // ✅ Use hook

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
          {address ? (
            <button
              onClick={disconnectWallet}
              className="bg-red-500 px-4 py-2 text-white rounded hover:bg-red-600 transition-colors"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-green-600 px-4 py-2 text-white rounded hover:bg-green-700 transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
