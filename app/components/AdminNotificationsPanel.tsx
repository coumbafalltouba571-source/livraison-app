"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, CheckCheck, Trash2, RefreshCw, Sparkles } from "lucide-react";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  listenToNotifications,
  markNotificationAsRead,
  type AppNotification,
} from "@/app/utils/notifications";

export default function AdminNotificationsPanel() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    setRefreshing(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    const unsubscribe = listenToNotifications((items) => {
      setNotifications(items);
      setLoading(false);
      setRefreshing(false);
    });
    return () => unsubscribe();
  }, []);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  const handleRead = async (id?: string) => {
    if (!id) return;
    await markNotificationAsRead(id);
    await loadNotifications();
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await deleteNotification(id);
    await loadNotifications();
  };

  const handleClearAll = async () => {
    await deleteAllNotifications();
    await loadNotifications();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xl font-semibold text-slate-900">
            <BellRing className="text-amber-500" size={22} />
            Notifications
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Consulter l’historique des nouvelles commandes et notifications système.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadNotifications}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Actualiser
          </button>
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
          >
            <Trash2 size={16} />
            Tout supprimer
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <Sparkles size={16} className="text-blue-600" />
        {unreadCount > 0 ? `${unreadCount} notification(s) non lue(s)` : "Aucune notification non lue"}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-slate-500">Chargement...</div>
      ) : notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
          Aucune notification pour le moment.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 transition ${item.read ? "border-slate-200 bg-slate-50" : "border-blue-200 bg-blue-50/70"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    {!item.read && <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Nouvelle</span>}
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{item.message}</p>
                  {item.customerName && (
                    <div className="mt-2 text-sm text-slate-600">
                      <span className="font-medium">Client:</span> {item.customerName} • {item.customerPhone}
                    </div>
                  )}
                  {item.product && (
                    <div className="mt-1 text-sm text-slate-600">
                      <span className="font-medium">Produit:</span> {item.product}
                    </div>
                  )}
                  {typeof item.price === "number" && (
                    <div className="mt-1 text-sm text-slate-600">
                      <span className="font-medium">Prix:</span> {item.price.toLocaleString("fr-FR")} FCFA
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!item.read && (
                    <button
                      onClick={() => handleRead(item.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                    >
                      <CheckCheck size={14} />
                      Marquer lu
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
