"use client";

import { useState } from "react";
import { createCommand } from "@/app/utils/firestoreCommands";
import Link from "next/link";
import { QUARTIERS_DAKAR } from "@/app/utils/tarifs";

interface AddCommandFormProps {
  onCommandAdded?: () => void;
}

export default function AddCommandForm({ onCommandAdded }: AddCommandFormProps) {
  const [formData, setFormData] = useState({
    telephone: "",
    client: "",
    depart: "",
    destination: "",
    prix: 0,
    dateLivraison: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "prix" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!formData.telephone || !formData.depart || !formData.destination) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }

    setIsLoading(true);
    try {
      const dateLivraison = formData.dateLivraison
        ? new Date(formData.dateLivraison)
        : (() => {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            return date;
          })();

      await createCommand({
        telephone: formData.telephone,
        client: formData.client || formData.telephone,
        depart: formData.depart,
        destination: formData.destination,
        prix: formData.prix,
        statut: "en attente",
        dateLivraison,
        notes: formData.notes,
      });

      setSuccessMessage("✅ Commande créée avec succès!");
      setTimeout(() => setSuccessMessage(""), 3000);

      // Reset form
      setFormData({
        telephone: "",
        client: "",
        depart: "",
        destination: "",
        prix: 0,
        dateLivraison: "",
        notes: "",
      });

      onCommandAdded?.();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la création de la commande");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        ➕ Ajouter une commande
      </h2>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Téléphone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📱 Téléphone *
            </label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="+221 77 XXX XX XX"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Client */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              👤 Nom du client
            </label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              placeholder="Nom du client"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Départ */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🏠 Départ *
            </label>
            <select
              name="depart"
              value={formData.depart}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner...</option>
              {QUARTIERS_DAKAR.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📍 Destination *
            </label>
            <select
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner...</option>
              {QUARTIERS_DAKAR.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          {/* Prix */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💰 Prix (FCFA)
            </label>
            <input
              type="number"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date de livraison */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📅 Date de livraison
            </label>
            <input
              type="date"
              name="dateLivraison"
              value={formData.dateLivraison}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📝 Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes supplémentaires..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Boutons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? "⏳ Création..." : "✅ Créer la commande"}
          </button>
          <Link
            href="/commands"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors text-center"
          >
            📦 Voir l'historique
          </Link>
        </div>
      </form>
    </div>
  );
}
