import type { Command } from "./firestoreCommands";

function formatPhoneForSms(phone?: string): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/\D/g, "");
  if (!cleaned) return null;
  if (cleaned.startsWith("0")) return `221${cleaned.slice(1)}`;
  if (cleaned.startsWith("221")) return cleaned;
  return `221${cleaned}`;
}

export async function sendSmsToClient(order: Partial<Command> & { id?: string }): Promise<boolean> {
  const phone = formatPhoneForSms(order.telephone || order.phone);
  const clientName = order.client || order.nomClient || "Cher client";
  const orderId = order.id || "N/A";

  if (!phone) {
    console.info("ℹ️ SMS non envoyé : numéro client introuvable");
    return false;
  }

  const productLine = order.orderItems?.map((item) => `${item.quantity}x ${item.productName}`).join(", ") || order.productName || "Non spécifié";
  const amountLine = `${(order.prix || order.total || 0).toLocaleString("fr-FR")} FCFA`;
  const addressLine = order.address || order.destination || "Non spécifiée";
  const paymentLine = order.paymentMethod || order.modePayement || "Non spécifié";

  const smsMessage = [
    `Bonjour ${clientName},`,
    "",
    `Votre commande N° ${orderId} a bien été enregistrée.`,
    "",
    `Produit : ${productLine}`,
    `Montant : ${amountLine}`,
    `Adresse de livraison : ${addressLine}`,
    `Mode de paiement : ${paymentLine}`,
    "",
    "Notre équipe prépare votre commande.",
    "",
    "Merci de votre confiance.",
    "",
    "Équipe Livraison Pro",
  ].join("\n");

  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
  const infobipApiKey = process.env.INFOBIP_API_KEY;
  const infobipBaseUrl = process.env.INFOBIP_BASE_URL;
  const orangeApiKey = process.env.ORANGE_SMS_API_KEY;
  const orangeBaseUrl = process.env.ORANGE_SMS_BASE_URL;
  const orangeFrom = process.env.ORANGE_SMS_FROM || "Livraison Pro";

  if (twilioSid && twilioToken && twilioFrom) {
    try {
      const auth = typeof btoa === "function"
        ? btoa(`${twilioSid}:${twilioToken}`)
        : Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: phone,
          From: twilioFrom,
          Body: smsMessage,
        }).toString(),
      });
      return true;
    } catch (error) {
      console.error("❌ SMS Twilio non envoyé:", error);
      return false;
    }
  }

  if (infobipApiKey && infobipBaseUrl) {
    try {
      await fetch(`${infobipBaseUrl}/sms/2/text/advanced`, {
        method: "POST",
        headers: {
          Authorization: `App ${infobipApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ from: "Livraison Pro", to: phone, text: smsMessage }],
        }),
      });
      return true;
    } catch (error) {
      console.error("❌ SMS Infobip non envoyé:", error);
      return false;
    }
  }

  if (orangeApiKey && orangeBaseUrl) {
    try {
      await fetch(orangeBaseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${orangeApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: orangeFrom,
          to: [phone],
          text: smsMessage,
        }),
      });
      return true;
    } catch (error) {
      console.error("❌ SMS Orange non envoyé:", error);
      return false;
    }
  }

  console.info("ℹ️ SMS service non configuré; préparation du message prête.", { phone, smsMessage });
  return false;
}
