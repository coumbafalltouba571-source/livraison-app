"use client";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";

export default function Home() {

  const [telephone, setTelephone] = useState("");
  const [depart, setDepart] = useState("");
  const [destination, setDestination] = useState("");

  return (

    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-4xl font-bold text-purple-400 mb-8">
        Application Livraison 🚚
      </h1>

      <div className="bg-zinc-900 p-4 rounded-2xl mb-4">

        <p className="text-zinc-400 mb-2">
          Téléphone
        </p>

        <input
          type="text"
          placeholder="+221 77 362 90 75"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          className="w-full bg-black p-4 rounded-xl"
        />

      </div>

      <div className="bg-zinc-900 p-4 rounded-2xl mb-4">

        <p className="text-zinc-400 mb-2">
          Départ
        </p>

        <input
          type="text"
          placeholder="Dakar Plateau"
          value={depart}
          onChange={(e) => setDepart(e.target.value)}
          className="w-full bg-black p-4 rounded-xl"
        />

      </div>

      <div className="bg-zinc-900 p-4 rounded-2xl mb-4">

        <p className="text-zinc-400 mb-2">
          Destination
        </p>

        <input
          type="text"
          placeholder="Parcelles Assainies"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full bg-black p-4 rounded-xl"
        />

      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">

        <button className="bg-cyan-400 text-black p-4 rounded-2xl font-bold">
          Wave
        </button>

        <button className="bg-orange-500 text-white p-4 rounded-2xl font-bold">
          Orange Money
        </button>

      </div>

      <button
        onClick={async () => {
          await addDoc(collection(db, "commandes"), {
            telephone,
            depart,
            destination,
            prix: 4500,
            date: new Date()
          });

          const message = `Nouvelle commande 🚚%0A%0ATéléphone: ${telephone}%0ADépart: ${depart}%0ADestination: ${destination}%0APrix: 4500 FCFA`;

          window.open(
            `https://wa.me/221773629075?text=${message}`,
            "_blank"
          );
        }}
        className="w-full bg-purple-600 p-5 rounded-2xl text-2xl font-bold text-white"
      >
        Confirmer la commande 🚀
      </button>

 </main>

  );
}