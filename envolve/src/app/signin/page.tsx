"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthInput from "@/components/AuthInput";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("session", JSON.stringify({ email }));
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Sign In</h1>
        <form onSubmit={handleSignIn} className="space-y-4">
          <AuthInput label="Email" type="email" value={email} onChange={setEmail} />
          <AuthInput label="Password" type="password" value={password} onChange={setPassword} />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
