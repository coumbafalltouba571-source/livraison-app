"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getCommandById, Command } from "@/app/utils/firestoreCommands";

const LiveTracking = dynamic(
  () => import("@/app/components/LiveTracking"),
  { ssr: false }
);

export default function TrackingPage() {
  const params = useParams();
  const id = params.id as string;
  const [command, setCommand] = useState<Command | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCommand = async () => {
      try {
        if (!id) throw new Error("Command ID not found");
        const cmd = await getCommandById(id);
        if (!cmd) throw new Error("Command not found");
        setCommand(cmd);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load command");
      } finally {
        setLoading(false);
      }
    };

    loadCommand();
  }, [id]);

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
          <a href="/commands" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Retour aux commandes
          </a>
        </div>
      </div>
    );
  }

  // Parse coordinates from the command (assuming they're stored as "latitude,longitude")
  const parseCoords = (coordStr: string): [number, number] => {
    const [lat, lng] = coordStr.split(",").map(Number);
    return [lat || 48.8566, lng || 2.3522]; // Default to Paris
  };

  const [startLat, startLng] = parseCoords(command.depart || "48.8566,2.3522");
  const [endLat, endLng] = parseCoords(command.destination || "48.8566,2.3522");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a href="/commands" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
            ← Retour aux commandes
          </a>
          <h1 className="text-3xl font-bold text-gray-800">
            🚗 Suivi de Livraison
          </h1>
          <p className="text-gray-600 mt-2">Commande #{command.id?.slice(0, 8)}</p>
        </div>

        {/* Map */}
        <div className="mb-8">
          <LiveTracking
            startLat={startLat}
            startLng={startLng}
            endLat={endLat}
            endLng={endLng}
            orderId={command.id}
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
                <p className="text-sm text-gray-600">Prix</p>
                <p className="font-semibold text-blue-600 text-lg">{command.prix || "0"} €</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Notes</p>
                <p className="font-semibold text-gray-800">{command.notes || "Aucune"}</p>
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
                <p className="text-sm text-gray-600">Date de Livraison Prévue</p>
                <p className="font-semibold text-gray-800">
                  {command.dateLivraison
                    ? new Date(command.dateLivraison as any).toLocaleDateString("fr-FR")
                    : "Non définie"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Créée le</p>
                <p className="font-semibold text-gray-800">
                  {command.createdAt
                    ? new Date(command.createdAt as any).toLocaleString("fr-FR")
                    : "N/A"}
                </p>
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
                    ? new Date(command.createdAt as any).toLocaleString("fr-FR")
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
                    ? new Date(command.dateLivraison as any).toLocaleDateString("fr-FR")
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
