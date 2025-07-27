"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

export default function LeafletMap({
  onSelect,
}: {
  onSelect: (coords: [number, number]) => void;
}) {
  const [marker, setMarker] = useState<[number, number] | null>(null);

  function LocationSelector() {
    useMapEvents({
      click(e) {
        const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
        setMarker(coords);
        onSelect(coords);
      },
    });
    return marker ? <Marker position={marker} /> : null;
  }

  return (
    <MapContainer center={[20, 78]} zoom={4} className="h-full w-full rounded">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationSelector />
    </MapContainer>
  );
}
