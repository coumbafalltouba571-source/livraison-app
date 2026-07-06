import { db } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import type { Command } from "./firestoreCommands";

export type OrderNotificationEvent =
  | "new_order"
  | "order_accepted"
  | "driver_found"
  | "driver_arrived"
  | "order_delivered"
  | "payment_received";

export interface AppNotification {
  id?: string;
  type: "order" | "system";
  event?: OrderNotificationEvent;
  title: string;
  message: string;
  customerName?: string;
  customerPhone?: string;
  product?: string;
  price?: number;
  status?: string;
  orderId?: string;
  targetUserId?: string;
  read?: boolean;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

const NOTIFICATIONS_COLLECTION = "notifications";

const eventTitles: Record<OrderNotificationEvent, string> = {
  new_order: "🔔 Nouvelle commande reçue",
  order_accepted: "✅ Commande acceptée",
  driver_found: "🚚 Livreur trouvé",
  driver_arrived: "📍 Livreur arrivé",
  order_delivered: "📦 Commande livrée",
  payment_received: "💳 Paiement reçu",
};

const eventMessages: Record<OrderNotificationEvent, (order: Partial<Command>) => string> = {
  new_order: (order) => `${order.client || order.nomClient || "Client"} a passé une nouvelle commande.`,
  order_accepted: (order) => `Votre commande ${order.id ? `#${order.id.slice(0, 8)}` : "a été"} acceptée.`,
  driver_found: (order) => `Un livreur est en route pour votre commande.`,
  driver_arrived: (order) => `Le livreur est arrivé à destination.`,
  order_delivered: (order) => `Votre commande a été livrée avec succès.`,
  payment_received: (order) => `Nous avons reçu le paiement de votre commande.`,
};

export async function createOrderNotification(
  order: Partial<Command> & { id?: string },
  event: OrderNotificationEvent = "new_order"
): Promise<string> {
  try {
    const orderId = order.id || "temp-order";
    const customerName = order.client || order.nomClient || order.customerName || "Client";
    const customerPhone = order.telephone || order.phone || "Non fourni";
    const product = order.productName || order.orderItems?.map((item) => `${item.quantity}x ${item.productName}`).join(", ") || "Produit";
    const price = order.prix || order.total || 0;
    const status = order.statut || "en attente";
    const createdAt = Timestamp.now();

    const notificationData: Omit<AppNotification, "id"> = {
      type: "order",
      event,
      title: eventTitles[event],
      message: eventMessages[event](order),
      customerName,
      customerPhone,
      product,
      price,
      status,
      orderId,
      targetUserId: order.userId,
      read: false,
      createdAt,
      updatedAt: createdAt,
    };

    const docRef = await addDoc(collection(db, NOTIFICATIONS_COLLECTION), notificationData);
    return docRef.id;
  } catch (error) {
    console.error("❌ Impossible de créer la notification Firestore:", error);
    throw error;
  }
}

async function sendPushNotificationToUser(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<boolean> {
  try {
    const response = await fetch("/api/notifications/send-fcm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        targetUserId: userId,
        notification: {
          title,
          body,
          clickAction: "/",
        },
        data,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ FCM send response failed:", text);
      return false;
    }

    const result = await response.json();
    return result?.success === true;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de la notification FCM:", error);
    return false;
  }
}

export async function notifyOrderEvent(
  order: Partial<Command> & { id?: string; userId?: string },
  event: OrderNotificationEvent,
  targetUserId?: string
): Promise<boolean> {
  try {
    await createOrderNotification(order, event);

    const userToNotify = targetUserId || order.userId;
    if (!userToNotify) {
      return true;
    }

    const title = eventTitles[event];
    const body = eventMessages[event](order);

    return await sendPushNotificationToUser(userToNotify, title, body, {
      orderId: order.id || "",
      event,
    });
  } catch (error) {
    console.error("❌ notifyOrderEvent failed:", error);
    return false;
  }
}

export async function getNotifications(): Promise<AppNotification[]> {
  try {
    const q = query(collection(db, NOTIFICATIONS_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
      } as AppNotification;
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des notifications:", error);
    throw error;
  }
}

export function listenToNotifications(callback: (notifications: AppNotification[]) => void) {
  const q = query(collection(db, NOTIFICATIONS_COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
      } as AppNotification;
    });
    callback(notifications);
  });
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, id);
  await updateDoc(notificationRef, {
    read: true,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteNotification(id: string): Promise<void> {
  await deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, id));
}

export async function deleteAllNotifications(): Promise<void> {
  const notifications = await getNotifications();
  await Promise.all(notifications.map((notification) => deleteNotification(notification.id!)));
}
