"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Command, getCommandsByPhone, subscribeToCommand } from "@/app/utils/firestoreCommands";
import Link from "next/link";
import Image from "next/image";

const isValidProductImage = (image?: string): image is string =>
  !!image && (image.startsWith("/") || image.startsWith("http://") || image.startsWith("https://"));

export default function CommandHistoryContent() {
  const searchParams = useSearchParams();
  const telephone = searchParams.get("tel") || "";
  
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inputTelephone, setInputTelephone] = useState(telephone);
  const [hasSearched, setHasSearched] = useState(!!telephone);
  const [unsubscribers, setUnsubscribers] = useState<(() => void)[]>([]);

  // Charger les commandes du client
  const loadClientCommands = useCallback(async (tel: string) => {
    if (!tel.trim()) {
      setError("Veuillez entrer votre numéro de téléphone");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);
    
    try {
      const clientCommands = await getCommandsByPhone(tel);
      setCommands(clientCommands);

      // Abonner à chaque commande pour les mises à jour en temps réel
      const newUnsubscribers: (() => void)[] = [];
      clientCommands.forEach((cmd) => {
        if (cmd.id) {
          const unsubscribe = subscribeToCommand(cmd.id, (updatedCommand) => {
            if (updatedCommand) {
              setCommands((prev) =>
                prev.map((c) => (c.id === updatedCommand.id ? updatedCommand : c))
              );
            }
          });
          newUnsubscribers.push(unsubscribe);
        }
      });

      setUnsubscribers(newUnsubscribers);

      if (clientCommands.length === 0) {
        setError("Aucune commande trouvée pour ce numéro");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur lors de la récupération des commandes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (telephone) {
      (async () => {
        await loadClientCommands(telephone);
      })();
    }

    // Cleanup des abonnements
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [telephone, unsubscribers, loadClientCommands]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      "en attente": "#f59e0b",
      "confirmée": "#3b82f6",
      "en cours de traitement": "#8b5cf6",
      "en livraison": "#ec4899",
      "livrée": "#10b981",
      "annulée": "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  const getStatusEmoji = (status: string) => {
    const emojis: { [key: string]: string } = {
      "en attente": "⏳",
      "confirmée": "✅",
      "en cours de traitement": "🔄",
      "en livraison": "🚚",
      "livrée": "📦",
      "annulée": "❌",
    };
    return emojis[status] || "📋";
  };

  const getOrderItems = (command: Command) =>
    command.orderItems && command.orderItems.length > 0
      ? command.orderItems
      : command.productName
        ? [
            {
              productId: command.productId || "",
              productName: command.productName,
              productImage: isValidProductImage(command.productImage?.split(",")[0])
                ? command.productImage?.split(",")[0] || ""
                : "",
              quantity: command.quantity || 1,
              price: command.price || command.prix,
              total: command.total || command.prix,
            },
          ]
        : [];

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
      padding: "40px 20px",
    }}>
      {/* En-tête */}
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto",
        marginBottom: "40px",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}>
          <div>
            <h1 style={{
              fontSize: "32px",
              fontWeight: "900",
              color: "#1f2937",
              margin: "0 0 8px 0",
            }}>
              📦 Mon Historique
            </h1>
            <p style={{
              color: "#6b7280",
              fontSize: "16px",
              margin: 0,
            }}>
              Suivi de vos commandes
            </p>
          </div>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              color: "#ffffff",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "600",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(124, 58, 237, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            ➕ Nouvelle commande
          </Link>
        </div>

        {/* Formulaire de recherche */}
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          marginBottom: "24px",
        }}>
          <label style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: "12px",
          }}>
            📱 Numéro de téléphone
          </label>
          <div style={{
            display: "flex",
            gap: "12px",
            marginBottom: "12px",
          }}>
            <input
              type="tel"
              value={inputTelephone}
              onChange={(e) => setInputTelephone(e.target.value)}
              placeholder="+221 77 XXX XX XX"
              style={{
                flex: 1,
                padding: "14px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "10px",
                fontSize: "16px",
                transition: "all 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#7c3aed";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124, 58, 237, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow = "none";
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  loadClientCommands(inputTelephone);
                }
              }}
            />
            <button
              onClick={() => loadClientCommands(inputTelephone)}
              disabled={loading}
              style={{
                padding: "14px 28px",
                background: loading ? "#d1d5db" : "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(124, 58, 237, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {loading ? "⏳" : "🔍 Rechercher"}
            </button>
          </div>
          <p style={{
            fontSize: "12px",
            color: "#9ca3af",
            margin: 0,
          }}>
            Entrez le numéro de téléphone utilisé pour vos commandes
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Erreur */}
        {hasSearched && error && !loading && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "2px solid #ef4444",
            color: "#dc2626",
            padding: "16px 20px",
            borderRadius: "12px",
            marginBottom: "24px",
            fontWeight: "600",
            textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {/* Chargement */}
        {loading && (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
          }}>
            <div style={{
              fontSize: "48px",
              marginBottom: "16px",
              animation: "spin 1s linear infinite",
            }}>
              ⏳
            </div>
            <p style={{ color: "#6b7280", fontSize: "16px" }}>
              Chargement de vos commandes...
            </p>
          </div>
        )}

        {/* Liste des commandes */}
        {!loading && hasSearched && commands.length > 0 && (
          <div>
            <div style={{
              marginBottom: "24px",
              padding: "16px 20px",
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              borderRadius: "12px",
              color: "#ffffff",
              fontWeight: "600",
            }}>
              ✅ {commands.length} commande{commands.length > 1 ? "s" : ""} trouvée{commands.length > 1 ? "s" : ""}
            </div>
            
            <div style={{
              display: "grid",
              gap: "16px",
            }}>
              {commands.map((command) => (
                <div
                  key={command.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    borderLeft: `4px solid ${getStatusColor(command.statut)}`,
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.15)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "16px",
                  }}>
                    <div>
                      <div style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        marginBottom: "4px",
                      }}>
                        Commande #{command.id?.slice(-6).toUpperCase()}
                      </div>
                      <div style={{
                        fontSize: "14px",
                        color: "#6b7280",
                      }}>
                        {new Date(command.createdAt instanceof Date ? command.createdAt : command.createdAt.toDate?.() || new Date()).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div style={{
                      display: "inline-block",
                      padding: "8px 16px",
                      background: getStatusColor(command.statut),
                      color: "#ffffff",
                      borderRadius: "20px",
                      fontWeight: "600",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}>
                      {getStatusEmoji(command.statut)} {command.statut}
                    </div>
                  </div>

                  {getOrderItems(command).length > 0 && (
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "96px 1fr",
                      gap: "16px",
                      alignItems: "center",
                      marginBottom: "16px",
                      padding: "12px",
                      background: "#f9fafb",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                    }}>
                      {isValidProductImage(getOrderItems(command)[0].productImage) ? (
                        <Image
                          src={getOrderItems(command)[0].productImage}
                          alt={getOrderItems(command)[0].productName}
                          width={96}
                          height={96}
                          style={{
                            width: "96px",
                            height: "96px",
                            objectFit: "contain",
                            borderRadius: "10px",
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            padding: "6px",
                          }}
                        />
                      ) : (
                        <div style={{
                          width: "96px",
                          height: "96px",
                          borderRadius: "10px",
                          background: "#ffffff",
                          border: "1px solid #e5e7eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#9ca3af",
                          fontSize: "12px",
                        }}>
                          Image
                        </div>
                      )}
                      <div>
                        <p style={{
                          fontSize: "12px",
                          color: "#9ca3af",
                          margin: "0 0 8px 0",
                          fontWeight: "600",
                        }}>
                          📦 Produit commandé
                        </p>
                        {getOrderItems(command).map((item) => (
                          <div key={`${item.productId}-${item.productName}`} style={{ marginBottom: "8px" }}>
                            <p style={{
                              fontSize: "15px",
                              color: "#1f2937",
                              margin: "0 0 4px 0",
                              fontWeight: "700",
                            }}>
                              {item.productName}
                            </p>
                            <p style={{
                              fontSize: "13px",
                              color: "#6b7280",
                              margin: 0,
                            }}>
                              Prix: {item.price.toLocaleString("fr-FR")} FCFA · Quantité: {item.quantity} · Total: {item.total.toLocaleString("fr-FR")} FCFA
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginBottom: "16px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid #e5e7eb",
                  }}>
                    <div>
                      <p style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        margin: "0 0 4px 0",
                        fontWeight: "600",
                      }}>
                        🏠 Départ
                      </p>
                      <p style={{
                        fontSize: "14px",
                        color: "#1f2937",
                        margin: 0,
                        fontWeight: "600",
                      }}>
                        {command.depart}
                      </p>
                    </div>
                    <div>
                      <p style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        margin: "0 0 4px 0",
                        fontWeight: "600",
                      }}>
                        📍 Adresse de livraison
                      </p>
                      <p style={{
                        fontSize: "14px",
                        color: "#1f2937",
                        margin: 0,
                        fontWeight: "600",
                      }}>
                        {command.address || command.destination}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    marginBottom: "16px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid #e5e7eb",
                  }}>
                    <p style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      margin: "0 0 8px 0",
                      fontWeight: "600",
                    }}>
                      📦 Description
                    </p>
                    <p style={{
                      fontSize: "14px",
                      color: "#1f2937",
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}>
                      {command.description}
                    </p>
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}>
                    <div>
                      <p style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        margin: "0 0 4px 0",
                        fontWeight: "600",
                      }}>
                        💰 Prix
                      </p>
                      <p style={{
                        fontSize: "18px",
                        color: "#7c3aed",
                        margin: 0,
                        fontWeight: "900",
                      }}>
                        {command.prix.toLocaleString("fr-FR")} FCFA
                      </p>
                    </div>
                    <div>
                      <p style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        margin: "0 0 4px 0",
                        fontWeight: "600",
                      }}>
                        💳 Paiement
                      </p>
                      <p style={{
                        fontSize: "14px",
                        color: "#1f2937",
                        margin: 0,
                        fontWeight: "600",
                      }}>
                        {command.modePayement || "Non spécifié"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
    </main>
  );
}
