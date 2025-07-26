"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession } from "@/utils/session";
import Link from "next/link";
import ImageCarousel from "@/components/ImageCarousel";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/signup"); // Redirect new users to signup
    }
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.replace("/signin"); // Redirect to signin after logout
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-4xl font-bold">Home Page</h1>

      <ImageCarousel />

      <Link
        href="/about"
        className="text-blue-600 underline hover:text-blue-800"
      >
        Go to About Page
      </Link>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
      >
        Logout
      </button>
    </main>
  );
}
