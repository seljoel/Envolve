"use client";

import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<any>(null);

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
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

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
          {response?.gps?.lat !== undefined ? (
            <>
              <p>
                <strong>Image GPS:</strong> {response.gps.lat},{response.gps.lon}
              </p>
            </>
          ) : (
            <p>No GPS metadata found in image.</p>
          )}
        </div>
      )}
    </div>
  );
}
