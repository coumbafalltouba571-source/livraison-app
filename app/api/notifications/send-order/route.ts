import { NextResponse } from "next/server";
import { sendSmsToClient } from "@/app/utils/smsService";
import { queueWhatsAppBusinessMessage } from "@/app/utils/whatsappBusiness";
import type { Command } from "@/app/utils/firestoreCommands";

const ADMIN_WHATSAPP_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER || "221773629075";

function parseDateValue(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return value;
  }
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate();
  }
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatMessageForAdmin(order: Command): string {
  const customerName = order.client || order.nomClient || order.customerName || "Inconnu";
  const productList = order.orderItems && order.orderItems.length > 0
    ? order.orderItems.map((item) => `${item.quantity}x ${item.productName}`).join(", ")
    : order.productName || "Non spécifié";
  const phone = order.telephone || order.phone || "Non fourni";
  const address = order.address || order.destination || "Non spécifiée";
  const paymentMethod = order.paymentMethod || order.modePayement || "Non spécifié";
  const departure = order.depart || "Non spécifié";
  const destination = order.destination || address;

  return (
    `📦 NOUVELLE COMMANDE\n\n` +
    `ID : ${order.id || "N/A"}\n` +
    `Client : ${customerName}\n` +
    `Téléphone : ${phone}\n` +
    `Produits : ${productList}\n` +
    `Montant : ${(order.prix || order.total || 0).toLocaleString("fr-FR")} FCFA\n` +
    `Adresse : ${address}\n` +
    `Départ : ${departure}\n` +
    `Destination : ${destination}\n` +
    `Paiement : ${paymentMethod}`
  );
}

function formatMessageForClient(order: Command): string {
  const clientName = order.client || order.nomClient || order.customerName || "Cher client";
  const productList = order.orderItems && order.orderItems.length > 0
    ? order.orderItems.map((item) => `${item.quantity}x ${item.productName}`).join(", ")
    : order.productName || "Non spécifié";
  const address = order.address || order.destination || "Non spécifiée";
  const paymentMethod = order.paymentMethod || order.modePayement || "Non spécifié";
  const deliveryDate = parseDateValue(order.dateLivraison)
    ? parseDateValue(order.dateLivraison)!.toLocaleDateString("fr-FR")
    : "À confirmer";

  return (
    `Bonjour ${clientName},\n\n` +
    `Votre commande N° ${order.id || "N/A"} a bien été reçue.\n` +
    `Produit : ${productList}\n` +
    `Montant : ${(order.prix || order.total || 0).toLocaleString("fr-FR")} FCFA\n` +
    `Adresse : ${address}\n` +
    `Paiement : ${paymentMethod}\n` +
    `Livraison estimée : ${deliveryDate}\n\n` +
    `Merci de votre confiance,\nÉquipe Livraison Pro`
  );
}

async function notifyAdminViaWhatsApp(order: Command): Promise<boolean> {
  try {
    await queueWhatsAppBusinessMessage({
      to: ADMIN_WHATSAPP_NUMBER,
      message: formatMessageForAdmin(order),
      orderId: order.id,
    });
    return true;
  } catch (error) {
    console.error("❌ Échec envoi WhatsApp admin:", error);
    return false;
  }
}

async function notifyClientViaWhatsApp(order: Command): Promise<boolean> {
  if (!order.telephone && !order.phone) {
    console.warn("ℹ️ Aucun numéro client trouvé pour envoyer WhatsApp.");
    return false;
  }

  try {
    await queueWhatsAppBusinessMessage({
      to: order.telephone || order.phone || "",
      message: formatMessageForClient(order),
      orderId: order.id,
    });
    return true;
  } catch (error) {
    console.error("❌ Échec envoi WhatsApp client:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderPayload = body as Command;

    if (!orderPayload || !orderPayload.id) {
      return NextResponse.json({ success: false, message: "Payload de commande invalide" }, { status: 400 });
    }

    const results = await Promise.allSettled([
      notifyAdminViaWhatsApp(orderPayload),
      notifyClientViaWhatsApp(orderPayload),
      sendSmsToClient(orderPayload),
    ]);

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("❌ Erreur API send-order:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur", error: (error as Error).message }, { status: 500 });
  }
}
