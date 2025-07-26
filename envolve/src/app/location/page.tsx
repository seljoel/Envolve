"use client";

import { useEffect, useState } from "react";

export default function LocationPage() {
  const [locationData, setLocationData] = useState<string>("Loading...");

  useEffect(() => {
    fetch("http://localhost:8080/location") // <-- FastAPI endpoint
      .then((res) => res.json())
      .then((data) => {
        setLocationData(JSON.stringify(data));
      })
      .catch((err) => {
        console.error(err);
        setLocationData("Error fetching data");
      });
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Location Data</h1>
        <pre className="bg-gray-100 p-4 rounded">{locationData}</pre>
      </div>
    </main>
  );
}
