import Link from "next/link";
import FloatingShape from "@/components/FloatingShape";
import SpinningShape from "@/components/SpinningShape";

export default function Home() {
  const numRows = 5;
  const numCols = 3;
  const jitter = 10; // max % to jitter within each cell

  const randomShapes = Array.from({ length: numRows * numCols }, (_, i) => {
    const row = Math.floor(i / numCols);
    const col = i % numCols;

    const cellHeight = 100 / numRows;
    const cellWidth = 100 / numCols;

    const top = row * cellHeight + Math.random() * jitter;
    const left = col * cellWidth + Math.random() * jitter;

    return (
      <FloatingShape
        key={`${row}-${col}-${Math.random()}`}
        style={{
          position: "absolute",
          top: `${top}%`,
          left: `${left}%`,
          opacity: 0.3,
        }}
      />
    );
  });

  return (
    <main className="relative min-h-screen flex flex-col justify-center p-6 bg-white overflow-hidden">
      {/* Floating Background Shapes */}
      {randomShapes}

      {/* Foreground Content */}
      <h1 className="text-6xl font-bold text-center text-green-600 mb-10 z-10 relative">
        Welcome to Envolve
      </h1>

      <div className="flex flex-row w-full items-center justify-between gap-6 z-10 relative">
        {["FIRST.jpg", "SECOND.jpg", "THIRD.jpg"].map((src, idx) => (
          <div key={idx} className="flex-1 flex items-center justify-center">
            <div className="w-64 h-80 rounded-full overflow-hidden border-4 border-green-400 shadow-lg">
              <img
                src={`/images/${src}`}
                alt={`Shape ${idx}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Link */}
      <div className="mt-10 text-center z-10 relative">
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
