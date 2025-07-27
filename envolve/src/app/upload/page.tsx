"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import LeafletMap (client-only)
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
});

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [response, setResponse] = useState<any>(null);

  const handleUpload = async () => {
    if (!file || !userCoords) {
      return alert("Please select a file and a location on the map.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_lat", String(userCoords[0]));
    formData.append("user_lon", String(userCoords[1]));

    const res = await fetch("http://localhost:8080/extract", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <div className="mt-4 h-64">
        <LeafletMap onLocationSelect={(coords) => setUserCoords(coords)} />
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 mt-2 rounded"
      >
        Upload
      </button>

      {response && (
        <div className="mt-4">
          <p>
            <strong>Filename:</strong> {response.file}
          </p>
          {response.gps?.lat ? (
            <>
              <p>
                <strong>Image GPS:</strong> {response.gps.lat},{response.gps.lon}
              </p>
              <p>
                <strong>User Selected:</strong> {response.user_coords.lat},
                {response.user_coords.lon}
              </p>
              <p>
                <strong>Distance (km):</strong> {response.distance_km.toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {response.is_valid ? "✅ Valid" : "❌ Invalid"}
              </p>
            </>
          ) : (
            <p>No GPS data found</p>
          )}
        </div>
      )}
    </div>
  );
}
