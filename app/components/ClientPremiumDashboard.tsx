"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/auth";
import Link from "next/link";
import OrderChatPanel from "@/app/components/OrderChatPanel";

export default function ClientPremiumDashboard() {
  const { userProfile } = useAuthStore();
  const [tab, setTab] = useState<
    | "orders"
    | "history"
    | "wallet"
    | "invoices"
    | "payments"
    | "addresses"
    | "favorites"
    | "loyalty"
    | "notifications"
    | "profile"
  >("orders");

  useEffect(() => {
    // placeholder: could subscribe to realtime data here
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Espace Client Premium</h1>
            <p className="text-sm text-gray-600">Bienvenue, {userProfile?.displayName || userProfile?.phone || 'Client'}.</p>
          </div>
          <div>
            <Link href="/settings" className="text-sm text-blue-600">Gérer mon profil</Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <nav className="flex gap-2 flex-wrap mb-4">
            {[
              ["orders", "Mes commandes"],
              ["history", "Historique"],
              ["wallet", "Wallet"],
              ["invoices", "Factures"],
              ["payments", "Paiements"],
              ["addresses", "Adresses favorites"],
              ["favorites", "Produits favoris"],
              ["loyalty", "Programme fidélité"],
              ["notifications", "Notifications"],
              ["profile", "Profil"],
            ].map(([key, label]) => (
              <button
                key={key as string}
                onClick={() => setTab(key as any)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${tab === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-4">
            {tab === "orders" && (
              <div>
                <h3 className="font-semibold mb-2">Mes commandes</h3>
                <p className="text-sm text-gray-600">Liste des commandes en cours et à venir (intégration Firestore requise).</p>
              </div>
            )}

            {tab === "history" && (
              <div>
                <h3 className="font-semibold mb-2">Historique</h3>
                <p className="text-sm text-gray-600">Toutes vos commandes passées et reçues (PDF export disponible).</p>
              </div>
            )}

            {tab === "wallet" && (
              <div>
                <h3 className="font-semibold mb-2">Wallet</h3>
                <p className="text-sm text-gray-600">Solde, top-up et virements (intégration paiement requise).</p>
              </div>
            )}

            {tab === "invoices" && (
              <div>
                <h3 className="font-semibold mb-2">Factures PDF</h3>
                <p className="text-sm text-gray-600">Télécharger vos factures au format PDF.</p>
              </div>
            )}

            {tab === "payments" && (
              <div>
                <h3 className="font-semibold mb-2">Paiements</h3>
                <p className="text-sm text-gray-600">Historique des paiements et méthodes enregistrées.</p>
              </div>
            )}

            {tab === "addresses" && (
              <div>
                <h3 className="font-semibold mb-2">Adresses favorites</h3>
                <p className="text-sm text-gray-600">Enregistrez vos adresses pour commander plus rapidement.</p>
              </div>
            )}

            {tab === "favorites" && (
              <div>
                <h3 className="font-semibold mb-2">Produits favoris</h3>
                <p className="text-sm text-gray-600">Gérez votre liste de produits favoris.</p>
              </div>
            )}

            {tab === "loyalty" && (
              <div>
                <h3 className="font-semibold mb-2">Programme fidélité</h3>
                <p className="text-sm text-gray-600">Consultez vos points et récompenses.</p>
              </div>
            )}

            {tab === "notifications" && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Notifications</h3>
                  <p className="text-sm text-gray-600">Notifications en temps réel (Firebase Cloud Messaging + Firestore).</p>
                </div>
                <OrderChatPanel orderId="demo-order" recipientName="Livreur" />
              </div>
            )}

            {tab === "profile" && (
              <div>
                <h3 className="font-semibold mb-2">Profil</h3>
                <p className="text-sm text-gray-600">Photo, nom, téléphone et préférences.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
