"use client";

import { useEffect, useState, useRef } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

interface LiveTrackingProps {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  driverId?: string;
  orderId?: string;
}

const createDriverIcon = (bearing: number) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <g transform="translate(20,20) rotate(${bearing})">
        <rect
          x="-8"
          y="-12"
          width="16"
          height="24"
          rx="2"
          fill="#3b82f6"
          stroke="white"
          stroke-width="2"
        />
        <polygon points="0,-15 6,-8 -6,-8" fill="white"/>
        <rect x="-6" y="-8" width="12" height="6" fill="#60a5fa"/>
      </g>
    </svg>
  `;

  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const startIcon = L.icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%2322c55e' stroke='white' stroke-width='2'/%3E%3Ccircle cx='12' cy='12' r='4' fill='white'/%3E%3C/svg%3E",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const endIcon = L.icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12c0 7 10 12 10 12s10-5 10-12c0-5.52-4.48-10-10-10z' fill='%23ef4444'/%3E%3Ccircle cx='12' cy='11' r='3' fill='white'/%3E%3C/svg%3E",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

export default function LiveTracking({
  startLat,
  startLng,
  endLat,
  endLng,
}: LiveTrackingProps) {
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bearing, setBearing] = useState(0);

  const prevPos = useRef<{ lat: number; lng: number } | null>(null);

  const driver = {
    latitude: startLat,
    longitude: startLng,
    name: "Livreur",
    speed: 40,
    status: "on_way",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (driver && prevPos.current) {
        const dLat = driver.latitude - prevPos.current.lat;
        const dLng = driver.longitude - prevPos.current.lng;

        if (dLat !== 0 || dLng !== 0) {
          const newBearing =
            (Math.atan2(dLng, dLat) * 180) / Math.PI;

          setBearing((newBearing + 360) % 360);
        }
      }

      if (driver) {
        prevPos.current = {
          lat: driver.latitude,
          lng: driver.longitude,
        };
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [driver]);

  const center: [number, number] = [
    (startLat + endLat) / 2,
    (startLng + endLng) / 2,
  ];

  useEffect(() => {
    const calcDistance = () => {
      const dx = endLat - startLat;
      const dy = endLng - startLng;

      const dist = Math.sqrt(dx * dx + dy * dy) * 111;

      setDistance(dist);
      setDuration(Math.ceil(dist * 2));
    };

    calcDistance();
  }, [startLat, startLng, endLat, endLng]);

  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-xl border border-gray-200">
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        <Marker
          position={[startLat, startLng]}
          icon={startIcon}
        >
          <Popup>
            <div className="text-sm font-semibold">
              🏠 Départ
            </div>
          </Popup>
        </Marker>

        <Marker
          position={[endLat, endLng]}
          icon={endIcon}
        >
          <Popup>
            <div className="text-sm font-semibold">
              📍 Destination
            </div>
          </Popup>
        </Marker>

        <Marker
          position={[driver.latitude, driver.longitude]}
          icon={createDriverIcon(bearing)}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold">
                🚗 {driver.name}
              </p>

              <p className="text-xs text-gray-600">
                {driver.speed.toFixed(0)} km/h
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-600">
              📏 Distance
            </p>

            <p className="text-2xl font-bold text-blue-600">
              {distance.toFixed(1)} km
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-600">
              ⏱️ Durée
            </p>

            <p className="text-2xl font-bold text-green-600">
              {duration} min
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
            👤
          </div>

          <div>
            <p className="font-semibold text-sm">
              {driver.name}
            </p>

            <p className="text-xs text-gray-600">
              {driver.status === "on_way"
                ? "🚗 En route"
                : "✅ Livré"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}