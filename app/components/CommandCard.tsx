"use client";

import { Command, updateCommandStatus, deleteCommand } from "@/app/utils/firestoreCommands";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { getShortOrderNumber, getAdminWhatsAppUrl } from "@/app/utils/commandUtils";

interface CommandCardProps {
  command: Command;
  onUpdate: () => void;
  showDetails?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  "en attente": "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmée: "bg-blue-100 text-blue-800 border-blue-300",
  "en cours de traitement": "bg-purple-100 text-purple-800 border-purple-300",
  "en livraison": "bg-pink-100 text-pink-800 border-pink-300",
  livrée: "bg-green-100 text-green-800 border-green-300",
  annulée: "bg-red-100 text-red-800 border-red-300",
};

const STATUS_ICONS: Record<string, string> = {
  "en attente": "⏳",
  confirmée: "✅",
  "en cours de traitement": "🔄",
  "en livraison": "🚚",
  livrée: "📦",
  annulée: "❌",
};

const isValidProductImage = (image?: string): image is string =>
  !!image && (image.startsWith("/") || image.startsWith("http://") || image.startsWith("https://"));

export default function CommandCard({ command, onUpdate, showDetails = false }: CommandCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusOptions = [
    "en attente",
    "confirmée",
    "en cours de traitement",
    "en livraison",
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
    command.createdAt instanceof Date ? command.createdAt : new Date(command.createdAt as unknown as string);
  const orderItems =
    command.orderItems && command.orderItems.length > 0
      ? command.orderItems
      : command.productName
        ? [
            {
              productId: command.productId || "",
              productName: command.productName,
              productImage: isValidProductImage(command.productImage?.split(",")[0])
                ? command.productImage?.split(",")[0] || ""
                : "",
              quantity: command.quantity || 1,
              price: command.price || command.prix,
              total: command.total || command.prix,
            },
          ]
        : [];
  const firstProductImage = isValidProductImage(orderItems[0]?.productImage)
    ? orderItems[0]?.productImage
    : "";
  const deliveryAddress = command.address || command.destination;
  const orderNumber = getShortOrderNumber(command.id);
  const isDelivered = command.statut === "livrée";
  const statusRealTimeText = isDelivered
    ? "✅ Commande livrée."
    : `Statut en temps réel : ${command.statut}`;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {showDetails && (
        <div className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex flex-col gap-3 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">📋 Détails de la commande</div>
            <div>Numéro de commande : <span className="font-semibold">{orderNumber}</span></div>
            <div>ID Firestore : <span className="font-mono break-all">{command.id}</span></div>
            <div>Date : {format(createdDate, "dd MMM yyyy HH:mm", { locale: fr })}</div>
            <div>Client : {command.client || command.nomClient || command.customerName || "N/A"}</div>
            <div>Téléphone : {command.telephone}</div>
            <div>Départ : {command.depart}</div>
            <div>Destination : {deliveryAddress}</div>
            <div>Description : {command.description || "N/A"}</div>
            <div>Prix : {command.prix.toLocaleString()} FCFA</div>
            <div>Paiement : {command.modePayement || command.paymentMethod || "N/A"}</div>
            <div>Statut : {command.statut}</div>
          </div>
        </div>
      )}

      {firstProductImage && (
        <div className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          <Image
            src={firstProductImage}
            alt={orderItems[0]?.productName || "Produit commandé"}
            width={480}
            height={176}
            className="h-44 w-full object-contain p-3"
          />
        </div>
      )}

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
        {orderItems.length > 0 && (
          <div className="flex items-start gap-3 bg-gray-50 p-3 rounded">
            <span className="text-xl">📦</span>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Produit commandé</p>
              <div className="space-y-2">
                {orderItems.map((item) => (
                  <div key={`${item.productId}-${item.productName}`} className="text-sm text-gray-900">
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-gray-600">
                      Prix: {item.price.toLocaleString()} FCFA · Quantité: {item.quantity} · Total: {item.total.toLocaleString()} FCFA
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
            <p className="text-gray-900 font-medium">{deliveryAddress}</p>
          </div>
        </div>

        {deliveryAddress && (
          <div className="flex items-start gap-2">
            <span className="text-xl">📍</span>
            <div>
              <p className="text-sm text-gray-500">Adresse livraison</p>
              <p className="text-gray-900 font-medium">{deliveryAddress}</p>
            </div>
          </div>
        )}

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
                    : new Date(command.dateLivraison as unknown as string),
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-200">
        <a
          href={`tel:${command.telephone}`}
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center text-sm"
        >
          📞 Appeler
        </a>
        <a
          href={getAdminWhatsAppUrl(command)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-green-400 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center text-sm"
        >
          💬 WhatsApp
        </a>
        <button
          type="button"
          onClick={async () => {
            if (!command.id) return;
            try {
              await navigator.clipboard.writeText(command.id);
              alert("✅ ID copié dans le presse-papiers.");
            } catch (err) {
              console.error("Erreur copie ID :", err);
              alert("Erreur lors de la copie de l'ID.");
            }
          }}
          className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center text-sm"
        >
          📋 Copier l'ID
        </button>
        <Link
          href={`/?depart=${encodeURIComponent(command.depart || "")}&destination=${encodeURIComponent(deliveryAddress || "")}&telephone=${encodeURIComponent(command.telephone || "")}&client=${encodeURIComponent(
            command.client || command.nomClient || command.customerName || ""
          )}`}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center text-sm"
        >
          🔄 Commander à nouveau
        </Link>
        <Link
          href={`/track/${command.id}`}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center text-sm"
        >
          📍 Suivre la commande
        </Link>
        {showDetails && (
          <div className="sm:col-span-2 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 text-sm">
            {statusRealTimeText}
          </div>
        )}
      </div>
      {showDetails && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="font-semibold text-slate-900 mb-1">Description</div>
            <div>{command.description || "N/A"}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="font-semibold text-slate-900 mb-1">Paiement</div>
            <div>{command.modePayement || command.paymentMethod || "N/A"}</div>
          </div>
        </div>
      )}
    </div>
  );
}
