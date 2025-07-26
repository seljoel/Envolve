import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">About Page</h1>

      <Link
        href="/"
        className="text-blue-600 underline hover:text-blue-800"
      >
        Back to Home
      </Link>
    </main>
  );
}
