import ImageCarousel from "@/components/ImageCarousel";
import FloatingShape from "@/components/FloatingShape";

export default function Home() {
  const numRows = 3;
  const numCols = 3;
  const jitter = 15;

  const floatingShapes = Array.from({ length: numRows * numCols }, (_, i) => {
    const row = Math.floor(i / numCols);
    const col = i % numCols;

    const cellHeight = 100 / numRows;
    const cellWidth = 100 / numCols;

    const top = row * cellHeight + Math.random() * jitter;
    const left = col * cellWidth + Math.random() * jitter;

    return (
      <FloatingShape
        key={`${row}-${col}-${i}`}
        style={{
          position: "absolute",
          top: `${top}%`,
          left: `${left}%`,
          opacity: 0.3,
          zIndex: 0,
        }}
      />
    );
  });

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
      {/* Background Floating Shapes */}
      {floatingShapes}

      {/* Carousel */}
      <div className="z-10 relative my-10">
        <ImageCarousel />
      </div>

      {/* About Us Section */}
      <div className="z-10 relative w-[90%] max-w-3xl bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 mb-16">
        <h2 className="text-3xl font-semibold mb-4 text-center text-green-600">About Us</h2>
        <p className="text-gray-700 text-justify">
          ENVOLVE revolutionizes eco-activism by merging blockchain gaming mechanics with environmental impact. Players enter as co-owners of a decaying Genesis NFT, embarking on a collaborative quest to restore its vitality through real-world green deeds. As participants verify actions like tree planting and cleanups, they unlock achievement tiers that transform their shared digital asset into increasingly rare evolutionary forms - each upgrade visually reflecting their collective progress. The experience crescendos when the community unlocks the final prestige tier, shattering the Genesis NFT into unique legendary variants. Each player receives a personalized, procedurally-generated trophy NFT boasting rare traits earned through their specific contributions, with exclusive cosmetic enhancements tied to their environmental KPIs. This play-to-impact model, built on Ethereum with dynamic NFT mechanics and Chainlink-verified achievements, creates the first true MMO (Massively Meaningful Online) experience where every in-game advancement represents measurable planetary healing.
        </p>
      </div>
    </div>
  );
}
