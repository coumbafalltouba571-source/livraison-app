"use client";

import Link from "next/link";
import AdminNotificationsPanel from "@/app/components/AdminNotificationsPanel";

export default function AdminNotificationsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">📣 Notifications</h1>
            <p className="mt-1 text-slate-600">Historique des notifications reçues à chaque nouvelle commande.</p>
          </div>
          <Link href="/admin" className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700">
            ← Retour au dashboard
          </Link>
        </div>
        <AdminNotificationsPanel />
      </div>
    </main>
  );
}
