"use client";

import { Command, updateCommandStatus, deleteCommand } from "@/app/utils/firestoreCommands";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CommandCardProps {
  command: Command;
  onUpdate: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  "en attente": "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmée: "bg-blue-100 text-blue-800 border-blue-300",
  "en cours": "bg-purple-100 text-purple-800 border-purple-300",
  livrée: "bg-green-100 text-green-800 border-green-300",
  annulée: "bg-red-100 text-red-800 border-red-300",
};

const STATUS_ICONS: Record<string, string> = {
  "en attente": "⏳",
  confirmée: "✅",
  "en cours": "🚗",
  livrée: "📦",
  annulée: "❌",
};

export default function CommandCard({ command, onUpdate }: CommandCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusOptions = [
    "en attente",
    "confirmée",
    "en cours",
    "livrée",
    "annulée",
  ];

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === command.statut) {
      setShowStatusMenu(false);
      return;
    }

    setIsUpdating(true);
    try {
      if (command.id) {
        await updateCommandStatus(command.id, newStatus);
        setShowStatusMenu(false);
        onUpdate();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      return;
    }

    setIsDeleting(true);
    try {
      if (command.id) {
        await deleteCommand(command.id);
        onUpdate();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const createdDate =
    command.createdAt instanceof Date ? command.createdAt : new Date(command.createdAt as any);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header avec statut */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{STATUS_ICONS[command.statut] || "📋"}</span>
          <div>
            <h3 className="font-semibold text-gray-900">
              {command.client || "Client"}
            </h3>
            <p className="text-sm text-gray-500">
              {format(createdDate, "dd MMM yyyy HH:mm", { locale: fr })}
            </p>
          </div>
        </div>

        {/* Statut Badge */}
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            disabled={isUpdating}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-all cursor-pointer hover:shadow-md ${
              STATUS_COLORS[command.statut]
            } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {command.statut}
          </button>

          {/* Dropdown menu */}
          {showStatusMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      status === command.statut
                        ? "bg-gray-100 font-semibold text-gray-900"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {STATUS_ICONS[status]} {status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Détails de la commande */}
      <div className="space-y-3 mb-4">
        {/* Route */}
        <div className="flex items-start gap-3">
          <span className="text-xl">📍</span>
          <div>
            <p className="text-sm text-gray-500">Route</p>
            <p className="text-gray-900 font-medium">{command.depart}</p>
            <div className="flex items-center gap-2 my-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <p className="text-xs text-gray-400">vers</p>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
            <p className="text-gray-900 font-medium">{command.destination}</p>
          </div>
        </div>

        {/* Prix et téléphone */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <span className="text-xl">💰</span>
            <div>
              <p className="text-sm text-gray-500">Prix</p>
              <p className="text-lg font-bold text-gray-900">
                {command.prix.toLocaleString()} FCFA
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xl">📞</span>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <a
                href={`tel:${command.telephone}`}
                className="text-lg font-semibold text-blue-600 hover:text-blue-800"
              >
                {command.telephone}
              </a>
            </div>
          </div>
        </div>

        {/* Date livraison si définie */}
        {command.dateLivraison && (
          <div className="flex items-start gap-2">
            <span className="text-xl">📅</span>
            <div>
              <p className="text-sm text-gray-500">Date de livraison</p>
              <p className="text-gray-900 font-medium">
                {format(
                  command.dateLivraison instanceof Date
                    ? command.dateLivraison
                    : new Date(command.dateLivraison as any),
                  "dd MMM yyyy",
                  { locale: fr }
                )}
              </p>
            </div>
          </div>
        )}

        {/* Notes si définies */}
        {command.notes && (
          <div className="flex items-start gap-2 bg-gray-50 p-3 rounded">
            <span className="text-xl">📝</span>
            <div>
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-gray-900 text-sm">{command.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <a
          href={`tel:${command.telephone}`}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center text-sm"
        >
          📞 Appeler
        </a>
        <a
          href={`https://wa.me/221${command.telephone.replace(/\s/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-green-400 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center text-sm"
        >
          💬 WhatsApp
        </a>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          🗑️ {isDeleting ? "..." : "Supprimer"}
        </button>
      </div>
    </div>
  );
}
