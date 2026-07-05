"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/app/store/auth";
import { subscribeToCommands, getAvailableCommands } from "@/app/utils/firestoreCommands";
import dynamic from "next/dynamic";

const DriverMap = dynamic(() => import("@/app/components/EnhancedDriverMap"), { ssr: false });

export default function DriverDashboard() {
  const { userProfile } = useAuthStore();
  const [commands, setCommands] = useState<any[]>([]);
  const [available, setAvailable] = useState<any[]>([]);

  useEffect(() => {
    const unsub = subscribeToCommands((cmds) => setCommands(cmds));
    getAvailableCommands(20).then(setAvailable).catch(console.error);
    return () => unsub && unsub();
  }, []);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const gainsToday = useMemo(() => {
    return commands
      .filter((c) => c.statut === "livrée")
      .filter((c) => new Date(c.createdAt) >= today)
      .reduce((s, c) => s + (c.prix || 0), 0);
  }, [commands, today]);

  const gainsMonth = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return commands
      .filter((c) => c.statut === "livrée")
      .filter((c) => new Date(c.createdAt) >= start)
      .reduce((s, c) => s + (c.prix || 0), 0);
  }, [commands]);

  const totalGains = useMemo(() => commands.filter((c) => c.statut === "livrée").reduce((s, c) => s + (c.prix || 0), 0), [commands]);

  const accepted = commands.filter((c) => c.statut === "en livraison" || c.statut === "en cours de traitement");
  const completed = commands.filter((c) => c.statut === "livrée");

  return (
    <div className="p-6">
      <div className="flex gap-6">
        <div className="w-72 bg-white p-4 rounded-lg shadow">
          <div className="h-24 w-24 bg-gray-100 rounded-full overflow-hidden mb-3">
            {userProfile?.photoURL ? <img src={userProfile.photoURL} alt="photo" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">📷</div>}
          </div>
          <div className="font-semibold">{userProfile?.displayName || "Livreur"}</div>
          <div className="text-sm text-gray-600">{userProfile?.phone || "-"}</div>
          <div className="mt-4 space-y-2">
            <div>Position GPS: <span className="font-medium">N/A</span></div>
            <div>Navigation: <button className="text-sm text-blue-600">Ouvrir</button></div>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">Gains du jour<br/><div className="font-bold">{gainsToday.toLocaleString()} FCFA</div></div>
            <div className="bg-white p-4 rounded shadow">Gains du mois<br/><div className="font-bold">{gainsMonth.toLocaleString()} FCFA</div></div>
            <div className="bg-white p-4 rounded shadow">Total gains<br/><div className="font-bold">{totalGains.toLocaleString()} FCFA</div></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow lg:col-span-2">
              <h4 className="font-semibold mb-2">Carte des livraisons</h4>
              <div className="h-64 rounded overflow-hidden"><DriverMap commands={commands} /></div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h4 className="font-semibold mb-2">Commandes disponibles</h4>
              <ul className="space-y-2 max-h-56 overflow-auto">
                {available.map((c) => (
                  <li key={c.id} className="border-b py-2">
                    <div className="font-medium">{c.nomClient || c.client || 'Client'}</div>
                    <div className="text-xs text-gray-500">{c.destination}</div>
                    <div className="text-sm">{c.prix?.toLocaleString()} FCFA</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h4 className="font-semibold mb-2">Commandes acceptées</h4>
              <ul className="space-y-2 max-h-48 overflow-auto">
                {accepted.map((c) => (
                  <li key={c.id} className="border-b py-2">
                    <div className="font-medium">{c.nomClient || c.client || 'Client'}</div>
                    <div className="text-xs text-gray-500">{c.destination}</div>
                    <div className="text-sm">{c.prix?.toLocaleString()} FCFA</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h4 className="font-semibold mb-2">Historique (terminées)</h4>
              <ul className="space-y-2 max-h-48 overflow-auto">
                {completed.map((c) => (
                  <li key={c.id} className="border-b py-2">
                    <div className="font-medium">{c.nomClient || c.client || 'Client'}</div>
                    <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
                    <div className="text-sm">{c.prix?.toLocaleString()} FCFA</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
