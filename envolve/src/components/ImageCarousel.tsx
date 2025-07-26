"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  // Add more image paths here
];

export default function ImageCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto aspect-video overflow-hidden rounded-2xl shadow-lg">
      {images.map((src, i) => (
        <Image
          key={i}
          src={src}
          alt={`Slide ${i + 1}`}
          width={1280}
          height={720}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
