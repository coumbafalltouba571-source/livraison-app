import { db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export interface ChatMessage {
  id?: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text?: string;
  type: "text" | "emoji" | "image" | "location";
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date | { toDate(): Date };
  read?: boolean;
}

export function getConversationId(orderId: string, userId: string) {
  return `order-${orderId}-${userId}`;
}

export async function sendChatMessage(message: Omit<ChatMessage, "id" | "createdAt">) {
  const payload = {
    ...message,
    createdAt: serverTimestamp(),
    read: false,
  };

  const ref = await addDoc(collection(db, "chatMessages"), payload);
  return ref.id;
}

export function subscribeToConversation(conversationId: string, callback: (messages: ChatMessage[]) => void) {
  const q = query(
    collection(db, "chatMessages"),
    where("conversationId", "==", conversationId),
    orderBy("createdAt", "asc"),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate?.() ?? new Date(),
    })) as ChatMessage[];

    callback(items);
  });
}

export async function markConversationMessagesAsRead(conversationId: string, userId: string) {
  const q = query(collection(db, "chatMessages"), where("conversationId", "==", conversationId), where("senderId", "!=" , userId));
  const snapshot = await getDocs(q);

  await Promise.all(snapshot.docs.map((docSnap) => updateDoc(doc(db, "chatMessages", docSnap.id), { read: true })));
}
