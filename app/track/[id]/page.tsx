"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Command, subscribeToCommand } from "@/app/utils/firestoreCommands";
import { QUARTIERS_COORDS } from "@/app/utils/tarifs";
import { calculateDistanceKm, estimateArrivalMinutes } from "@/app/utils/commandUtils";

const LiveTracking = dynamic(
  () => import("@/app/components/LiveTracking"),
  { ssr: false }
);

const DEFAULT_CENTER: [number, number] = [14.7167, -17.4674];

const parseCommandLocation = (value?: string): [number, number] | null => {
  if (!value) return null;
  const cleaned = value.trim();

  const parts = cleaned.split(",").map((part) => part.trim());
  if (parts.length === 2) {
    const lat = Number(parts[0]);
    const lng = Number(parts[1]);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      return [lat, lng];
    }
  }

  if (cleaned in QUARTIERS_COORDS) {
    return QUARTIERS_COORDS[cleaned as keyof typeof QUARTIERS_COORDS];
  }

  return null;
};

export default function TrackingPage() {
  const params = useParams();
  const id = params.id as string;
  const noId = !id;
  const [command, setCommand] = useState<Command | null>(null);
  const [loading, setLoading] = useState(!noId);
  const [error, setError] = useState<string | null>(noId ? "ID de commande introuvable" : null);

  useEffect(() => {
    if (noId) return;

    const unsubscribe = subscribeToCommand(id, (cmd) => {
      if (!cmd) {
        setError("Commande introuvable");
        setCommand(null);
        setLoading(false);
        return;
      }
      setCommand(cmd);
      setLoading(false);
      setError(null);
    });

    return () => {
      unsubscribe?.();
    };
  }, [id, noId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement du suivi...</p>
        </div>
      </div>
    );
  }

  if (error || !command) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">{error || "Commande non trouvée"}</p>
          <Link href="/commands" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Retour aux commandes
          </Link>
        </div>
      </div>
    );
  }

  const startCoords = parseCommandLocation(command.depart) || DEFAULT_CENTER;
  const endCoords = parseCommandLocation(command.address || command.destination) || DEFAULT_CENTER;
  const driverCoords =
    command.driverLatitude !== undefined && command.driverLongitude !== undefined
      ? [command.driverLatitude, command.driverLongitude] as [number, number]
      : null;

  const distanceRemaining = driverCoords && endCoords
    ? calculateDistanceKm(driverCoords[0], driverCoords[1], endCoords[0], endCoords[1])
    : calculateDistanceKm(startCoords[0], startCoords[1], endCoords[0], endCoords[1]);

  const estimatedMinutes = estimateArrivalMinutes(distanceRemaining);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/commands" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
            ← Retour aux commandes
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            🚗 Suivi de Livraison
          </h1>
          <p className="text-gray-600 mt-2">Commande #{command.id?.slice(0, 8)}</p>
        </div>

        {/* Map */}
        <div className="mb-8">
          <LiveTracking
            startCoords={startCoords}
            endCoords={endCoords}
            driverCoords={driverCoords}
            driverStatus={command.driverStatus}
            departLabel={command.depart}
            destinationLabel={command.address || command.destination}
            driverUpdatedAt={command.driverUpdatedAt}
          />
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Détails de la Commande</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-semibold text-gray-800">{command.client || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-semibold text-gray-800">{command.telephone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Distance restante</p>
                <p className="font-semibold text-gray-800">{distanceRemaining.toFixed(1)} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Temps estimé d&apos;arrivée</p>
                <p className="font-semibold text-gray-800">{estimatedMinutes} min</p>
              </div>
            </div>
          </div>

          {/* Right Column - Status */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📍 État de Livraison</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">Statut</p>
                <p className="font-bold text-lg text-blue-600 capitalize">{command.statut || "Inconnu"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dernière mise à jour GPS</p>
                <p className="font-semibold text-gray-800">
                  {command.driverUpdatedAt
                    ? typeof command.driverUpdatedAt === "object" && "toDate" in command.driverUpdatedAt
                      ? command.driverUpdatedAt.toDate().toLocaleString("fr-FR")
                      : new Date(command.driverUpdatedAt).toLocaleString("fr-FR")
                    : "Non disponible"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Statut du livreur</p>
                <p className="font-semibold text-gray-800">{command.driverStatus || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⏱️ Historique</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
              <div>
                <p className="font-semibold text-gray-800">Commande créée</p>
                <p className="text-sm text-gray-600">
                  {command.createdAt
                    ? new Date(command.createdAt as unknown as string).toLocaleString("fr-FR")
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className={`flex items-center ${command.statut !== "en attente" ? "opacity-100" : "opacity-50"}`}>
              <div className={`w-3 h-3 rounded-full ${command.statut !== "en attente" ? "bg-blue-500" : "bg-gray-300"} mr-3`}></div>
              <div>
                <p className="font-semibold text-gray-800">Traitement</p>
                <p className="text-sm text-gray-600">En cours...</p>
              </div>
            </div>
            <div className={`flex items-center ${command.statut === "livrée" ? "opacity-100" : "opacity-50"}`}>
              <div className={`w-3 h-3 rounded-full ${command.statut === "livrée" ? "bg-orange-500" : "bg-gray-300"} mr-3`}></div>
              <div>
                <p className="font-semibold text-gray-800">Livraison</p>
                <p className="text-sm text-gray-600">
                  {command.dateLivraison
                    ? new Date(command.dateLivraison as unknown as string).toLocaleDateString("fr-FR")
                    : "En attente"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
