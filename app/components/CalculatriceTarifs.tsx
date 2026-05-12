/**
 * Composant Calculatrice de tarifs
 * Permet de calculer rapidement le tarif entre deux quartiers
 */

"use client";

import { useState } from "react";
import { QUARTIERS_DAKAR, calculerTarif, formatPrix } from "../utils/tarifs";

export default function CalculatriceTarifs() {
  const [depart, setDepart] = useState("");
  const [destination, setDestination] = useState("");

  const tarif = depart && destination ? calculerTarif(depart, destination) : 0;

  const handleInverserQuartiers = () => {
    const temp = depart;
    setDepart(destination);
    setDestination(temp);
  };

  return (
    <div
      style={{
        background: "#1e293b",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid #334155",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          color: "#22d3ee",
          marginBottom: "20px",
          fontSize: "20px",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        🧮 Calculatrice de tarifs
      </h2>

      {/* Sélection départ */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            color: "#cbd5e1",
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          🏠 Point de départ
        </label>
        <select
          value={depart}
          onChange={(e) => setDepart(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "10px",
            border: "2px solid #334155",
            background: "#0f172a",
            color: "#ffffff",
            fontSize: "14px",
            boxSizing: "border-box",
            cursor: "pointer",
          }}
        >
          <option value="">Sélectionner...</option>
          {QUARTIERS_DAKAR.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
      </div>

      {/* Bouton inverser */}
      {depart && destination && (
        <button
          onClick={handleInverserQuartiers}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "16px",
            background: "#0f172a",
            border: "2px solid #334155",
            color: "#22d3ee",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.borderColor = "#22d3ee";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.borderColor = "#334155";
          }}
        >
          ⇅ Inverser les quartiers
        </button>
      )}

      {/* Sélection destination */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            color: "#cbd5e1",
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          📍 Destination
        </label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "10px",
            border: "2px solid #334155",
            background: "#0f172a",
            color: "#ffffff",
            fontSize: "14px",
            boxSizing: "border-box",
            cursor: "pointer",
          }}
        >
          <option value="">Sélectionner...</option>
          {QUARTIERS_DAKAR.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
      </div>

      {/* Affichage du résultat */}
      {depart && destination && (
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1a2332 100%)",
            padding: "16px",
            borderRadius: "12px",
            border: "2px solid #22d3ee",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#94a3b8",
              fontSize: "12px",
              margin: "0 0 8px 0",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {depart} → {destination}
          </p>
          <p
            style={{
              color: "#fbbf24",
              fontSize: "32px",
              fontWeight: "700",
              margin: "0",
            }}
          >
            {formatPrix(tarif)}
          </p>
        </div>
      )}

      {!depart && !destination && (
        <div
          style={{
            background: "#0f172a",
            padding: "24px",
            borderRadius: "12px",
            textAlign: "center",
            border: "2px dashed #334155",
          }}
        >
          <p
            style={{
              color: "#64748b",
              fontSize: "13px",
              margin: "0",
            }}
          >
            Sélectionnez départ et destination pour voir le tarif
          </p>
        </div>
      )}
    </div>
  );
}

