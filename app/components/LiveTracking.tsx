"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import type { Timestamp } from "firebase/firestore";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import { calculateDistanceKm, estimateArrivalMinutes } from "@/app/utils/commandUtils";

interface LiveTrackingProps {
  startCoords: [number, number];
  endCoords: [number, number];
  driverCoords?: [number, number] | null;
  driverStatus?: string;
  departLabel?: string;
  destinationLabel?: string;
  driverUpdatedAt?: Date | string | Timestamp;
}

const DEFAULT_CENTER: [number, number] = [14.7167, -17.4674];

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

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;
    map.fitBounds(points, { padding: [80, 80] });
  }, [map, points]);

  return null;
}

export default function LiveTracking({
  startCoords,
  endCoords,
  driverCoords,
  driverStatus,
  departLabel,
  destinationLabel,
  driverUpdatedAt,
}: LiveTrackingProps) {
  const [bearing, setBearing] = useState(0);
  const prevCoords = useRef<[number, number] | null>(null);

  const routePoints = useMemo(() => [startCoords, endCoords] as [number, number][], [startCoords, endCoords]);

  const bounds = useMemo(
    () => (driverCoords ? [startCoords, driverCoords, endCoords] : [startCoords, endCoords]),
    [startCoords, driverCoords, endCoords]
  );

  const distanceRemaining = useMemo(() => {
    const source = driverCoords || startCoords;
    return calculateDistanceKm(source[0], source[1], endCoords[0], endCoords[1]);
  }, [driverCoords, startCoords, endCoords]);

  const estimatedMinutes = useMemo(() => estimateArrivalMinutes(distanceRemaining), [distanceRemaining]);

  useEffect(() => {
    if (!driverCoords) return;
    if (!prevCoords.current) {
      prevCoords.current = driverCoords;
      return;
    }

    const [prevLat, prevLng] = prevCoords.current;
    const [nextLat, nextLng] = driverCoords;
    const dLat = nextLat - prevLat;
    const dLng = nextLng - prevLng;

    if (dLat !== 0 || dLng !== 0) {
      const nextBearing = (Math.atan2(dLng, dLat) * 180) / Math.PI;
      setBearing((nextBearing + 360) % 360);
    }

    prevCoords.current = driverCoords;
  }, [driverCoords]);

  const driverPositionLabel = driverCoords
    ? `Latitude ${driverCoords[0].toFixed(5)}, Longitude ${driverCoords[1].toFixed(5)}`
    : "Position du livreur en attente";

  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-xl border border-gray-200">
      <MapContainer center={DEFAULT_CENTER} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        <FitBounds points={bounds} />

        <Marker position={startCoords} icon={startIcon}>
          <Popup>
            <div className="text-sm font-semibold">
              🏠 Départ
              <div>{departLabel || "Point de départ"}</div>
            </div>
          </Popup>
        </Marker>

        <Marker position={endCoords} icon={endIcon}>
          <Popup>
            <div className="text-sm font-semibold">
              📍 Destination
              <div>{destinationLabel || "Destination"}</div>
            </div>
          </Popup>
        </Marker>

        {driverCoords && (
          <Marker position={driverCoords} icon={createDriverIcon(bearing)}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold">🚗 Livreur</p>
                <p>{driverStatus || "En route"}</p>
                <p>{driverPositionLabel}</p>
              </div>
            </Popup>
          </Marker>
        )}

        <Polyline positions={routePoints} pathOptions={{ color: "#2563eb", weight: 4 }} />
      </MapContainer>

      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10 w-56">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-600">📏 Distance restante</p>
            <p className="text-2xl font-bold text-blue-600">{distanceRemaining.toFixed(1)} km</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">⏱️ Temps estimé</p>
            <p className="text-2xl font-bold text-green-600">{estimatedMinutes} min</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10 w-72">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">🚚</div>
            <div>
              <p className="font-semibold text-sm">Position du livreur</p>
              <p className="text-xs text-gray-600">{driverPositionLabel}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600">Dernière mise à jour</p>
            <p className="text-sm text-gray-800">
              {driverUpdatedAt
                ? typeof driverUpdatedAt === "object" && "toDate" in driverUpdatedAt
                  ? driverUpdatedAt.toDate().toLocaleString("fr-FR")
                  : new Date(driverUpdatedAt).toLocaleString("fr-FR")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
