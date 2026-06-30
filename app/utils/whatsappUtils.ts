import { Command } from "./firestoreCommands";

// Numéro WhatsApp de l'admin
const ADMIN_PHONE = "221773629075";

function normalizePhoneForWhatsApp(phone?: string): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/\D/g, "");
  if (!cleaned) return null;
  if (cleaned.startsWith("0")) {
    return `221${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith("221")) {
    return cleaned;
  }
  return `221${cleaned}`;
}

function getOrderItemsSummary(command: Command): string {
  const items = command.orderItems && command.orderItems.length > 0
    ? command.orderItems
    : command.productName
      ? [{ productName: command.productName, quantity: command.quantity || 1, total: command.total || command.prix }]
      : [];

  if (items.length === 0) {
    return "Non spécifié";
  }

  return items.map((item) => `${item.quantity}x ${item.productName}`).join(", ");
}

export function sendWhatsAppToClient(command: Command): void {
  if (typeof window === "undefined") return;

  const clientPhone = normalizePhoneForWhatsApp(command.telephone || command.phone || "");
  if (!clientPhone) {
    console.warn("ℹ️ Pas de numéro client disponible pour WhatsApp.", command.id);
    return;
  }

  const clientName = command.client || command.nomClient || command.customerName || "Cher client";
  const orderItems = getOrderItemsSummary(command);
  const address = command.address || command.destination || "Non spécifiée";
  const paymentMethod = command.paymentMethod || command.modePayement || "Non spécifié";
  const estimatedDelivery = command.dateLivraison
    ? (typeof command.dateLivraison === "object" && "toDate" in command.dateLivraison
      ? command.dateLivraison.toDate().toLocaleDateString("fr-FR")
      : new Date(command.dateLivraison).toLocaleDateString("fr-FR"))
    : "À confirmer";

  const message =
    `Bonjour ${clientName},\n\n` +
    `Votre commande N° ${command.id || "N/A"} a bien été reçue.\n` +
    `Produit : ${orderItems}\n` +
    `Total : ${(command.prix || command.total || 0).toLocaleString("fr-FR")} FCFA\n` +
    `Adresse : ${address}\n` +
    `Mode de paiement : ${paymentMethod}\n` +
    `Livraison estimée : ${estimatedDelivery}\n\n` +
    `Merci de votre confiance,\nÉquipe Livraison Pro`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${clientPhone}?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  console.log(`📲 WhatsApp client ouvert pour: ${clientPhone}`);
}

export function sendWhatsAppToAdmin(command: Command): void {
  if (typeof window === "undefined") return;

  const adminPhone = normalizePhoneForWhatsApp(ADMIN_PHONE);
  if (!adminPhone) {
    console.error("❌ Numéro WhatsApp admin invalide");
    return;
  }

  const clientName = command.client || command.nomClient || command.customerName || "Inconnu";
  const orderItems = getOrderItemsSummary(command);
  const clientPhone = command.telephone || command.phone || "Non fourni";
  const address = command.address || command.destination || "Non spécifiée";
  const paymentMethod = command.paymentMethod || command.modePayement || "Non spécifié";
  const departure = command.depart || "Non spécifié";
  const destination = command.destination || address;
  const orderDate = new Date().toLocaleDateString("fr-FR");
  const orderTime = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const message =
    `📦 NOUVELLE COMMANDE\n\n` +
    `ID : ${command.id || "N/A"}\n` +
    `Nom du client : ${clientName}\n` +
    `Téléphone : ${clientPhone}\n` +
    `Produit : ${orderItems}\n` +
    `Prix : ${(command.prix || command.total || 0).toLocaleString("fr-FR")} FCFA\n` +
    `Adresse de livraison : ${address}\n` +
    `Départ : ${departure}\n` +
    `Destination : ${destination}\n` +
    `Paiement : ${paymentMethod}\n` +
    `Date : ${orderDate}\n` +
    `Heure : ${orderTime}`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  console.log(`📲 Message WhatsApp ouvert pour l'admin: ${adminPhone}`);
}

export function sendWhatsAppNotifications(command: Command): void {
  sendWhatsAppToAdmin(command);
  sendWhatsAppToClient(command);
}
