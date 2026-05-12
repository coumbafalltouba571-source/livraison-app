/**
 * Composant d'affichage du tableau de tarifs complets
 * Affiche les tarifs entre tous les quartiers de Dakar
 */

import { QUARTIERS_DAKAR, calculerTarif, formatPrix } from "../utils/tarifs";

export default function TarifsTable() {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid #334155",
        marginTop: "24px",
      }}
    >
      <h2
        style={{
          color: "#22d3ee",
          marginBottom: "16px",
          fontSize: "18px",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        📊 Tableau complet des tarifs
      </h2>

      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#0f172a",
                borderBottom: "2px solid #22d3ee",
              }}
            >
              <th
                style={{
                  color: "#cbd5e1",
                  padding: "12px",
                  textAlign: "left",
                  fontWeight: "600",
                }}
              >
                De
              </th>
              <th
                style={{
                  color: "#cbd5e1",
                  padding: "12px",
                  textAlign: "left",
                  fontWeight: "600",
                }}
              >
                Vers
              </th>
              <th
                style={{
                  color: "#fbbf24",
                  padding: "12px",
                  textAlign: "right",
                  fontWeight: "600",
                }}
              >
                Tarif
              </th>
            </tr>
          </thead>
          <tbody>
            {QUARTIERS_DAKAR.map((depart, idx) =>
              QUARTIERS_DAKAR.map((destination, jdx) => {
                if (idx >= jdx) return null; // Éviter les doublons
                const tarif = calculerTarif(depart, destination);

                return (
                  <tr
                    key={`${depart}-${destination}`}
                    style={{
                      borderBottom: "1px solid #334155",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#0f172a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td
                      style={{
                        color: "#94a3b8",
                        padding: "10px 12px",
                      }}
                    >
                      {depart}
                    </td>
                    <td
                      style={{
                        color: "#94a3b8",
                        padding: "10px 12px",
                      }}
                    >
                      {destination}
                    </td>
                    <td
                      style={{
                        color: "#22d3ee",
                        padding: "10px 12px",
                        textAlign: "right",
                        fontWeight: "600",
                      }}
                    >
                      {formatPrix(tarif)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "16px",
          padding: "12px",
          background: "#0f172a",
          borderRadius: "8px",
          border: "1px solid #334155",
          fontSize: "12px",
          color: "#94a3b8",
        }}
      >
        <p style={{ margin: "0 0 8px 0" }}>
          <span style={{ color: "#cbd5e1", fontWeight: "600" }}>💡 Tarification:</span>
        </p>
        <ul style={{ margin: "0", paddingLeft: "20px", lineHeight: "1.6" }}>
          <li>Minimum: 1 000 FCFA</li>
          <li>Maximum: 6 000 FCFA</li>
          <li>Calcul basé sur la distance entre les quartiers</li>
          <li>Tarifs arrondis à 50 FCFA près</li>
        </ul>
      </div>
    </div>
  );
}
