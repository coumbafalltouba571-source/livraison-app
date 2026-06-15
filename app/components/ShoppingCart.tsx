"use client";

import { useState } from "react";
import { CartState, removeFromCart, updateQuantity } from "@/app/utils/shop";
import { createCommand } from "@/app/utils/firestoreCommands";

interface ShoppingCartProps {
  cart: CartState;
  onUpdateCart: (newCart: CartState) => void;
  onClose: () => void;
}

export default function ShoppingCart({
  cart,
  onUpdateCart,
  onClose,
}: ShoppingCartProps) {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRemoveItem = (productId: string) => {
    const newCart = removeFromCart(cart, productId);
    onUpdateCart(newCart);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const newCart = updateQuantity(cart, productId, quantity);
    onUpdateCart(newCart);
  };

  const handleCheckout = async () => {
    if (!clientName.trim() || !clientPhone.trim() || !paymentMethod) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Timeout de sécurité (30 secondes)
    const timeoutId = setTimeout(() => {
      setIsProcessing(false);
      setErrorMessage("⏱️ La demande a pris trop de temps. Veuillez réessayer.");
    }, 30000);

    try {
      // Créer description à partir des produits
      const description = cart.items
        .map((item) => `${item.quantity}x ${item.product.name}`)
        .join(", ");

      // Créer la commande
      const commandResult = await createCommand({
        telephone: clientPhone,
        client: clientName,
        nomClient: clientName,
        depart: "Boutique",
        destination: "À livrer",
        description: `Achat boutique: ${description}`,
        prix: cart.total,
        modePayement: paymentMethod,
        statut: "en attente",
        dateLivraison: new Date(Date.now() + 24 * 60 * 60 * 1000), // Demain
      });

      if (!commandResult) {
        throw new Error("Échec de la création de la commande");
      }

      clearTimeout(timeoutId);
      setSuccessMessage("✅ Commande enregistrée avec succès dans le système!");
      setIsProcessing(false);

      // Envoyer WhatsApp
      try {
        const message =
          `Nouvelle commande boutique 🛒%0A%0A` +
          `Nom: ${clientName}%0A` +
          `Téléphone: ${clientPhone}%0A` +
          `Produits: ${description}%0A` +
          `Total: ${cart.total.toLocaleString("fr-FR")} FCFA%0A` +
          `Paiement: ${paymentMethod}`;

        if (typeof window !== "undefined") {
          window.open(
            `https://wa.me/221773629075?text=${encodeURIComponent(message)}`,
            "_blank"
          );
        }
      } catch (whatsappError) {
        console.warn("Erreur WhatsApp:", whatsappError);
        // Ne pas bloquer si WhatsApp échoue
      }

      // Garder le message de succès visible plus longtemps et offrir des options
      // Au lieu de fermer automatiquement
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Erreur lors du checkout:", error);
      const errorMsg = error instanceof Error ? error.message : "Erreur lors de la création de la commande";
      setErrorMessage(`❌ ${errorMsg}`);
      setIsProcessing(false);
    }
  };

  const handleContinueShopping = () => {
    onUpdateCart({ items: [], total: 0 });
    setClientName("");
    setClientPhone("");
    setPaymentMethod("");
    setSuccessMessage("");
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 40,
        }}
        onClick={onClose}
      />

      {/* Modal Panier */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "40px",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          zIndex: 50,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Titre */}
        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
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
              🛒 Mon Panier
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
            >
              ✕
            </button>
          </div>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "14px" }}>
            {cart.items.length} article{cart.items.length !== 1 ? "s" : ""} dans votre panier
          </p>
        </div>

        {/* Articles */}
        {cart.items.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#9ca3af",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
            <p>Votre panier est vide</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "30px", maxHeight: "300px", overflowY: "auto" }}>
              {cart.items.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 0",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1f2937",
                        marginBottom: "4px",
                      }}
                    >
                      {item.product.name}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#7c3aed",
                        fontWeight: "700",
                      }}
                    >
                      {(item.product.price * item.quantity).toLocaleString(
                        "fr-FR"
                      )}{" "}
                      FCFA
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product.id, item.quantity - 1)
                      }
                      style={{
                        padding: "4px 8px",
                        border: "1px solid #e5e7eb",
                        background: "#f9fafb",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        minWidth: "20px",
                        textAlign: "center",
                        fontWeight: "600",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product.id, item.quantity + 1)
                      }
                      style={{
                        padding: "4px 8px",
                        border: "1px solid #e5e7eb",
                        background: "#f9fafb",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      style={{
                        padding: "4px 8px",
                        border: "none",
                        background: "#fee2e2",
                        color: "#dc2626",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div
              style={{
                background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #d1d5db",
              }}
            >
              <span style={{ fontWeight: "600", color: "#1f2937" }}>
                Total TTC:
              </span>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "900",
                  color: "#7c3aed",
                }}
              >
                {cart.total.toLocaleString("fr-FR")} FCFA
              </span>
            </div>

            {/* Formulaire */}
            <div style={{ marginBottom: "24px" }}>
              {/* Nom */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#1f2937",
                  }}
                >
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Votre nom"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Téléphone */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#1f2937",
                  }}
                >
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+221 77 XXX XX XX"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Paiement */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#1f2937",
                  }}
                >
                  💳 Méthode de paiement *
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}
                >
                  {["Wave", "Orange Money", "Cash", "Carte"].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      style={{
                        padding: "10px",
                        border:
                          paymentMethod === method
                            ? "2px solid #7c3aed"
                            : "1px solid #e5e7eb",
                        background:
                          paymentMethod === method
                            ? "rgba(124, 58, 237, 0.1)"
                            : "#f9fafb",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "12px",
                        transition: "all 0.2s",
                      }}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Messages */}
            {errorMessage && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#dc2626",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div
                style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  color: "#15803d",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {successMessage}
              </div>
            )}

            {/* Affichage conditionnel des boutons */}
            {successMessage ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <button
                  onClick={handleContinueShopping}
                  style={{
                    padding: "14px",
                    background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(124, 58, 237, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  🛍️ Continuer achats
                </button>
                <button
                  onClick={onClose}
                  style={{
                    padding: "14px",
                    background: "#e5e7eb",
                    color: "#1f2937",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  ✕ Fermer
                </button>
              </div>
            ) : (
              /* Bouton Valider */
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: isProcessing
                    ? "#d1d5db"
                    : "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "16px",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {isProcessing ? "⏳ Traitement..." : "✅ Valider la commande"}
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}
