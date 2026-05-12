"use client";

import TarifsTable from "../components/TarifsTable";
import CalculatriceTarifs from "../components/CalculatriceTarifs";

export default function TarifsDashboard() {
  return (
    <main
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* En-tête */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              color: "#22d3ee",
              fontSize: "32px",
              fontWeight: "700",
              margin: "0 0 8px 0",
            }}
          >
            📊 Tableau de tarification
          </h1>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "16px",
              margin: "0",
            }}
          >
            Tarifs automatiques pour livraison à Dakar
          </p>
        </div>

        {/* Grille 2 colonnes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {/* Calculatrice */}
          <div>
            <CalculatriceTarifs />
          </div>

          {/* Infos et limites */}
          <div
            style={{
              background: "#1e293b",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #334155",
            }}
          >
            <h2
              style={{
                color: "#fbbf24",
                marginBottom: "16px",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              ℹ️ Informations
            </h2>

            <div style={{ fontSize: "14px", lineHeight: "1.8", color: "#94a3b8" }}>
              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 4px 0", color: "#cbd5e1", fontWeight: "600" }}>
                  🎯 Tarifs
                </p>
                <p style={{ margin: "0" }}>
                  Min. <span style={{ color: "#22d3ee", fontWeight: "600" }}>1 000 FCFA</span> • Max.{" "}
                  <span style={{ color: "#22d3ee", fontWeight: "600" }}>6 000 FCFA</span>
                </p>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 4px 0", color: "#cbd5e1", fontWeight: "600" }}>
                  📍 Quartiers
                </p>
                <p style={{ margin: "0" }}>8 quartiers de Dakar supportés</p>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 4px 0", color: "#cbd5e1", fontWeight: "600" }}>
                  🧮 Calcul
                </p>
                <p style={{ margin: "0" }}>
                  Basé sur la distance entre les quartiers
                </p>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 4px 0", color: "#cbd5e1", fontWeight: "600" }}>
                  💬 Intégration
                </p>
                <p style={{ margin: "0" }}>
                  Envoi automatique via WhatsApp
                </p>
              </div>

              <div
                style={{
                  background: "#0f172a",
                  padding: "12px",
                  borderRadius: "8px",
                  marginTop: "16px",
                  borderLeft: "4px solid #22d3ee",
                }}
              >
                <p style={{ margin: "0", fontSize: "12px", fontStyle: "italic" }}>
                  Les tarifs sont calculés automatiquement en fonction de la distance
                  entre le point de départ et la destination.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau complet */}
        <TarifsTable />

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            paddingTop: "24px",
            borderTop: "1px solid #334155",
          }}
        >
          <p
            style={{
              color: "#64748b",
              fontSize: "13px",
              margin: "0",
            }}
          >
            © 2026 Système de livraison intelligent Dakar
          </p>
        </div>
      </div>
    </main>
  );
}
