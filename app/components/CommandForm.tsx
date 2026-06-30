"use client";

import { useState } from "react";
import { createCommand } from "@/app/utils/firestoreCommands";
import { QUARTIERS_DAKAR, calculerTarif, formatPrix } from "@/app/utils/tarifs";

interface CommandFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CommandForm({ isOpen, onClose, onSuccess }: CommandFormProps) {
  const [formData, setFormData] = useState({
    telephone: "",
    client: "",
    depart: "",
    destination: "",
    description: "",
    type: "standard",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const prix = formData.depart && formData.destination
    ? calculerTarif(formData.depart, formData.destination)
    : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.telephone || !formData.client || !formData.depart || !formData.destination || !formData.description) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    console.log("📝 Début de la validation de la commande...");
    setLoading(true);
    
    // Timeout de sécurité: 30 secondes
    let timeoutId: NodeJS.Timeout | null = null;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("TIMEOUT: La création de la commande a dépassé 30 secondes. Vérifiez votre connexion Internet et Firebase."));
      }, 30000);
    });

    try {
      const dateLivraison = new Date();
      dateLivraison.setDate(dateLivraison.getDate() + 1);

      console.log("📦 Données de la commande:", {
        client: formData.client,
        telephone: formData.telephone,
        depart: formData.depart,
        destination: formData.destination,
        description: formData.description,
        prix,
        type: formData.type,
      });

      // Race entre createCommand et timeout
      const commandeId = await Promise.race([
        createCommand({
          telephone: formData.telephone,
          client: formData.client,
          depart: formData.depart,
          destination: formData.destination,
          description: formData.description,
          prix,
          statut: "en attente",
          dateLivraison,
        }),
        timeoutPromise,
      ]);

      if (timeoutId) clearTimeout(timeoutId);

      console.log("✅ Commande créée avec succès:", commandeId);
      setSuccessMessage("✅ Commande enregistrée avec succès!");


      setTimeout(() => {
        setFormData({ telephone: "", client: "", depart: "", destination: "", description: "", type: "standard" });
        setSuccessMessage("");
        onClose();
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error("❌ Erreur lors de la création de la commande:", error);
      
      if (timeoutId) clearTimeout(timeoutId);

      let errorMessage = "Erreur lors de la création de la commande";
      
      if (error instanceof Error) {
        console.error("📋 Détails de l'erreur:");
        console.error("   Message:", error.message);
        console.error("   Stack:", error.stack);
        
        if (error.message.includes("TIMEOUT")) {
          errorMessage = "⏱️ Timeout: La sauvegarde a pris trop longtemps. Vérifiez votre connexion Internet et que Firebase est configuré correctement.";
        } else if (error.message.includes("permission-denied") || error.message.includes("Permission denied")) {
          errorMessage = "🔒 Erreur de permission: Les règles Firestore ne permettent pas l'accès. Vérifiez firestore.rules et déployez avec 'firebase deploy --only firestore:rules'";
        } else if (error.message.includes("project not found") || error.message.includes("Project not found")) {
          errorMessage = "❌ Projet Firebase non trouvé. Vérifiez la configuration dans .env.local";
        } else if (error.message.includes("missing or insufficient permissions")) {
          errorMessage = "🔒 Permissions insuffisantes. Vérifiez les règles Firestore.";
        } else {
          errorMessage = `❌ ${error.message}`;
        }
      }
      
      alert(errorMessage);
      setSuccessMessage("");
    } finally {
      setLoading(false);
      if (timeoutId) clearTimeout(timeoutId);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 40,
          animation: "fadeIn 0.3s ease",
        }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "40px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          zIndex: 50,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          animation: "slideUp 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "900",
                color: "#1f2937",
                margin: 0,
              }}
            >
              📦 Nouvelle Commande
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#9ca3af",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#1f2937";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#9ca3af";
              }}
            >
              ✕
            </button>
          </div>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "14px" }}>
            Remplissez le formulaire pour commander maintenant
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          {/* Client Name */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1f2937" }}>
              Nom complet
            </label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              placeholder="Votre nom"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                fontSize: "14px",
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
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1f2937" }}>
              Téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="+221 77 XXX XX XX"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                fontSize: "14px",
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
            />
          </div>

          {/* Depart */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1f2937" }}>
              Départ 🏠
            </label>
            <select
              name="depart"
              value={formData.depart}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                fontSize: "14px",
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
            >
              <option value="">Sélectionnez un quartier</option>
              {QUARTIERS_DAKAR.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1f2937" }}>
              Destination 📍
            </label>
            <select
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                fontSize: "14px",
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
            >
              <option value="">Sélectionnez un quartier</option>
              {QUARTIERS_DAKAR.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1f2937" }}>
              📦 Description de la commande
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
              }}
              placeholder="Ex: Nature du colis, quantité, instructions spéciales..."
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                fontSize: "14px",
                transition: "all 0.2s",
                boxSizing: "border-box",
                fontFamily: "inherit",
                minHeight: "100px",
                resize: "vertical",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#7c3aed";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124, 58, 237, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Type */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#1f2937" }}>
              Type de livraison
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                fontSize: "14px",
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
            >
              <option value="standard">Standard</option>
              <option value="urgent">Urgent (30 min)</option>
              <option value="express">Express (1h)</option>
            </select>
          </div>

          {/* Price Display */}
          {prix > 0 && (
            <div
              style={{
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #bfdbfe",
              }}
            >
              <span style={{ color: "#1f2937", fontWeight: "600" }}>Prix estimé:</span>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "900",
                  color: "#7c3aed",
                }}
              >
                {prix} FCFA
              </span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div
              style={{
                background: "#dcfce7",
                color: "#166534",
                padding: "12px 16px",
                borderRadius: "10px",
                marginBottom: "20px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {successMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading
                ? "#d1d5db"
                : "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "16px",
              border: "none",
              borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(124, 58, 237, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {loading ? "⏳ Création..." : "✅ Confirmer la commande"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </>
  );
}
