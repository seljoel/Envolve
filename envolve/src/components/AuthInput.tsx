import { useState } from "react";

type AuthInputProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
};

export default function AuthInput({ label, type = "text", value, onChange }: AuthInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={type === "password" && !show ? "password" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}
