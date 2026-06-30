export interface WhatsAppBusinessPayload {
  to: string;
  message: string;
  orderId?: string;
}

export async function queueWhatsAppBusinessMessage(payload: WhatsAppBusinessPayload): Promise<boolean> {
  try {
    console.info("📲 Préparation WhatsApp Business API", payload);
    return true;
  } catch (error) {
    console.error("❌ Échec préparation WhatsApp Business", error);
    return false;
  }
}
