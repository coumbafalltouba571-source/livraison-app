import { Command } from "./firestoreCommands";

// Numéro WhatsApp de l'admin
const ADMIN_PHONE = "221773629075";

// Fonction pour formater le numéro de téléphone
function formatPhoneForWhatsApp(phone: string): string {
  // Supprimer tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, "");
  // Si commence par 0, remplacer par 221 (Sénégal)
  if (cleaned.startsWith("0")) {
    return "221" + cleaned.slice(1);
  }
  // Si commence par 221, garder tel quel
  if (cleaned.startsWith("221")) {
    return cleaned;
  }
  // Sinon ajouter 221 au début
  return "221" + cleaned;
}

// Message WhatsApp au CLIENT - désactivé conformément à la demande
export function sendWhatsAppToClient(command: Command): void {
  console.info("ℹ️ Envoi WhatsApp au client désactivé. Seule l'alerte admin est conservée.", command.id);
}

// Message WhatsApp à l'ADMIN
export function sendWhatsAppToAdmin(command: Command): void {
  if (typeof window === "undefined") return;

  try {
    const adminPhone = formatPhoneForWhatsApp(ADMIN_PHONE);
    
    // Récupérer les détails du produit
    const orderItems = command.orderItems && command.orderItems.length > 0
      ? command.orderItems
      : command.productName
        ? [{
            productName: command.productName,
            quantity: command.quantity || 1,
            total: command.total || command.prix,
          }]
        : [];

    // Formater les produits
    const productsText = orderItems
      .map((item: any) => `${item.quantity}x ${item.productName}`)
      .join(", ");

    const clientName = command.client || command.nomClient || "Inconnu";
    const clientPhone = command.telephone || "Non fourni";
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
      `Produit : ${productsText || "Non spécifié"}\n` +
      `Quantité : ${command.quantity || 1}\n` +
      `Prix : ${command.prix.toLocaleString('fr-FR')} FCFA\n` +
      `Adresse de livraison : ${address}\n` +
      `Départ : ${departure}\n` +
      `Destination : ${destination}\n` +
      `Paiement : ${paymentMethod}\n` +
      `Date : ${orderDate}\n` +
      `Heure : ${orderTime}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;

    // Ouvrir WhatsApp en arrière-plan
    window.open(whatsappUrl, "_blank");
    console.log(`📲 Message WhatsApp envoyé à l'admin: ${adminPhone}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du message WhatsApp admin:", error);
  }
}

// Fonction pour envoyer uniquement le message WhatsApp à l'admin
export function sendWhatsAppNotifications(command: Command): void {
  sendWhatsAppToAdmin(command);
}
