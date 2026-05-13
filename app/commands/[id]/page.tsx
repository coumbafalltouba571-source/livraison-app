"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Command } from "@/app/utils/firestoreCommands";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import CommandCard from "@/app/components/CommandCard";

export default function CommandDetailPage() {
  const params = useParams();
  const commandId = params.id as string;
  const [command, setCommand] = useState<Command | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCommand() {
      try {
        const docRef = doc(db, "commandes", commandId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCommand({
            id: docSnap.id,
            ...data,
            dateLivraison:
              data.dateLivraison?.toDate ? data.dateLivraison.toDate() : data.dateLivraison,
            createdAt:
              data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
            updatedAt:
              data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
          } as Command);
        } else {
          setError("Commande non trouvée");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    }

    if (commandId) {
      loadCommand();
    }
  }, [commandId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </main>
    );
  }

  if (error || !command) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-gray-600 mb-6">{error || "Commande non trouvée"}</p>
          <Link href="/commands" className="text-blue-600 hover:text-blue-800 font-semibold">
            Retour à l'historique
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/commands"
          className="text-blue-600 hover:text-blue-800 font-semibold mb-6 inline-block"
        >
          ← Retour à l'historique
        </Link>

        <CommandCard command={command} onUpdate={() => {
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }} />
      </div>
    </main>
  );
}
