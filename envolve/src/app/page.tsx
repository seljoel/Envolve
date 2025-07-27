import Link from "next/link";
import SpinningLeaf from "@/components/SpinningLeaf";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center p-6">
      <div className="flex flex-row w-full h-full items-center justify-between gap-6">
        {/* Left Centered Text */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-green-200">Home Page</h1>
        </div>

        {/* Right Centered Leaf */}
        <div className="flex-1 flex items-center justify-center">
          <SpinningLeaf />
        </div>
      </div>

      {/* Navigation link */}
      <div className="mt-10 text-center">
        <Link
          href="/about"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Go to About Page
        </Link>
      </div>
    </main>
  );
}