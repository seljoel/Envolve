"use client";
import { useState } from "react";
import AuthInput from "@/components/AuthInput"; // adjust path as needed

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    // Replace with real API
    alert(`Signed up with:\nEmail: ${email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <AuthInput label="Email" type="email" value={email} onChange={setEmail} />
          <AuthInput label="Password" type="password" value={password} onChange={setPassword} />
          <AuthInput
            label="Confirm Password"
            type="password"
            value={confirm}
            onChange={setConfirm}
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
