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

// Message WhatsApp au CLIENT
export function sendWhatsAppToClient(command: Command): void {
  if (typeof window === "undefined") return;

  try {
    const clientPhone = formatPhoneForWhatsApp(command.telephone);
    const clientName = command.client || command.nomClient || "Cher client";
    
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
      .map((item: any) => `${item.quantity}x ${item.productName} - ${(item.total || item.price || 0).toLocaleString('fr-FR')} FCFA`)
      .join("\n");

    const address = command.address || command.destination || "À livrer";
    const paymentMethod = command.paymentMethod || command.modePayement || "Non spécifié";
    const deliveryDate = command.dateLivraison 
      ? new Date(command.dateLivraison instanceof Date ? command.dateLivraison : (command.dateLivraison as any).toDate()).toLocaleDateString('fr-FR')
      : new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR');

    const message = 
      `Bonjour ${clientName} 👋\n\n` +
      `Votre commande a été enregistrée avec succès sur *Livraison Pro*.\n\n` +
      `📦 *Produits :*\n${productsText}\n\n` +
      `💰 *Montant Total :* ${command.prix.toLocaleString('fr-FR')} FCFA\n` +
      `📍 *Adresse de livraison :* ${address}\n` +
      `📅 *Date prévue :* ${deliveryDate}\n\n` +
      `💳 *Mode de paiement :*\n${paymentMethod}\n\n` +
      `Votre commande est en attente de traitement.\n\n` +
      `Merci pour votre confiance.\n\n` +
      `Équipe Livraison Pro 🚚`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${clientPhone}?text=${encodedMessage}`;

    // Ouvrir WhatsApp sans bloquer
    window.open(whatsappUrl, "_blank");
    console.log(`📲 Message WhatsApp envoyé au client: ${clientPhone}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du message WhatsApp client:", error);
  }
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

    const message = 
      `🚨 *NOUVELLE COMMANDE* 🚨\n\n` +
      `👤 *Client :* ${clientName}\n` +
      `📱 *Téléphone :* ${clientPhone}\n` +
      `📦 *Produits :* ${productsText}\n` +
      `💰 *Total :* ${command.prix.toLocaleString('fr-FR')} FCFA\n` +
      `📍 *Adresse :* ${address}\n` +
      `💳 *Paiement :* ${paymentMethod}\n` +
      `🆔 *ID Commande :* ${command.id || 'N/A'}\n\n` +
      `⏰ *${new Date().toLocaleString('fr-FR')}*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;

    // Ouvrir WhatsApp en arrière-plan
    window.open(whatsappUrl, "_blank");
    console.log(`📲 Message WhatsApp envoyé à l'admin: ${adminPhone}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du message WhatsApp admin:", error);
  }
}

// Fonction pour envoyer les deux messages
export function sendWhatsAppNotifications(command: Command): void {
  sendWhatsAppToClient(command);
  // Délai pour éviter les conflits
  setTimeout(() => {
    sendWhatsAppToAdmin(command);
  }, 500);
}
