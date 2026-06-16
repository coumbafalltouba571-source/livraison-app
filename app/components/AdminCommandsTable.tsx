"use client";

import { Command, updateCommandStatus } from "@/app/utils/firestoreCommands";
import { useState } from "react";
import { fr } from "date-fns/locale";
import { format } from "date-fns";

interface AdminCommandsTableProps {
  commands: Command[];
  onUpdate: () => void;
  loading: boolean;
}

const STATUS_COLORS: { [key: string]: string } = {
  "en attente": "#fbbf24",
  "confirmée": "#3b82f6",
  "en cours de traitement": "#8b5cf6",
  "en livraison": "#ec4899",
  "livrée": "#10b981",
  "annulée": "#ef4444",
};

const STATUS_EMOJIS: { [key: string]: string } = {
  "en attente": "⏳",
  "confirmée": "✅",
  "en cours de traitement": "🔄",
  "en livraison": "🚚",
  "livrée": "📦",
  "annulée": "❌",
};

export default function AdminCommandsTable({
  commands,
  onUpdate,
  loading,
}: AdminCommandsTableProps) {
  const [expandedCommandId, setExpandedCommandId] = useState<string | null>(null);
  const [updatingCommandId, setUpdatingCommandId] = useState<string | null>(null);

  const handleStatusChange = async (commandId: string, newStatus: string) => {
    if (!commandId) return;

    setUpdatingCommandId(commandId);
    try {
      await updateCommandStatus(commandId, newStatus);
      onUpdate();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour du statut");
    } finally {
      setUpdatingCommandId(null);
    }
  };

  const getStatusOptions = (currentStatus: string) => {
    const allStatuses = [
      "en attente",
      "confirmée",
      "en cours de traitement",
      "en livraison",
      "livrée",
      "annulée",
    ];
    return allStatuses.filter((s) => s !== currentStatus);
  };

  if (loading) {
    return (
      <div style={{
        textAlign: "center",
        padding: "60px 20px",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px", animation: "spin 1s linear infinite" }}>⏳</div>
        <p style={{ color: "#6b7280", fontSize: "16px" }}>
          Chargement des commandes...
        </p>
      </div>
    );
  }

  if (commands.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "60px 20px",
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
        <p style={{ color: "#6b7280", fontSize: "16px" }}>
          Aucune commande trouvée
        </p>
      </div>
    );
  }

  return (
    <div style={{
      overflowX: "auto",
      background: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "1200px",
      }}>
        <thead>
          <tr style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
            color: "#ffffff",
            fontWeight: "600",
          }}>
            <th style={{
              padding: "16px 12px",
              textAlign: "left",
              fontSize: "13px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "2px solid rgba(255,255,255,0.1)",
            }}>
              #ID
            </th>
            <th style={{
              padding: "16px 12px",
              textAlign: "left",
              fontSize: "13px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "2px solid rgba(255,255,255,0.1)",
            }}>
              Nom Client
            </th>
            <th style={{
              padding: "16px 12px",
              textAlign: "left",
              fontSize: "13px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "2px solid rgba(255,255,255,0.1)",
            }}>
              Téléphone
            </th>
            <th style={{
              padding: "16px 12px",
              textAlign: "left",
              fontSize: "13px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "2px solid rgba(255,255,255,0.1)",
            }}>
              Départ
            </th>
            <th style={{
              padding: "16px 12px",
              textAlign: "left",
              fontSize: "13px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "2px solid rgba(255,255,255,0.1)",
            }}>
              Destination
            </th>
            <th style={{
              padding: "16px 12px",
              textAlign: "right",
              fontSize: "13px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "2px solid rgba(255,255,255,0.1)",
            }}>
              💰 Prix
            </th>
            <th style={{
              padding: "16px 12px",
              textAlign: "center",
              fontSize: "13px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "2px solid rgba(255,255,255,0.1)",
            }}>
              Statut
            </th>
            <th style={{
              padding: "16px 12px",
              textAlign: "left",
              fontSize: "13px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "2px solid rgba(255,255,255,0.1)",
            }}>
              Date
            </th>
            <th style={{
              padding: "16px 12px",
              textAlign: "center",
              fontSize: "13px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "2px solid rgba(255,255,255,0.1)",
            }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {commands.map((command, index) => (
            <tr
              key={command.id}
              style={{
                borderBottom: "1px solid #e5e7eb",
                transition: "all 0.2s",
                background: expandedCommandId === command.id ? "#f9fafb" : index % 2 === 0 ? "#ffffff" : "#f9fafb",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = expandedCommandId === command.id ? "#f9fafb" : index % 2 === 0 ? "#ffffff" : "#f9fafb";
              }}
            >
              <td style={{
                padding: "12px 12px",
                fontSize: "12px",
                color: "#6b7280",
                fontWeight: "600",
                fontFamily: "monospace",
              }}>
                {command.id?.slice(-6).toUpperCase()}
              </td>
              <td style={{
                padding: "12px 12px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1f2937",
              }}>
                {command.client || command.nomClient || "N/A"}
              </td>
              <td style={{
                padding: "12px 12px",
                fontSize: "14px",
                color: "#6b7280",
                fontFamily: "monospace",
              }}>
                {command.telephone}
              </td>
              <td style={{
                padding: "12px 12px",
                fontSize: "14px",
                color: "#1f2937",
              }}>
                {command.depart}
              </td>
              <td style={{
                padding: "12px 12px",
                fontSize: "14px",
                color: "#1f2937",
              }}>
                {command.destination}
              </td>
              <td style={{
                padding: "12px 12px",
                fontSize: "14px",
                fontWeight: "700",
                color: "#7c3aed",
                textAlign: "right",
              }}>
                {command.prix.toLocaleString("fr-FR")} FCFA
              </td>
              <td style={{
                padding: "12px 12px",
                textAlign: "center",
              }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "6px 12px",
                    background: STATUS_COLORS[command.statut] || "#6b7280",
                    color: "#ffffff",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                  }}
                >
                  {STATUS_EMOJIS[command.statut]} {command.statut}
                </div>
              </td>
              <td style={{
                padding: "12px 12px",
                fontSize: "12px",
                color: "#6b7280",
              }}>
                {format(
                  command.createdAt instanceof Date
                    ? command.createdAt
                    : new Date(command.createdAt as unknown as string),
                  "dd/MM/yyyy HH:mm",
                  { locale: fr }
                )}
              </td>
              <td style={{
                padding: "12px 12px",
                textAlign: "center",
              }}>
                <button
                  onClick={() =>
                    setExpandedCommandId(
                      expandedCommandId === command.id ? null : command.id || null
                    )
                  }
                  style={{
                    padding: "6px 12px",
                    background: "#e5e7eb",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "600",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#d1d5db";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#e5e7eb";
                  }}
                >
                  {expandedCommandId === command.id ? "▼" : "▶"} Détails
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ligne d'expansion pour les détails */}
      {expandedCommandId && (
        <div style={{
          padding: "24px",
          background: "#f9fafb",
          borderTop: "2px solid #e5e7eb",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}>
          {commands.find((c) => c.id === expandedCommandId) && (
            <>
              <div>
                <h4 style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "8px",
                }}>
                  📦 Description complète
                </h4>
                <p style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  background: "#ffffff",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}>
                  {commands.find((c) => c.id === expandedCommandId)?.description || "Aucune description"}
                </p>
              </div>
              <div>
                <h4 style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "8px",
                }}>
                  🔄 Changer le statut
                </h4>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}>
                  {getStatusOptions(
                    commands.find((c) => c.id === expandedCommandId)?.statut || ""
                  ).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(expandedCommandId, status)}
                      disabled={updatingCommandId === expandedCommandId}
                      style={{
                        padding: "10px 12px",
                        background: STATUS_COLORS[status] || "#6b7280",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: updatingCommandId === expandedCommandId ? "not-allowed" : "pointer",
                        opacity: updatingCommandId === expandedCommandId ? 0.7 : 1,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (updatingCommandId !== expandedCommandId) {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (updatingCommandId !== expandedCommandId) {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }
                      }}
                    >
                      {STATUS_EMOJIS[status]} {updatingCommandId === expandedCommandId ? "..." : status}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
