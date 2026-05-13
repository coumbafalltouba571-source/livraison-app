"use client";

import { useEffect, useState } from "react";
import { Command, getAllCommands } from "@/app/utils/firestoreCommands";
import CommandCard from "@/app/components/CommandCard";
import AddCommandForm from "@/app/components/AddCommandForm";
import Link from "next/link";

type StatusFilter = "tous" | "en attente" | "confirmée" | "en cours" | "livrée" | "annulée";

export default function CommandsManagementPage() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("tous");
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    inProgress: 0,
    delivered: 0,
    cancelled: 0,
  });

  const loadCommands = async () => {
    setLoading(true);
    try {
      const allCommands = await getAllCommands();
      setCommands(allCommands);

      // Calculer les stats
      const statsObj = {
        total: allCommands.length,
        pending: allCommands.filter((c) => c.statut === "en attente").length,
        confirmed: allCommands.filter((c) => c.statut === "confirmée").length,
        inProgress: allCommands.filter((c) => c.statut === "en cours").length,
        delivered: allCommands.filter((c) => c.statut === "livrée").length,
        cancelled: allCommands.filter((c) => c.statut === "annulée").length,
      };
      setStats(statsObj);

      // Appliquer le filtre
      if (selectedStatus === "tous") {
        setFilteredCommands(allCommands);
      } else {
        setFilteredCommands(
          allCommands.filter((c) => c.statut === selectedStatus)
        );
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommands();
  }, []);

  useEffect(() => {
    if (selectedStatus === "tous") {
      setFilteredCommands(commands);
    } else {
      setFilteredCommands(commands.filter((c) => c.statut === selectedStatus));
    }
  }, [selectedStatus, commands]);

  const statBoxes = [
    { label: "Total", value: stats.total, color: "bg-gray-100", icon: "📦" },
    { label: "En attente", value: stats.pending, color: "bg-yellow-100", icon: "⏳" },
    { label: "Confirmées", value: stats.confirmed, color: "bg-blue-100", icon: "✅" },
    { label: "En cours", value: stats.inProgress, color: "bg-purple-100", icon: "🚗" },
    { label: "Livrées", value: stats.delivered, color: "bg-green-100", icon: "📦" },
    { label: "Annulées", value: stats.cancelled, color: "bg-red-100", icon: "❌" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📦 Gestion des commandes</h1>
              <p className="text-gray-600 mt-1">Tableau de bord complet de suivi</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                🏠 Accueil
              </Link>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                {showForm ? "✖️ Fermer" : "➕ Nouvelle commande"}
              </button>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {statBoxes.map((stat) => (
              <button
                key={stat.label}
                onClick={() => setSelectedStatus(
                  stat.label === "Total" 
                    ? "tous" 
                    : (stat.label === "En attente" 
                        ? "en attente" 
                        : stat.label === "Confirmées"
                        ? "confirmée"
                        : stat.label === "En cours"
                        ? "en cours"
                        : stat.label === "Livrées"
                        ? "livrée"
                        : "annulée") as StatusFilter
                )}
                className={`p-4 rounded-lg transition-all hover:shadow-md cursor-pointer ${
                  stat.color
                } ${
                  (selectedStatus === "tous" && stat.label === "Total") ||
                  (selectedStatus !== "tous" && 
                    ((selectedStatus === "en attente" && stat.label === "En attente") ||
                     (selectedStatus === "confirmée" && stat.label === "Confirmées") ||
                     (selectedStatus === "en cours" && stat.label === "En cours") ||
                     (selectedStatus === "livrée" && stat.label === "Livrées") ||
                     (selectedStatus === "annulée" && stat.label === "Annulées")))
                    ? "ring-2 ring-offset-2 ring-blue-500"
                    : ""
                }`}
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Formulaire */}
        {showForm && (
          <div className="mb-8">
            <AddCommandForm onCommandAdded={loadCommands} />
          </div>
        )}

        {/* Filtre visible */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["tous", "en attente", "confirmée", "en cours", "livrée", "annulée"] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedStatus === status
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600"
              }`}
            >
              {status === "tous" ? "Tous les statuts" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Chargement */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin">
              <div className="text-4xl">⏳</div>
            </div>
            <p className="text-gray-600 ml-4">Chargement des commandes...</p>
          </div>
        )}

        {/* Liste des commandes */}
        {!loading && filteredCommands.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Aucune commande trouvée
            </h2>
            <p className="text-gray-600 mb-6">
              {selectedStatus === "tous"
                ? "Créez une nouvelle commande pour commencer"
                : `Aucune commande avec le statut "${selectedStatus}"`}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Créer une commande
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommands.map((command) => (
              <CommandCard
                key={command.id}
                command={command}
                onUpdate={loadCommands}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
