"use client";

import { useEffect, useState, useCallback, useRef, MouseEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Command, getCommandsByPhone, subscribeToCommand } from "@/app/utils/firestoreCommands";
import { getShortOrderNumber, normalizeOrderSearchValue, getWhatsAppShareUrl, getAdminWhatsAppUrl } from "@/app/utils/commandUtils";
import { formatPhoneNumber } from "@/app/utils/phoneFormatter";
import Link from "next/link";
import Image from "next/image";

// Types pour les états
type LoadingState = "idle" | "loading" | "success" | "error" | "no-commands";

const isValidProductImage = (image?: string): image is string =>
  !!image && (image.startsWith("/") || image.startsWith("http://") || image.startsWith("https://"));

export default function CommandHistoryContent() {
  const searchParams = useSearchParams();
  const telephone = searchParams.get("tel") || "";
  
  const [commands, setCommands] = useState<Command[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState("");
  const [inputTelephone, setInputTelephone] = useState(telephone);
  const unsubscribersRef = useRef<(() => void)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Filtrage: recherche par numéro, date et statut
  const [searchOrderNumber, setSearchOrderNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const router = useRouter();

  const handleReorder = (command: Command) => {
    console.log("🔁 Commander à nouveau clicked", {
      id: command.id,
      telephone: command.telephone,
      depart: command.depart,
      destination: command.address || command.destination,
      client: command.client || command.nomClient || command.customerName,
    });

    router.push(
      `/?depart=${encodeURIComponent(command.depart || "")}` +
      `&destination=${encodeURIComponent(command.address || command.destination || "")}` +
      `&telephone=${encodeURIComponent(command.telephone || command.phone || "")}` +
      `&client=${encodeURIComponent(command.client || command.nomClient || command.customerName || "")}`
    );
  };

  const handleTrack = async (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>, command: Command) => {
    event.preventDefault();
    console.log("📍 Suivre la commande clicked", { id: command.id, telephone: command.telephone, depart: command.depart, destination: command.address || command.destination });

    let commandId = command.id;
    if (!commandId) {
      console.warn("⚠️ Command ID absent, tentative de recherche Firestore via téléphone");
      const phone = formatPhoneNumber(command.telephone || command.phone || "");
      if (!phone) {
        alert("Impossible de localiser cette commande. Téléphone manquant.");
        return;
      }
      const matches = await getCommandsByPhone(phone);
      const matched = matches.find((cmd) =>
        cmd.depart === command.depart &&
        (cmd.destination === command.destination || cmd.address === command.address)
      );
      commandId = matched?.id || matches[0]?.id;
      console.log("🔎 Command ID recherché via Firestore:", { foundId: commandId, matchesCount: matches.length });
    }

    if (!commandId) {
      alert("Impossible de trouver l'ID de la commande pour le suivi.");
      return;
    }

    router.push(`/track/${commandId}`);
  };

  // Cleanup des abonnements
  const cleanupSubscriptions = useCallback(() => {
    console.log(`🧹 Nettoyage de ${unsubscribersRef.current.length} abonnements`);
    unsubscribersRef.current.forEach((unsub) => {
      try {
        unsub();
      } catch (err) {
        console.error("❌ Erreur lors du nettoyage d'un abonnement:", err);
      }
    });
    unsubscribersRef.current = [];
  }, []);

  // Charger les commandes du client avec timeout
  const loadClientCommands = useCallback(async (tel: string) => {
    if (!tel.trim()) {
      console.warn("⚠️ Numéro de téléphone vide");
      setError("Veuillez entrer votre numéro de téléphone");
      setLoadingState("error");
      return;
    }

    // Annuler toute requête précédente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      console.log("⏱️ Timeout précédent annulé");
    }

    // Nettoyer les anciens abonnements
    cleanupSubscriptions();

    setLoadingState("loading");
    setError("");
    setCommands([]);

    console.log(`🔍 Recherche des commandes pour: ${tel}`);

    try {
      // Promise du timeout (10 secondes)
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          console.error("⏱️ TIMEOUT! Requête Firestore dépassée après 10 secondes");
          reject(new Error("Timeout: La requête a dépassé 10 secondes"));
        }, 10000);
      });

      // Promise du chargement
      const normalizedPhone = formatPhoneNumber(tel);
      console.log(`📱 Recherche avec numéro normalisé: "${tel}" → "${normalizedPhone}"`);
      const loadPromise = getCommandsByPhone(normalizedPhone);

      // Race les deux promises
      const clientCommands = await Promise.race([loadPromise, timeoutPromise]);

      // Annuler le timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      console.log(`✅ ${clientCommands.length} commandes trouvées`);
      setCommands(clientCommands);

      // Vérifier s'il y a des commandes
      if (clientCommands.length === 0) {
        console.log("ℹ️ Aucune commande trouvée pour ce numéro");
        setLoadingState("no-commands");
        return;
      }

      // Abonner à chaque commande pour les mises à jour en temps réel
      const newUnsubscribers: (() => void)[] = [];
      clientCommands.forEach((cmd) => {
        if (cmd.id) {
          console.log(`📡 Abonnement à la commande: ${cmd.id}`);
          const unsubscribe = subscribeToCommand(cmd.id, (updatedCommand) => {
            if (updatedCommand) {
              console.log(`🔄 Commande mise à jour: ${updatedCommand.id}`);
              setCommands((prev) =>
                prev.map((c) => (c.id === updatedCommand.id ? updatedCommand : c))
              );
            }
          });
          newUnsubscribers.push(unsubscribe);
        }
      });

      unsubscribersRef.current = newUnsubscribers;
      setLoadingState("success");
    } catch (err) {
      // Annuler le timeout en cas d'erreur
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      console.error("❌ ERREUR COMPLÈTE lors du chargement des commandes:", err);
      
      let errorMessage = "Erreur lors de la récupération des commandes";

      if (err instanceof Error) {
        console.error(`   Message: ${err.message}`);
        console.error(`   Stack: ${err.stack}`);
        
        // Détecter l'erreur d'index Firestore
        if (err.message.includes("The query requires an index") || err.message.includes("requires an index")) {
          errorMessage = "⚙️ Les index Firestore sont en cours de création. Cette page sera opérationnelle dans 5 à 10 minutes. Veuillez réessayer plus tard.";
          console.warn("⚠️ Index Firestore manquant - L'administrateur Firestore doit créer l'index composite");
        } else if (err.message.includes("Timeout")) {
          errorMessage = "Délai d'attente dépassé. Vérifiez votre connexion Internet ou réessayez.";
        } else if (err.message.includes("permission-denied")) {
          errorMessage = "Erreur de permissions Firestore. Contactez le support.";
        } else if (err.message.includes("not-found")) {
          errorMessage = "Service indisponible. Réessayez plus tard.";
        } else if (err.message.includes("unauthenticated")) {
          errorMessage = "Erreur d'authentification Firestore.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      setLoadingState("error");
    }
  }, [cleanupSubscriptions]);

  useEffect(() => {
    if (!telephone) {
      return;
    }

    const load = async () => {
      await loadClientCommands(telephone);
    };

    void load();

    // Cleanup au démontage
    return () => {
      cleanupSubscriptions();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        console.log("🧹 Cleanup: timeout annulé au démontage");
      }
    };
  }, [telephone, loadClientCommands, cleanupSubscriptions]);

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

  const statusList = ["en attente", "confirmée", "en cours de traitement", "en livraison", "livrée", "annulée"];

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

  // Fonction pour filtrer les commandes
  const getFilteredCommands = () => {
    let filtered = [...commands];

    // Filtre par numéro de commande court ou ID Firestore
    if (searchOrderNumber.trim()) {
      const searchValue = normalizeOrderSearchValue(searchOrderNumber.trim());
      filtered = filtered.filter((cmd) => {
        const id = cmd.id?.toUpperCase() || "";
        const shortId = getShortOrderNumber(cmd.id).replace(/#/g, "").toUpperCase();
        const normalizedSearch = searchValue.replace(/^GDN/, "");

        return (
          id.includes(searchValue) ||
          id.includes(normalizedSearch) ||
          shortId.includes(normalizedSearch) ||
          shortId.includes(searchValue)
        );
      });
    }

    // Filtre par statut
    if (selectedStatus) {
      filtered = filtered.filter((cmd) => cmd.statut === selectedStatus);
    }

    // Filtre par date
    if (startDate || endDate) {
      filtered = filtered.filter((cmd) => {
        const cmdDate = cmd.createdAt instanceof Date
          ? cmd.createdAt
          : cmd.createdAt.toDate?.() || new Date();
        const cmdTime = new Date(cmdDate).getTime();

        if (startDate) {
          const start = new Date(startDate).getTime();
          if (cmdTime < start) return false;
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (cmdTime > end.getTime()) return false;
        }

        return true;
      });
    }

    return filtered;
  };

  const filteredCommands = getFilteredCommands();

  const isLoading = loadingState === "loading";
  const isSuccess = loadingState === "success";
  const isError = loadingState === "error";
  const isNoCommands = loadingState === "no-commands";

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
      padding: "20px",
    }}>
      {/* En-tête - Responsive */}
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto",
        marginBottom: "30px",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}>
          <div>
            <h1 style={{
              fontSize: "clamp(24px, 5vw, 32px)",
              fontWeight: "900",
              color: "#1f2937",
              margin: "0 0 8px 0",
            }}>
              📦 Mon Historique
            </h1>
            <p style={{
              color: "#6b7280",
              fontSize: "clamp(14px, 3vw, 16px)",
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
              fontSize: "clamp(12px, 2vw, 14px)",
              transition: "all 0.3s",
              whiteSpace: "nowrap",
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

        {/* Formulaire de recherche - Responsive */}
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "clamp(16px, 3vw, 24px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          marginBottom: "24px",
        }}>
          {/* Numéro de téléphone */}
          <label style={{
            display: "block",
            fontSize: "clamp(12px, 2vw, 14px)",
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: "12px",
          }}>
            📱 Numéro de téléphone
          </label>
          <div style={{
            display: "flex",
            gap: "12px",
            marginBottom: "24px",
            flexDirection: "row",
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
                minHeight: "48px",
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
              disabled={isLoading}
              style={{
                padding: "14px 28px",
                background: isLoading ? "#d1d5db" : "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontWeight: "600",
                fontSize: "clamp(12px, 2vw, 14px)",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                minHeight: "48px",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(124, 58, 237, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {isLoading ? "⏳" : "🔍 Rechercher"}
            </button>
          </div>
          <p style={{
            fontSize: "clamp(11px, 2vw, 12px)",
            color: "#9ca3af",
            margin: "0 0 20px 0",
          }}>
            Entrez le numéro de téléphone utilisé pour vos commandes
          </p>

          {/* Section Filtres - Visible seulement s'il y a des commandes */}
          {isSuccess && commands.length > 0 && (
            <>
              <div style={{
                borderTop: "2px solid #e5e7eb",
                paddingTop: "20px",
                marginBottom: "20px",
              }}>
                <h3 style={{
                  fontSize: "clamp(14px, 2vw, 16px)",
                  fontWeight: "700",
                  color: "#1f2937",
                  margin: "0 0 16px 0",
                }}>
                  🔎 Filtrer vos commandes
                </h3>

                {/* Grille des filtres */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "16px",
                }}>
                  {/* Recherche par numéro */}
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "clamp(12px, 1.5vw, 13px)",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                    }}>
                      🔢 Numéro de commande
                    </label>
                    <input
                      type="text"
                      value={searchOrderNumber}
                      onChange={(e) => setSearchOrderNumber(e.target.value)}
                      placeholder="Ex: ABC123"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "13px",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#7c3aed";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124, 58, 237, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#d1d5db";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Filtrer par statut */}
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "clamp(12px, 1.5vw, 13px)",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                    }}>
                      📊 Statut
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "13px",
                        boxSizing: "border-box",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">Tous les statuts</option>
                      {statusList.map((status) => (
                        <option key={status} value={status}>
                          {getStatusEmoji(status)} {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date de début */}
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "clamp(12px, 1.5vw, 13px)",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                    }}>
                      📅 À partir de
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "13px",
                        boxSizing: "border-box",
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  {/* Date de fin */}
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "clamp(12px, 1.5vw, 13px)",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                    }}>
                      📅 Jusqu&apos;au
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "13px",
                        boxSizing: "border-box",
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  {/* Bouton réinitialiser les filtres */}
                  {(searchOrderNumber || selectedStatus || startDate || endDate) && (
                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                      <button
                        onClick={() => {
                          setSearchOrderNumber("");
                          setSelectedStatus("");
                          setStartDate("");
                          setEndDate("");
                        }}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          background: "#f3f4f6",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#374151",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#e5e7eb";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#f3f4f6";
                        }}
                      >
                        🔄 Réinitialiser filtres
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* État: Erreur */}
        {isError && (
          <div style={{
            background: error.includes("⚙️") ? "rgba(59, 130, 246, 0.1)" : "rgba(239, 68, 68, 0.1)",
            border: `2px solid ${error.includes("⚙️") ? "#3b82f6" : "#ef4444"}`,
            color: error.includes("⚙️") ? "#1e40af" : "#dc2626",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "24px",
            fontWeight: "600",
            textAlign: "center",
            fontSize: "clamp(12px, 2vw, 14px)",
          }}>
            {error}
            {error.includes("⚙️") && (
              <div style={{
                marginTop: "16px",
                fontSize: "clamp(11px, 1.5vw, 12px)",
                fontWeight: "500",
                opacity: 0.8,
              }}>
                <p style={{ margin: "0 0 8px 0" }}>
                  💡 L&apos;administrateur Firestore peut accélérer ce processus:
                </p>
                <p style={{ margin: "0 0 8px 0" }}>
                  Ouvrir Firebase Console → Firestore Database → Indexes
                </p>
                <p style={{ margin: "0 0 8px 0" }}>
                  Créer l&apos;index composite sur:
                </p>
                <p style={{ margin: "0 0 8px 0", fontFamily: "monospace", background: "rgba(255,255,255,0.2)", padding: "8px", borderRadius: "6px" }}>
                  Collection: commandes<br/>
                  Champs: telephone (↑) + createdAt (↓)
                </p>
              </div>
            )}
          </div>
        )}

        {/* État: Chargement */}
        {isLoading && (
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
            <p style={{ color: "#6b7280", fontSize: "clamp(14px, 3vw, 16px)" }}>
              Chargement de vos commandes...
            </p>
            <p style={{ color: "#9ca3af", fontSize: "clamp(12px, 2vw, 13px)", marginTop: "8px" }}>
              (Timeout après 10 secondes)
            </p>
          </div>
        )}

        {/* État: Aucune commande */}
        {isNoCommands && (
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "40px 20px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            border: "2px dashed #bfdbfe",
          }}>
            <div style={{
              fontSize: "48px",
              marginBottom: "16px",
            }}>
              📦
            </div>
            <h2 style={{
              fontSize: "clamp(18px, 4vw, 22px)",
              color: "#1f2937",
              margin: "0 0 8px 0",
              fontWeight: "700",
            }}>
              Aucune commande trouvée
            </h2>
            <p style={{
              color: "#6b7280",
              fontSize: "clamp(14px, 2vw, 16px)",
              margin: "0 0 24px 0",
            }}>
              Nous n&apos;avons trouvé aucune commande pour le numéro{" "}
              <strong>{inputTelephone}</strong>
            </p>
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                color: "#ffffff",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "clamp(12px, 2vw, 14px)",
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
              ➕ Passer une commande
            </Link>
          </div>
        )}

        {/* État: Succès - Liste des commandes */}
        {isSuccess && commands.length > 0 && (
          <div>
            <div style={{
              marginBottom: "24px",
              padding: "16px 20px",
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              borderRadius: "12px",
              color: "#ffffff",
              fontWeight: "600",
              fontSize: "clamp(13px, 2vw, 14px)",
              textAlign: "center",
            }}>
              ✅ {filteredCommands.length} commande{filteredCommands.length > 1 ? "s" : ""} trouvée{filteredCommands.length > 1 ? "s" : ""} {commands.length > filteredCommands.length ? `(sur ${commands.length})` : ""}
            </div>
            
            {filteredCommands.length === 0 && (
              <div style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "40px 20px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                border: "2px dashed #bfdbfe",
              }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
                <h2 style={{
                  fontSize: "clamp(18px, 4vw, 22px)",
                  color: "#1f2937",
                  margin: "0 0 8px 0",
                  fontWeight: "700",
                }}>
                  Aucune commande ne correspond à vos filtres
                </h2>
                <p style={{
                  color: "#6b7280",
                  fontSize: "clamp(14px, 2vw, 16px)",
                  margin: 0,
                }}>
                  Modifiez vos critères de recherche et essayez à nouveau
                </p>
              </div>
            )}
            
            <div style={{
              display: "grid",
              gap: "16px",
            }}>
              {filteredCommands.map((command) => (
                <div
                  key={command.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "clamp(16px, 3vw, 24px)",
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
                    alignItems: "flex-start",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}>
                    <div>
                      <div style={{
                        fontSize: "clamp(11px, 2vw, 12px)",
                        color: "#9ca3af",
                        marginBottom: "4px",
                      }}>
                        Numéro de commande : {getShortOrderNumber(command.id)}
                      </div>
                      <div style={{
                        fontSize: "clamp(11px, 2vw, 12px)",
                        color: "#9ca3af",
                        marginBottom: "4px",
                      }}>
                        ID Firestore : {command.id}
                      </div>
                      <div style={{
                        fontSize: "clamp(12px, 2vw, 14px)",
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
                      fontSize: "clamp(11px, 1.5vw, 12px)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      whiteSpace: "nowrap",
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
                          fontSize: "clamp(11px, 1.5vw, 12px)",
                          color: "#9ca3af",
                          margin: "0 0 8px 0",
                          fontWeight: "600",
                        }}>
                          📦 Produit commandé
                        </p>
                        {getOrderItems(command).map((item) => (
                          <div key={`${item.productId}-${item.productName}`} style={{ marginBottom: "8px" }}>
                            <p style={{
                              fontSize: "clamp(14px, 2vw, 15px)",
                              color: "#1f2937",
                              margin: "0 0 4px 0",
                              fontWeight: "700",
                            }}>
                              {item.productName}
                            </p>
                            <p style={{
                              fontSize: "clamp(12px, 1.5vw, 13px)",
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
                        fontSize: "clamp(11px, 1.5vw, 12px)",
                        color: "#9ca3af",
                        margin: "0 0 4px 0",
                        fontWeight: "600",
                      }}>
                        🏠 Départ
                      </p>
                      <p style={{
                        fontSize: "clamp(13px, 2vw, 14px)",
                        color: "#1f2937",
                        margin: 0,
                        fontWeight: "600",
                      }}>
                        {command.depart}
                      </p>
                    </div>
                    <div>
                      <p style={{
                        fontSize: "clamp(11px, 1.5vw, 12px)",
                        color: "#9ca3af",
                        margin: "0 0 4px 0",
                        fontWeight: "600",
                      }}>
                        📍 Adresse de livraison
                      </p>
                      <p style={{
                        fontSize: "clamp(13px, 2vw, 14px)",
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
                      fontSize: "clamp(11px, 1.5vw, 12px)",
                      color: "#9ca3af",
                      margin: "0 0 8px 0",
                      fontWeight: "600",
                    }}>
                      📦 Description
                    </p>
                    <p style={{
                      fontSize: "clamp(13px, 1.5vw, 14px)",
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
                        fontSize: "clamp(11px, 1.5vw, 12px)",
                        color: "#9ca3af",
                        margin: "0 0 4px 0",
                        fontWeight: "600",
                      }}>
                        💰 Prix
                      </p>
                      <p style={{
                        fontSize: "clamp(16px, 3vw, 18px)",
                        color: "#7c3aed",
                        margin: 0,
                        fontWeight: "900",
                      }}>
                        {command.prix.toLocaleString("fr-FR")} FCFA
                      </p>
                    </div>
                    <div>
                      <p style={{
                        fontSize: "clamp(11px, 1.5vw, 12px)",
                        color: "#9ca3af",
                        margin: "0 0 4px 0",
                        fontWeight: "600",
                      }}>
                        💳 Mode de paiement
                      </p>
                      <p style={{
                        fontSize: "clamp(13px, 2vw, 14px)",
                        color: "#1f2937",
                        margin: 0,
                        fontWeight: "600",
                      }}>
                        {command.modePayement || command.paymentMethod || "Non spécifié"}
                      </p>
                    </div>
                  </div>

                  {command.paymentStatus && (
                    <div style={{
                      marginTop: "16px",
                      paddingTop: "16px",
                      borderTop: "1px solid #e5e7eb",
                    }}>
                      <p style={{
                        fontSize: "clamp(11px, 1.5vw, 12px)",
                        color: "#9ca3af",
                        margin: "0 0 8px 0",
                        fontWeight: "600",
                      }}>
                        📊 Statut du paiement
                      </p>
                      <div
                        style={{
                          display: "inline-block",
                          padding: "8px 16px",
                          background: command.paymentStatus === "Confirmé" 
                            ? "#10b981" 
                            : command.paymentStatus === "À payer à la livraison"
                            ? "#f59e0b"
                            : "#ef4444",
                          color: "#ffffff",
                          borderRadius: "20px",
                          fontSize: "clamp(11px, 1.5vw, 13px)",
                          fontWeight: "600",
                        }}
                      >
                        {command.paymentStatus}
                      </div>
                    </div>
                  )}

                  {/* Boutons d'actions */}
                  <div style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "1px solid #e5e7eb",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "12px",
                  }}>
                    {/* Bouton Copier l'ID */}
                    <button
                      onClick={async () => {
                        if (!command.id) return;
                        try {
                          await navigator.clipboard.writeText(command.id);
                          alert("✅ ID copié dans le presse-papiers.");
                        } catch (err) {
                          console.error("Erreur copie ID :", err);
                          alert("Erreur lors de la copie de l'ID.");
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "12px 16px",
                        background: "#2563eb",
                        color: "#ffffff",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: "600",
                        fontSize: "clamp(12px, 1.5vw, 13px)",
                        transition: "all 0.3s",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(37, 99, 235, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      📋 Copier l&apos;ID
                    </button>

                    {/* Bouton Partager */}
                    <a
                      href={getWhatsAppShareUrl(command)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "12px 16px",
                        background: "#10b981",
                        color: "#ffffff",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: "600",
                        fontSize: "clamp(12px, 1.5vw, 13px)",
                        transition: "all 0.3s",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(16, 185, 129, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      📤 Partager
                    </a>

                    {/* Bouton Commander à nouveau */}
                    <button
                      type="button"
                      onClick={() => handleReorder(command)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "12px 16px",
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "#ffffff",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: "600",
                        fontSize: "clamp(12px, 1.5vw, 13px)",
                        transition: "all 0.3s",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(16, 185, 129, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      🔄 Commander à nouveau
                    </button>

                    {/* Bouton Contacter le livreur */}
                    <a
                      href={getAdminWhatsAppUrl(command)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "12px 16px",
                        background: "linear-gradient(135deg, #25d366 0%, #1da851 100%)",
                        color: "#ffffff",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: "600",
                        fontSize: "clamp(12px, 1.5vw, 13px)",
                        transition: "all 0.3s",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(37, 211, 102, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      💬 Contacter le livreur
                    </a>
                    <button
                      type="button"
                      onClick={(e) => handleTrack(e as unknown as MouseEvent<HTMLAnchorElement>, command)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "12px 16px",
                        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                        color: "#ffffff",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: "600",
                        fontSize: "clamp(12px, 1.5vw, 13px)",
                        transition: "all 0.3s",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(37, 99, 235, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      📍 Suivre la commande
                    </button>
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
        
        @media (max-width: 640px) {
          main {
            padding: 16px !important;
          }
        }
      `}</style>
    </main>
  );
}
