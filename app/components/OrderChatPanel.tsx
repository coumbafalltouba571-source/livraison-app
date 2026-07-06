"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/app/store/auth";
import { getConversationId, markConversationMessagesAsRead, sendChatMessage, subscribeToConversation, type ChatMessage } from "@/app/utils/chat";

interface OrderChatPanelProps {
  orderId: string;
  recipientName?: string;
}

export default function OrderChatPanel({ orderId, recipientName = "Livreur" }: OrderChatPanelProps) {
  const { userProfile } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const conversationId = useMemo(() => getConversationId(orderId), [orderId]);

  useEffect(() => {
    if (!orderId) return;

    const unsubscribe = subscribeToConversation(conversationId, setMessages);
    void markConversationMessagesAsRead(conversationId, userProfile?.uid || "");

    return () => unsubscribe();
  }, [conversationId, orderId, userProfile?.uid]);

  const handleSend = async () => {
    if (!draft.trim() || !userProfile?.uid) return;

    await sendChatMessage({
      conversationId,
      senderId: userProfile.uid,
      senderName: userProfile.displayName || userProfile.phone || "Moi",
      text: draft.trim(),
      type: "text",
    });

    setDraft("");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">💬 Chat commande</h3>
          <p className="text-sm text-slate-500">Conversation avec {recipientName}</p>
        </div>
      </div>

      <div className="mb-3 max-h-72 space-y-2 overflow-auto rounded-lg bg-slate-50 p-3">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-500">Aucun message pour l’instant.</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${message.senderId === userProfile?.uid ? "ml-auto bg-blue-600 text-white" : "bg-white text-slate-700"}`}>
              <div className="mb-1 text-[11px] opacity-70">{message.senderName}</div>
              <div>{message.text || (message.type === "location" ? "Position GPS partagée" : "Pièce jointe")}</div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleSend();
            }
          }}
          placeholder="Écrire un message…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <button
          onClick={() => void handleSend()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
