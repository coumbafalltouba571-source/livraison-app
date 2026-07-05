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

export interface AppNotification {
  id?: string;
  type: "order" | "system";
  title: string;
  message: string;
  customerName?: string;
  customerPhone?: string;
  product?: string;
  price?: number;
  status?: string;
  orderId?: string;
  read?: boolean;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

const NOTIFICATIONS_COLLECTION = "notifications";


export async function createOrderNotification(order: Partial<Command> & { id?: string }): Promise<string> {
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
      title: "🔔 Nouvelle commande reçue",
      message: `${customerName} a passé une nouvelle commande.`,
      customerName,
      customerPhone,
      product,
      price,
      status,
      orderId,
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
