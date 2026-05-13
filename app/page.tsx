"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import HowItWorks from "./components/HowItWorks";
import AdvantagesSection from "./components/AdvantagesSection";
import Footer from "./components/Footer";
import {
  QUARTIERS_DAKAR,
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
  const [telephone, setTelephone] = useState("");
  const [depart, setDepart] = useState("");
  const [destination, setDestination] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
        depart,
        destination,
        prix,
        statut: "en attente",
        dateLivraison,
        client: telephone, // On peut améliorer cela plus tard
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
        `Téléphone: ${telephone}%0A` +
        `Départ: ${depart}%0A` +
        `Destination: ${destination}%0A` +
        `Prix: ${prix} FCFA%0A%0A` +
        `Voir l'historique: ${origin}/commands`;

      if (typeof window !== "undefined") {
        window.open(
          `https://wa.me/221773629075?text=${message}`,
          "_blank"
        );
      }

      // 4. Réinitialiser le formulaire
      setTimeout(() => {
        setTelephone("");
        setDepart("");
        setDestination("");
      }, 1000);
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde:", error);
      alert("❌ Erreur lors de la sauvegarde de la commande. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      {/* Lien vers l'historique en haut à droite */}
      <div style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1000,
      }}>
        <Link
          href="/commands"
          style={{
            display: "inline-block",
            backgroundColor: "#0f172a",
            color: "#7c3aed",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "2px solid #7c3aed",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "14px",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(124, 58, 237, 0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#7c3aed";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#0f172a";
            e.currentTarget.style.color = "#7c3aed";
          }}
        >
          📦 Historique
        </Link>
      </div>

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
          padding: "120px 20px",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            padding: "50px 40px",
            borderRadius: "24px",
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

          {/* Section départ et destination */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "24px",
            }}
          >
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
                🏠 Départ
              </label>
              <select
                value={depart}
                onChange={(e) => setDepart(e.target.value)}
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
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
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
                  style={{
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: "2px solid #475569",
                    background: "#0f172a",
                    color: "#e2e8f0",
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
                    e.currentTarget.style.border = "2px solid #475569";
                    e.currentTarget.style.color = "#e2e8f0";
                    e.currentTarget.style.background = "#0f172a";
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
            disabled={!telephone || !depart || !destination || isLoading}
            style={{
              width: "100%",
              padding: "16px 20px",
              fontSize: "16px",
              fontWeight: "900",
              color: "#ffffff",
              background:
                telephone && depart && destination && !isLoading
                  ? "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)"
                  : "#475569",
              border: "none",
              borderRadius: "12px",
              cursor:
                telephone && depart && destination && !isLoading ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              boxShadow:
                telephone && depart && destination && !isLoading
                  ? "0 10px 30px rgba(124, 58, 237, 0.3)"
                  : "none",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "12px",
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (telephone && depart && destination && !isLoading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 15px 40px rgba(124, 58, 237, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (telephone && depart && destination && !isLoading) {
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

      {/* SECTION 6: Footer */}

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
        }
      `}</style>
    </main>
  );
}
