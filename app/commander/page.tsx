"use client";

import { useState } from "react";
import {
  QUARTIERS_DAKAR,
  calculerTarif,
  formatPrix,
  getDescriptionRoute,
} from "../utils/tarifs";

export default function CommanderPage() {
  const [telephone, setTelephone] = useState("");
  const [depart, setDepart] = useState("");
  const [destination, setDestination] = useState("");

  // Calcul automatique du prix selon les quartiers
  const prix = depart && destination ? calculerTarif(depart, destination) : 0;
  const descriptionRoute = getDescriptionRoute(depart, destination);

  // Quartiers disponibles
  const quartiers = QUARTIERS_DAKAR;

  // Fonction existante conservée - envoi via WhatsApp
  const envoyerCommande = () => {
    const message =
      `Nouvelle commande 🚚%0A%0A` +
      `Téléphone: ${telephone}%0A` +
      `Départ: ${depart}%0A` +
      `Destination: ${destination}%0A` +
      `Prix: ${prix} FCFA`;

    window.open(
      `https://wa.me/221773629075?text=${message}`,
      "_blank"
    );
  };

  return (
    <main
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "40px",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          border: "1px solid #334155",
        }}
      >
        {/* En-tête avec logo */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1
            style={{
              color: "#ffffff",
              textAlign: "center",
              marginBottom: "8px",
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            🚚 Livraison Dakar
          </h1>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "14px",
              margin: "0",
            }}
          >
            Tarifs intelligents et automatiques
          </p>
        </div>

        {/* Section téléphone */}
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
            📱 Votre téléphone
          </label>
          <input
            placeholder="+221 77 XXX XX XX"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              marginBottom: "0",
              borderRadius: "12px",
              border: "2px solid #334155",
              background: "#0f172a",
              color: "#ffffff",
              fontSize: "14px",
              boxSizing: "border-box",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = "#22d3ee";
              (e.target as HTMLInputElement).style.boxShadow = "0 0 12px rgba(34, 211, 238, 0.2)";
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = "#334155";
              (e.target as HTMLInputElement).style.boxShadow = "none";
            }}
          />
        </div>

        {/* Section départ et destination */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div>
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
              🏠 Départ
            </label>
            <select
              value={depart}
              onChange={(e) => setDepart(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "2px solid #334155",
                background: "#0f172a",
                color: "#ffffff",
                fontSize: "14px",
                boxSizing: "border-box",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <option value="">Sélectionner...</option>
              {quartiers.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          <div>
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
                padding: "12px 14px",
                borderRadius: "12px",
                border: "2px solid #334155",
                background: "#0f172a",
                color: "#ffffff",
                fontSize: "14px",
                boxSizing: "border-box",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <option value="">Sélectionner...</option>
              {quartiers.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Affichage de la route et du prix calculé */}
        {depart && destination && (
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1a2332 100%)",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "20px",
              border: "2px solid #22d3ee",
              transition: "all 0.3s ease",
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
              Itinéraire
            </p>
            <p
              style={{
                color: "#22d3ee",
                fontSize: "14px",
                fontWeight: "600",
                margin: "0 0 12px 0",
              }}
            >
              {descriptionRoute}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid #334155",
                paddingTop: "12px",
              }}
            >
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                Tarif calculé :
              </span>
              <span
                style={{
                  color: "#fbbf24",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                {formatPrix(prix)}
              </span>
            </div>
          </div>
        )}

        {/* Section paiement */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              color: "#cbd5e1",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            💳 Méthode de paiement
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <button
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                border: "2px solid #334155",
                background: "#0f172a",
                color: "#22d3ee",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = "#22d3ee";
                (e.target as HTMLButtonElement).style.boxShadow = "0 0 12px rgba(34, 211, 238, 0.2)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = "#334155";
                (e.target as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              🌊 Wave
            </button>

            <button
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                border: "2px solid #334155",
                background: "#0f172a",
                color: "#f59e0b",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = "#f59e0b";
                (e.target as HTMLButtonElement).style.boxShadow = "0 0 12px rgba(245, 158, 11, 0.2)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = "#334155";
                (e.target as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              🟠 Orange Money
            </button>
          </div>
        </div>

        {/* Bouton de confirmation */}
        <button
          onClick={envoyerCommande}
          disabled={!telephone || !depart || !destination}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: "12px",
            background:
              telephone && depart && destination
                ? "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)"
                : "#475569",
            color: "white",
            border: "none",
            fontWeight: "700",
            fontSize: "15px",
            cursor: telephone && depart && destination ? "pointer" : "not-allowed",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            boxShadow:
              telephone && depart && destination
                ? "0 8px 20px rgba(34, 211, 238, 0.3)"
                : "none",
          }}
          onMouseEnter={(e) => {
            if (telephone && depart && destination) {
              (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.target as HTMLButtonElement).style.boxShadow =
                "0 12px 24px rgba(34, 211, 238, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (telephone && depart && destination) {
              (e.target as HTMLButtonElement).style.transform = "translateY(0)";
              (e.target as HTMLButtonElement).style.boxShadow =
                "0 8px 20px rgba(34, 211, 238, 0.3)";
            }
          }}
        >
          {telephone && depart && destination
            ? "Confirmer la commande 🚀"
            : "Complétez tous les champs"}
        </button>

        {/* Tableau de tarifs de référence */}
        <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #334155" }}>
          <p
            style={{
              color: "#cbd5e1",
              fontSize: "12px",
              fontWeight: "600",
              marginBottom: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            📊 Tarifs de référence
          </p>
          <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.6" }}>
            <p style={{ margin: "4px 0" }}>
              <span style={{ color: "#cbd5e1" }}>Plateau → Médina</span> : 1 000 FCFA
            </p>
            <p style={{ margin: "4px 0" }}>
              <span style={{ color: "#cbd5e1" }}>Pikine → Keur Massar</span> : 2 250 FCFA
            </p>
            <p style={{ margin: "4px 0" }}>
              <span style={{ color: "#cbd5e1" }}>Keur Massar → Grand Yoff</span> : 4 200 FCFA
            </p>
            <p style={{ margin: "8px 0 0 0", color: "#64748b", fontSize: "11px" }}>
              Min. 1000 FCFA • Max. 6000 FCFA
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
