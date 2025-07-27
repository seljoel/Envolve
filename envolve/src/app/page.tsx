import Link from "next/link";
import SpinningLeaf from "@/components/SpinningLeaf";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center p-6">
      <h1 className="text-4xl font-bold text-center text-green-600 mb-10">
        Welcome to Envolve
      </h1>
      <div className="flex flex-row w-full h-full items-center justify-between gap-6">

        {/* Left Oval Image */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-64 h-80 rounded-full overflow-hidden border-4 border-green-400 shadow-lg">

            <img
              src="/images/final.jpg"
              alt="Left"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Center Spinning Leaf */}
        <div className="flex-1 flex items-center justify-center">
          <SpinningLeaf />
        </div>

        {/* Right Oval Image */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-64 h-80 rounded-full overflow-hidden border-4 border-green-400 shadow-lg">
            <img
              src="/images/final2.jpg"
              alt="Right"
              className="w-full h-full object-cover"
            />
          </div>
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
