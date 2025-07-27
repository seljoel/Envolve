"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import FloatingShape from "@/components/FloatingShape"; // <-- import your shape
// Dynamically import LeafletMap to avoid SSR
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { ssr: false });

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [shapes, setShapes] = useState<JSX.Element[]>([]); // 🌟 store shapes in state

  useEffect(() => {
    const numRows = 5;
    const numCols = 3;
    const jitter = 10;

    const generated = Array.from({ length: numRows * numCols }, (_, i) => {
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
            opacity: 0.25,
          }}
        />
      );
    });

    setShapes(generated);
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8080/extract", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResponse(data);

    if (data?.gps?.lat !== undefined && userCoords) {
      const d = haversineDistance(
        data.gps.lat,
        data.gps.lon,
        userCoords[0],
        userCoords[1]
      );
      setDistance(d);
    } else {
      setDistance(null);
    }
  };

  return (
    <div className="relative p-4 space-y-4 bg-gray-100 min-h-screen overflow-hidden">
      {/* Floating Background Shapes */}
      {shapes}

      {/* Upload Form */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="bg-white p-2 rounded text-black z-10 relative"
      />

      <div className="h-64 z-10 relative">
        <LeafletMap onSelect={(coords) => setUserCoords(coords)} />
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 mt-2 rounded z-10 relative"
      >
        Upload
      </button>

      {response && (
        <div className="mt-4 space-y-1 bg-white p-4 rounded shadow text-black z-10 relative">
          <p><strong>Filename:</strong> {response.file}</p>
          {response?.gps?.lat !== undefined ? (
            <>
              <p><strong>Image GPS:</strong> {response.gps.lat},{response.gps.lon}</p>
              {userCoords && (
                <>
                  <p><strong>User Location:</strong> {userCoords[0]},{userCoords[1]}</p>
                  <p><strong>Distance:</strong> {distance?.toFixed(2)} km</p>
                  <p><strong>Status:</strong> {distance !== null && distance <= 25 ? "✅ Valid" : "❌ Invalid"}</p>
                </>
              )}
            </>
          ) : (
            <p>No GPS metadata found in image.</p>
          )}
        </div>
      )}
    </div>
  );
}
