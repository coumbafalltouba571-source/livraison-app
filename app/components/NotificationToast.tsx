"use client";

import { CheckCircle2, BellRing, X } from "lucide-react";

interface NotificationToastProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationToast({ visible, onClose }: NotificationToastProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 top-4 z-[100] mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-emerald-200 bg-white/95 p-4 shadow-2xl backdrop-blur md:inset-x-auto md:right-4 md:top-4">
      <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
        <CheckCircle2 size={22} />
      </div>
      <div className="flex-1">
        <p className="text-lg font-semibold text-gray-900">✅ Merci !</p>
        <p className="mt-1 text-sm text-gray-600">
          Votre commande a été reçue avec succès. Notre équipe va vous contacter très prochainement.
        </p>
      </div>
      <button
        onClick={onClose}
        className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        aria-label="Fermer"
      >
        <X size={18} />
      </button>
    </div>
  );
}
