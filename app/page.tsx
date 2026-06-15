"use client";
import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import HowItWorks from "./components/HowItWorks";
import AdvantagesSection from "./components/AdvantagesSection";
import Footer from "./components/Footer";
import {
  QUARTIERS_DAKAR,
  obtenirQuartiersFiltres,
  calculerTarif,
  formatPrix,
  getDescriptionRoute,
} from "./utils/tarifs";
import { createCommand } from "./utils/firestoreCommands";
import Link from "next/link";

// Charger MapSection de manière dynamique (nécessite le navigateur)
const MapSection = dynamic(() => import("./components/MapSection"), {
  ssr: false,
});

export default function Home() {
  const [nomClient, setNomClient] = useState("");
  const [telephone, setTelephone] = useState("");
  const [depart, setDepart] = useState("");
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [modePayement, setModePayement] = useState("");
  
  // Recherche intelligente des quartiers
  const [searchDepart, setSearchDepart] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [showSuggestionsDepart, setShowSuggestionsDepart] = useState(false);
  const [showSuggestionsDestination, setShowSuggestionsDestination] = useState(false);
  
  const suggestionDepart = obtenirQuartiersFiltres(searchDepart);
  const suggestionDestination = obtenirQuartiersFiltres(searchDestination);

  // Calcul automatique du prix selon les quartiers
  const prix = depart && destination ? calculerTarif(depart, destination) : 0;
  const descriptionRoute = getDescriptionRoute(depart, destination);

  // Quartiers disponibles
  const quartiers = QUARTIERS_DAKAR;

  // Nouvelle fonction intégrée - Firestore + WhatsApp
  const envoyerCommande = async () => {
    setIsLoading(true);
    try {
      // 1. Sauvegarder dans Firestore
      const dateLivraison = new Date();
      dateLivraison.setDate(dateLivraison.getDate() + 1); // Livraison par défaut demain

      const commandeId = await createCommand({
        telephone,
        nomClient,
        depart,
        destination,
        description,
        prix,
        modePayement,
        statut: "en attente",
        dateLivraison,
        client: nomClient, // Sauvegarde le nom du client
      });

      console.log("✅ Commande sauvegardée dans Firestore:", commandeId);

      // 2. Afficher le message de succès
      setSuccessMessage("✅ Commande enregistrée avec succès!");
      setTimeout(() => setSuccessMessage(""), 3000);

      // 3. Envoyer le message WhatsApp
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const message =
        `Nouvelle commande 🚚%0A%0A` +
        `ID: ${commandeId}%0A` +
        `Client: ${nomClient}%0A` +
        `Téléphone: ${telephone}%0A` +
        `Départ: ${depart}%0A` +
        `Destination: ${destination}%0A` +
        `Description: ${description}%0A` +
        `Prix: ${prix} FCFA%0A` +
        `Paiement: ${modePayement}%0A%0A` +
        `Voir l'historique: ${origin}/commands`;

      if (typeof window !== "undefined") {
        window.open(
          `https://wa.me/221773629075?text=${message}`,
          "_blank"
        );
      }

      // 4. Réinitialiser le formulaire
      setTimeout(() => {
        setNomClient("");
        setTelephone("");
        setDepart("");
        setDestination("");
        setDescription("");
        setModePayement("");
      }, 1000);
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde:", error);
      
      // Afficher plus de détails sur l'erreur
      if (error instanceof Error) {
        console.error("Message d'erreur:", error.message);
        console.error("Code d'erreur:", (error as any).code);
        
        if ((error as any).code === "permission-denied") {
          console.error("🔒 SOLUTION: Les règles Firestore ne permettent pas l'accès.");
          console.error("1. Allez à Firebase Console → Firestore → Règles");
          console.error("2. Remplacez par les règles temporaires (voir FIRESTORE_SETUP.md)");
          console.error("3. Déployez avec: firebase deploy --only firestore:rules");
          alert("❌ Erreur de permission Firestore. Consultez la console pour les solutions.");
        } else {
          alert(`❌ Erreur: ${error.message}`);
        }
      } else {
        alert("❌ Erreur lors de la sauvegarde de la commande. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main style={{
      width: "100%",
      overflowX: "hidden",
      overflowY: "auto",
      margin: 0,
      padding: 0,
    }}>
      {/* Navigation Header - Responsive */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "rgba(15, 23, 42, 0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "12px 16px",
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        minHeight: "50px",
        width: "100%",
        boxSizing: "border-box",
        margin: "0",
      }}>
        <div style={{ fontSize: "14px", fontWeight: "900", color: "#ffffff", minWidth: "auto", whiteSpace: "nowrap", flex: "0 0 auto" }}>
          🚚 Livraison Pro
        </div>
        <div style={{ 
          display: "flex", 
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          flex: 1,
          alignItems: "center",
          minWidth: "0",
        }}>
          <Link
            href="/admin"
            style={{
              padding: "10px 16px",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ff6b6b",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "13px",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              transition: "all 0.3s",
              whiteSpace: "nowrap",
              minWidth: "auto",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            🛡️ Admin
          </Link>
          <Link
            href="/boutique"
            style={{
              padding: "10px 16px",
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              color: "#ffffff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "13px",
              transition: "all 0.3s",
              whiteSpace: "nowrap",
              minWidth: "auto",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(124, 58, 237, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            🛒 Boutique
          </Link>
          <Link
            href="/commander/history"
            style={{
              padding: "10px 16px",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "13px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              transition: "all 0.3s",
              whiteSpace: "nowrap",
              minWidth: "auto",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            📍 Historique
          </Link>
        </div>
      </div>

      {/* Logo déplacé en bas du hero - plus de chevauchement avec les boutons */}

      {/* SECTION: Image héro avec livreur - entièrement visible */}
      <section style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
        padding: "70px 20px 40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "auto",
        position: "relative",
        overflow: "visible",
        width: "100%",
        boxSizing: "border-box",
        margin: "0",
        maxWidth: "100%",
      }} className="hero-section-home">
        {/* Décoration de fond */}
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "600px",
          height: "600px",
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-30%",
          left: "-5%",
          width: "400px",
          height: "400px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "700px", padding: "0 15px", boxSizing: "border-box", margin: "0 auto" }} className="livreur-container">
          <Image
            src="/livreur_bg.png"
            alt="Livreur"
            width={700}
            height={700}
            priority
            className="livreur-image"
            style={{
              objectFit: "contain",
              objectPosition: "center center",
              width: "100%",
              height: "auto",
              maxHeight: "650px",
              filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2))",
              display: "block",
            }}
          />
        </div>

        {/* Logo en bas à droite du hero - aucun chevauchement */}
        <div style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 10,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          padding: "10px 14px",
          borderRadius: "14px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}>
          <Image
            src="/logo2_app.png"
            alt="Logo Livraison App"
            width={55}
            height={55}
            priority
            style={{ objectFit: "contain", maxWidth: "100%", height: "auto", display: "block" }}
          />
        </div>
      </section>

      {/* SECTION: Cartes de services élégantes */}
      <section style={{
        padding: "100px 20px",
        background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}>
          {/* Titre */}
          <div style={{
            textAlign: "center",
            marginBottom: "80px",
          }}>
            <h2 style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: "900",
              color: "#0f172a",
              margin: "0 0 15px 0",
              letterSpacing: "-1px",
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Nos services disponibles
            </h2>
            <div style={{
              width: "60px",
              height: "4px",
              background: "linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)",
              margin: "20px auto",
              borderRadius: "2px",
            }} />
            <p style={{
              fontSize: "18px",
              color: "#64748b",
              margin: "0",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              Explorez nos services de livraison modernes et efficaces
            </p>
          </div>

          {/* Grille de cartes */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
            marginBottom: "60px",
          }}>
            {/* Carte Taxi */}
            <div style={{
              borderRadius: "24px",
              overflow: "hidden",
              background: "#ffffff",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              border: "2px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-12px)";
              e.currentTarget.style.boxShadow = "0 25px 50px rgba(124, 58, 237, 0.15)";
              e.currentTarget.style.borderColor = "#7c3aed";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
              e.currentTarget.style.borderColor = "transparent";
            }}>
              <div style={{
                position: "relative",
                width: "100%",
                height: "200px",
                overflow: "hidden",
                background: "#f0f4f8",
              }}>
                <Image
                  src="/taxi_course_bientot.png"
                  alt="Service Taxi"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "rgba(124, 58, 237, 0.9)",
                  color: "#ffffff",
                  padding: "8px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  backdropFilter: "blur(10px)",
                }}>
                  Bientôt disponible
                </div>
              </div>
              <div style={{
                padding: "24px",
              }}>
                <div style={{
                  fontSize: "40px",
                  marginBottom: "12px",
                }}>🚕</div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#0f172a",
                  margin: "0 0 8px 0",
                }}>
                  Service Taxi
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: "0 0 16px 0",
                  lineHeight: "1.6",
                }}>
                  Déplacements rapides et confortables dans toute Dakar
                </p>
                <div style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                }}>
                  <span style={{
                    display: "inline-block",
                    background: "#ede9fe",
                    color: "#7c3aed",
                    padding: "6px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}>⚡ Rapide</span>
                  <span style={{
                    display: "inline-block",
                    background: "#dbeafe",
                    color: "#2563eb",
                    padding: "6px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}>💰 Abordable</span>
                </div>
              </div>
            </div>

            {/* Carte Restaurant */}
            <div style={{
              borderRadius: "24px",
              overflow: "hidden",
              background: "#ffffff",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              border: "2px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-12px)";
              e.currentTarget.style.boxShadow = "0 25px 50px rgba(124, 58, 237, 0.15)";
              e.currentTarget.style.borderColor = "#7c3aed";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
              e.currentTarget.style.borderColor = "transparent";
            }}>
              <div style={{
                position: "relative",
                width: "100%",
                height: "200px",
                overflow: "hidden",
                background: "#f0f4f8",
              }}>
                <Image
                  src="/restaurant_bg.png"
                  alt="Service Restaurant"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "rgba(124, 58, 237, 0.9)",
                  color: "#ffffff",
                  padding: "8px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  backdropFilter: "blur(10px)",
                }}>
                  Bientôt disponible
                </div>
              </div>
              <div style={{
                padding: "24px",
              }}>
                <div style={{
                  fontSize: "40px",
                  marginBottom: "12px",
                }}>🍕</div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#0f172a",
                  margin: "0 0 8px 0",
                }}>
                  Livraison Repas
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: "0 0 16px 0",
                  lineHeight: "1.6",
                }}>
                  Vos repas préférés livrés chauds et délicieux à votre porte
                </p>
                <div style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                }}>
                  <span style={{
                    display: "inline-block",
                    background: "#ede9fe",
                    color: "#7c3aed",
                    padding: "6px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}>🔥 Chaud</span>
                  <span style={{
                    display: "inline-block",
                    background: "#dbeafe",
                    color: "#2563eb",
                    padding: "6px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}>😋 Délicieux</span>
                </div>
              </div>
            </div>

            {/* Carte Cargo */}
            <div style={{
              borderRadius: "24px",
              overflow: "hidden",
              background: "#ffffff",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              border: "2px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-12px)";
              e.currentTarget.style.boxShadow = "0 25px 50px rgba(124, 58, 237, 0.15)";
              e.currentTarget.style.borderColor = "#7c3aed";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
              e.currentTarget.style.borderColor = "transparent";
            }}>
              <div style={{
                position: "relative",
                width: "100%",
                height: "200px",
                overflow: "hidden",
                background: "#f0f4f8",
              }}>
                <Image
                  src="/cargo_bg.png"
                  alt="Service Cargo"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "rgba(124, 58, 237, 0.9)",
                  color: "#ffffff",
                  padding: "8px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  backdropFilter: "blur(10px)",
                }}>
                  Bientôt disponible
                </div>
              </div>
              <div style={{
                padding: "24px",
              }}>
                <div style={{
                  fontSize: "40px",
                  marginBottom: "12px",
                }}>📦</div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#0f172a",
                  margin: "0 0 8px 0",
                }}>
                  Service Cargo
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: "0 0 16px 0",
                  lineHeight: "1.6",
                }}>
                  Envoyez vos colis en toute sécurité dans toute la région
                </p>
                <div style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                }}>
                  <span style={{
                    display: "inline-block",
                    background: "#ede9fe",
                    color: "#7c3aed",
                    padding: "6px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}>🔒 Sécurisé</span>
                  <span style={{
                    display: "inline-block",
                    background: "#dbeafe",
                    color: "#2563eb",
                    padding: "6px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}>🚚 Rapide</span>
                </div>
              </div>
            </div>

            {/* Carte Boutique */}
            <div style={{
              borderRadius: "24px",
              overflow: "hidden",
              background: "#ffffff",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              border: "2px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-12px)";
              e.currentTarget.style.boxShadow = "0 25px 50px rgba(124, 58, 237, 0.15)";
              e.currentTarget.style.borderColor = "#7c3aed";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
              e.currentTarget.style.borderColor = "transparent";
            }}>
              <div style={{
                position: "relative",
                width: "100%",
                height: "200px",
                overflow: "hidden",
                background: "#f0f4f8",
              }}>
                <Image
                  src="/boutique_bg.png"
                  alt="Service Boutique"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "rgba(124, 58, 237, 0.9)",
                  color: "#ffffff",
                  padding: "8px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  backdropFilter: "blur(10px)",
                }}>
                  Bientôt disponible
                </div>
              </div>
              <div style={{
                padding: "24px",
              }}>
                <div style={{
                  fontSize: "40px",
                  marginBottom: "12px",
                }}>🛍️</div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#0f172a",
                  margin: "0 0 8px 0",
                }}>
                  Service Boutique
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: "0 0 16px 0",
                  lineHeight: "1.6",
                }}>
                  Tous vos achats en boutique livrés rapidement chez vous
                </p>
                <div style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                }}>
                  <span style={{
                    display: "inline-block",
                    background: "#ede9fe",
                    color: "#7c3aed",
                    padding: "6px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}>🎁 Flexible</span>
                  <span style={{
                    display: "inline-block",
                    background: "#dbeafe",
                    color: "#2563eb",
                    padding: "6px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}>💳 Simple</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Historique - conservé dans header uniquement */}

      {/* SECTION 1: Hero Section */}
      <HeroSection />

      {/* SECTION 2: Services */}
      <ServicesSection />

      {/* SECTION 3: Comment ça marche */}
      <HowItWorks />

      {/* SECTION 4: Avantages */}
      <AdvantagesSection />

      {/* SECTION 5: Formulaire de tarification (Code existant conservé) */}
      <section
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: "80px 16px",
          minHeight: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            padding: "40px 24px",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "480px",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)",
            border: "1px solid #475569",
          }}
        >
          {/* En-tête avec logo */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div
              style={{
                fontSize: "48px",
                marginBottom: "15px",
              }}
            >
              🚚
            </div>
            <h2
              style={{
                color: "#ffffff",
                textAlign: "center",
                marginBottom: "8px",
                fontSize: "32px",
                fontWeight: "900",
                background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Calculer votre tarif
            </h2>
            <p
              style={{
                color: "#cbd5e1",
                fontSize: "14px",
                margin: "0",
              }}
            >
              Tarification transparente et automatique
            </p>
          </div>

          {/* Section téléphone */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                color: "#e2e8f0",
                fontSize: "13px",
                fontWeight: "700",
                marginBottom: "10px",
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
                padding: "14px 16px",
                marginBottom: "0",
                borderRadius: "12px",
                border: "2px solid #475569",
                background: "#0f172a",
                color: "#ffffff",
                fontSize: "14px",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#7c3aed";
                (e.target as HTMLInputElement).style.boxShadow =
                  "0 0 16px rgba(124, 58, 237, 0.3)";
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#475569";
                (e.target as HTMLInputElement).style.boxShadow = "none";
              }}
            />
          </div>

          {/* Section nom du client */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                color: "#e2e8f0",
                fontSize: "13px",
                fontWeight: "700",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              👤 Nom complet
            </label>
            <input
              placeholder="Votre nom complet"
              value={nomClient}
              onChange={(e) => setNomClient(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                marginBottom: "0",
                borderRadius: "12px",
                border: "2px solid #475569",
                background: "#0f172a",
                color: "#ffffff",
                fontSize: "14px",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#7c3aed";
                (e.target as HTMLInputElement).style.boxShadow =
                  "0 0 16px rgba(124, 58, 237, 0.3)";
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#475569";
                (e.target as HTMLInputElement).style.boxShadow = "none";
              }}
            />
          </div>

          {/* Section départ et destination avec recherche intelligente */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            {/* Départ avec autocomplétion */}
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  color: "#e2e8f0",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                🏠 Départ
              </label>
              <input
                type="text"
                placeholder="Rechercher un quartier..."
                value={depart || searchDepart}
                onChange={(e) => {
                  setSearchDepart(e.target.value);
                  setShowSuggestionsDepart(true);
                  if (!e.target.value) setDepart("");
                }}
                onFocus={() => setShowSuggestionsDepart(true)}
                style={{
                  width: "100%",
                  padding: "14px 14px",
                  borderRadius: "12px",
                  border: "2px solid #475569",
                  background: "#0f172a",
                  color: "#ffffff",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
              {showSuggestionsDepart && searchDepart && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "#1e293b",
                    border: "2px solid #7c3aed",
                    borderTop: "none",
                    borderRadius: "0 0 12px 12px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    zIndex: 10,
                  }}
                >
                  {suggestionDepart.slice(0, 10).map((q) => (
                    <div
                      key={q}
                      onClick={() => {
                        setDepart(q);
                        setSearchDepart(q);
                        setShowSuggestionsDepart(false);
                      }}
                      style={{
                        padding: "10px 14px",
                        cursor: "pointer",
                        background: depart === q ? "#7c3aed" : "transparent",
                        color: "#ffffff",
                        fontSize: "14px",
                        borderBottom: "1px solid #334155",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (depart !== q) e.currentTarget.style.background = "#334155";
                      }}
                      onMouseLeave={(e) => {
                        if (depart !== q) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {q}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Destination avec autocomplétion */}
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  color: "#e2e8f0",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                📍 Destination
              </label>
              <input
                type="text"
                placeholder="Rechercher un quartier..."
                value={destination || searchDestination}
                onChange={(e) => {
                  setSearchDestination(e.target.value);
                  setShowSuggestionsDestination(true);
                  if (!e.target.value) setDestination("");
                }}
                onFocus={() => setShowSuggestionsDestination(true)}
                style={{
                  width: "100%",
                  padding: "14px 14px",
                  borderRadius: "12px",
                  border: "2px solid #475569",
                  background: "#0f172a",
                  color: "#ffffff",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
              {showSuggestionsDestination && searchDestination && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "#1e293b",
                    border: "2px solid #7c3aed",
                    borderTop: "none",
                    borderRadius: "0 0 12px 12px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    zIndex: 10,
                  }}
                >
                  {suggestionDestination.slice(0, 10).map((q) => (
                    <div
                      key={q}
                      onClick={() => {
                        setDestination(q);
                        setSearchDestination(q);
                        setShowSuggestionsDestination(false);
                      }}
                      style={{
                        padding: "10px 14px",
                        cursor: "pointer",
                        background: destination === q ? "#7c3aed" : "transparent",
                        color: "#ffffff",
                        fontSize: "14px",
                        borderBottom: "1px solid #334155",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (destination !== q) e.currentTarget.style.background = "#334155";
                      }}
                      onMouseLeave={(e) => {
                        if (destination !== q) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {q}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                display: "block",
                color: "#e2e8f0",
                fontSize: "13px",
                fontWeight: "700",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              📦 Description de la commande
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Nature du colis, quantité, instructions spéciales..."
              style={{
                width: "100%",
                padding: "14px 14px",
                borderRadius: "12px",
                border: "2px solid #475569",
                background: "#0f172a",
                color: "#ffffff",
                fontSize: "14px",
                boxSizing: "border-box",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "inherit",
                minHeight: "100px",
                resize: "vertical",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#7c3aed";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#475569";
              }}
            />
          </div>

          {/* Affichage de la route et du prix calculé */}
          {depart && destination && (
            <div
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                padding: "18px",
                borderRadius: "14px",
                marginBottom: "24px",
                border: "2px solid rgba(124, 58, 237, 0.5)",
                transition: "all 0.3s ease",
              }}
            >
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "12px",
                  margin: "0 0 8px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontWeight: "600",
                }}
              >
                📍 Itinéraire
              </p>
              <p
                style={{
                  color: "#fbbf24",
                  fontSize: "15px",
                  fontWeight: "700",
                  margin: "0 0 14px 0",
                }}
              >
                {descriptionRoute}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "2px solid rgba(255, 255, 255, 0.2)",
                  paddingTop: "14px",
                }}
              >
                <span
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  💰 Tarif estimé :
                </span>
                <span
                  style={{
                    color: "#fbbf24",
                    fontSize: "24px",
                    fontWeight: "900",
                  }}
                >
                  {formatPrix(prix)}
                </span>
              </div>
            </div>
          )}

          {/* Message de succès */}
          {successMessage && (
            <div
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                border: "2px solid #22c55e",
                color: "#22c55e",
                padding: "12px 14px",
                borderRadius: "10px",
                marginBottom: "24px",
                textAlign: "center",
                fontWeight: "600",
                animation: "slideIn 0.3s ease",
              }}
            >
              {successMessage}
            </div>
          )}

          {/* Section paiement */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                color: "#e2e8f0",
                fontSize: "13px",
                fontWeight: "700",
                marginBottom: "14px",
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
              }}
            >
              {["Wave", "Orange Money", "Cash", "Carte"].map((method) => (
                <button
                  key={method}
                  onClick={() => setModePayement(method)}
                  type="button"
                  style={{
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: modePayement === method ? "2px solid #7c3aed" : "2px solid #475569",
                    background: modePayement === method ? "rgba(124, 58, 237, 0.2)" : "#0f172a",
                    color: modePayement === method ? "#7c3aed" : "#e2e8f0",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = "2px solid #7c3aed";
                    e.currentTarget.style.color = "#7c3aed";
                    e.currentTarget.style.background =
                      "rgba(124, 58, 237, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = modePayement === method ? "2px solid #7c3aed" : "2px solid #475569";
                    e.currentTarget.style.color = modePayement === method ? "#7c3aed" : "#e2e8f0";
                    e.currentTarget.style.background = modePayement === method ? "rgba(124, 58, 237, 0.2)" : "#0f172a";
                  }}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Bouton d'envoi */}
          <button
            onClick={envoyerCommande}
            disabled={!telephone || !nomClient || !depart || !destination || !description || !modePayement || isLoading}
            style={{
              width: "100%",
              padding: "16px 20px",
              fontSize: "16px",
              fontWeight: "900",
              color: "#ffffff",
              background:
                telephone && nomClient && depart && destination && description && modePayement && !isLoading
                  ? "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)"
                  : "#475569",
              border: "none",
              borderRadius: "12px",
              cursor:
                telephone && nomClient && depart && destination && description && modePayement && !isLoading ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              boxShadow:
                telephone && nomClient && depart && destination && description && modePayement && !isLoading
                  ? "0 10px 30px rgba(124, 58, 237, 0.3)"
                  : "none",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "12px",
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (telephone && nomClient && depart && destination && description && modePayement && !isLoading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 15px 40px rgba(124, 58, 237, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (telephone && nomClient && depart && destination && description && modePayement && !isLoading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(124, 58, 237, 0.3)";
              }
            }}
          >
            {isLoading ? "⏳ Traitement..." : "💬 Commander sur WhatsApp"}
          </button>

          {/* Info supplémentaire */}
          <div
            style={{
              background: "rgba(124, 58, 237, 0.1)",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#cbd5e1",
                fontSize: "12px",
                margin: "0",
                lineHeight: "1.6",
              }}
            >
              ✨ Remplissez tous les champs pour voir le tarif exacte et passer votre commande en un clic
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: Boutique */}
      <section style={{
        padding: "100px 20px",
        background: "linear-gradient(to bottom, #ffffff, #f3f4f6)",
        textAlign: "center",
      }}>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "16px",
          }}>🛒</div>
          <h2 style={{
            fontSize: "32px",
            fontWeight: "900",
            color: "#1f2937",
            margin: "0 0 16px 0",
          }}>
            Découvrez notre Boutique
          </h2>
          <p style={{
            fontSize: "16px",
            color: "#6b7280",
            margin: "0 0 32px 0",
            lineHeight: "1.6",
          }}>
            Parcourez nos produits sélectionnés. Commandez en ligne et faites-vous livrer directement chez vous
          </p>
          <Link
            href="/boutique"
            style={{
              display: "inline-block",
              padding: "16px 32px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "16px",
              transition: "all 0.3s",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
              marginRight: "16px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(16, 185, 129, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(16, 185, 129, 0.3)";
            }}
          >
            🛍️ Visiter la Boutique
          </Link>
        </div>
      </section>

      {/* SECTION 7: Historique Client */}
      <section style={{
        padding: "100px 20px",
        background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
        textAlign: "center",
      }}>
        <div style={{
          maxWidth: "600px",
          margin: "0 auto",
        }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "16px",
          }}>📦</div>
          <h2 style={{
            fontSize: "32px",
            fontWeight: "900",
            color: "#ffffff",
            margin: "0 0 16px 0",
          }}>
            Suivi de vos commandes
          </h2>
          <p style={{
            fontSize: "16px",
            color: "#d1d5db",
            margin: "0 0 32px 0",
            lineHeight: "1.6",
          }}>
            Consultez l'historique de toutes vos commandes, suivi en temps réel et statuts de livraison
          </p>
          <Link
            href="/commander/history"
            style={{
              display: "inline-block",
              padding: "16px 32px",
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              color: "#ffffff",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "16px",
              transition: "all 0.3s",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              boxShadow: "0 10px 30px rgba(124, 58, 237, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(124, 58, 237, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(124, 58, 237, 0.3)";
            }}
          >
            📍 Mon Historique
          </Link>
        </div>
      </section>

      {/* SECTION 8: Footer */}

<MapSection
  depart={depart}
  destination={destination}
  prix={prix}
/>

<Footer />

      {/* Styles globaux */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          padding: 0;
          background: #ffffff;
          color: #1f2937;
        }

        /* Responsive */
        @media (max-width: 768px) {
          section {
            padding: 60px 15px !important;
          }
          
          /* Hero mobile - livreur en bas, fond plein */
          .hero-section-home {
            padding: 20px 0 0 0 !important;
            min-height: 520px !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-end !important;
            align-items: center !important;
            width: 100% !important;
            margin: 0 !important;
          }
          
          /* Afficher le livreur complètement en bas */
          .livreur-image {
            object-fit: contain !important;
            object-position: center bottom !important;
            max-height: 480px !important;
            width: 100% !important;
            height: auto !important;
            transform: none !important;
            margin: 0 !important;
            display: block !important;
            padding: 0 !important;
          }
          
          /* Conteneur du livreur */
          .livreur-container {
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </main>
  );
}
