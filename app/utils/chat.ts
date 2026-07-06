import { db, storage } from "@/firebase";
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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

export function getConversationId(orderId: string) {
  return `order-${orderId}`;
}

export async function sendChatMessage(message: Omit<ChatMessage, "id" | "createdAt">) {
  const payload = {
    ...message,
    createdAt: serverTimestamp(),
    read: false,
  };

  const refDoc = await addDoc(collection(db, "chatMessages"), payload);
  return refDoc.id;
}

export async function uploadChatImage(orderId: string, file: File) {
  if (!storage) {
    throw new Error("Firebase Storage is not initialized.");
  }

  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const storageRef = ref(storage, `chat-images/${orderId}/${fileName}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
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
