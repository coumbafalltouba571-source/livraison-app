import type { Command } from "./firestoreCommands";

export function getShortOrderNumber(commandId?: string): string {
  if (!commandId) return "";
  const normalized = commandId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (!normalized) return "";

  const prefix = "GDN";
  const suffix = normalized.slice(-4);
  return `#${prefix}${suffix}`;
}

export function normalizeOrderSearchValue(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

const ADMIN_WHATSAPP_PHONE = "221773629075";

export function formatPhoneForWhatsApp(phone: string): string {
  const normalized = phone.replace(/[\s\-()]/g, "");
  if (normalized.startsWith("+")) {
    return normalized.replace("+", "");
  }
  if (normalized.startsWith("00")) {
    return normalized.slice(2);
  }
  return normalized;
}

export function getAdminWhatsAppUrl(command: Command): string {
  const clientName = command.client || command.nomClient || command.customerName || "N/A";
  const product = command.orderItems && command.orderItems.length > 0
    ? command.orderItems.map((item) => `${item.quantity}x ${item.productName}`).join(", ")
    : command.productName || "N/A";
  const address = command.address || command.destination || "N/A";
  const prix = (command.prix || command.total || 0).toLocaleString("fr-FR");
  const payment = command.modePayement || command.paymentMethod || "N/A";
  const depart = command.depart || "N/A";
  const destination = command.destination || command.address || "N/A";
  const message =
    `Bonjour, bonjour 👋\n\n` +
    `Je vous contacte au sujet de ma commande. Voici les détails :\n\n` +
    `ID : ${command.id || "N/A"}\n` +
    `Client : ${clientName}\n` +
    `Téléphone : ${command.telephone || "N/A"}\n` +
    `Départ : ${depart}\n` +
    `Destination : ${destination}\n` +
    `Produit(s) : ${product}\n` +
    `Prix : ${prix} FCFA\n` +
    `Paiement : ${payment}\n` +
    `Statut : ${command.statut || "N/A"}\n\n` +
    `Merci.`;

  return `https://wa.me/${ADMIN_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppShareMessage(command: Command): string {
  const shortId = getShortOrderNumber(command.id);
  const customerName = command.client || command.nomClient || command.customerName || "N/A";
  const paymentMethod = command.modePayement || command.paymentMethod || "N/A";
  const destination = command.destination || command.address || "N/A";

  return (
    `📦 LIVRAISON PRO\n\n` +
    `Commande confirmée\n\n` +
    `Numéro :\n${shortId}\n\n` +
    `ID :\n${command.id || "N/A"}\n\n` +
    `Client :\n${customerName}\n\n` +
    `Téléphone :\n${command.telephone}\n\n` +
    `Départ :\n${command.depart}\n\n` +
    `Destination :\n${destination}\n\n` +
    `Prix :\n${command.prix.toLocaleString("fr-FR")} FCFA\n\n` +
    `Paiement :\n${paymentMethod}\n\n` +
    `Statut :\n${command.statut}\n\n` +
    `Merci d'avoir utilisé Livraison Pro.`
  );
}

export function getWhatsAppShareUrl(command: Command): string {
  const encoded = encodeURIComponent(getWhatsAppShareMessage(command));
  return `https://wa.me/?text=${encoded}`;
}

export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (degree: number) => (degree * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function estimateArrivalMinutes(distanceKm: number, speedKmh = 35): number {
  if (!distanceKm || distanceKm <= 0) return 0;
  return Math.max(1, Math.ceil((distanceKm / speedKmh) * 60));
}
