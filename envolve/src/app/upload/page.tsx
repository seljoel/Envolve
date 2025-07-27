"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import LeafletMap to avoid SSR
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
});

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // Earth radius in km
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

  const handleUpload = async () => {
    if (!file) {
      return alert("Please select a file.");
    }

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
    <div className="p-4 space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <div className="h-64">
        <LeafletMap onSelect={(coords) => setUserCoords(coords)} />
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 mt-2 rounded"
      >
        Upload
      </button>

      {response && (
        <div className="mt-4 space-y-1">
          <p>
            <strong>Filename:</strong> {response.file}
          </p>

          {response?.gps?.lat !== undefined ? (
            <>
              <p>
                <strong>Image GPS:</strong> {response.gps.lat},{response.gps.lon}
              </p>
              {userCoords && (
                <>
                  <p>
                    <strong>User Location:</strong> {userCoords[0]},{userCoords[1]}
                  </p>
                  <p>
                    <strong>Distance:</strong>{" "}
                    {distance?.toFixed(2)} km
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {distance !== null && distance <= 25 ? "✅ Valid" : "❌ Invalid"}
                  </p>
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
