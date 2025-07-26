"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthInput from "@/components/AuthInput";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Save user session (you can also store a registered flag if needed)
    localStorage.setItem("session", JSON.stringify({ email }));
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Sign Up</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <AuthInput label="Email" type="email" value={email} onChange={setEmail} />
          <AuthInput label="Password" type="password" value={password} onChange={setPassword} />
          <AuthInput
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          {error && (
            <p className="text-red-600 text-sm text-center -mt-2">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/signin")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}
