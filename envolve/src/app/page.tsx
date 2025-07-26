import Link from "next/link";
import ImageCarousel from "@/components/ImageCarousel";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-4xl font-bold">Home Page</h1>

      {/* Image slideshow component */}
      <ImageCarousel />

      {/* Navigation link */}
      <Link
        href="/about"
        className="text-blue-600 underline hover:text-blue-800"
      >
        Go to About Page
      </Link>
    </main>
  );
}
