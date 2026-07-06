"use client";

import { useState } from "react";
import {
  CartState,
  DEFAULT_PRODUCTS,
  Product,
  addToCart,
  clearCart,
  removeFromCart,
  updateQuantity,
} from "@/app/utils/shop";
import { createCommand } from "@/app/utils/firestoreCommands";
import PaymentSelector from "./PaymentSelector";
import WavePayment from "./WavePayment";
import OrangeMoneyPayment from "./OrangeMoneyPayment";
import NotificationToast from "./NotificationToast";
import { getAdminWhatsAppUrl } from "@/app/utils/commandUtils";

interface ShoppingCartProps {
  cart: CartState;
  onUpdateCart: (newCart: CartState) => void;
  onClose: () => void;
}

const isValidProductImage = (image?: string): image is string =>
  !!image && (image.startsWith("/") || image.startsWith("http://") || image.startsWith("https://"));

const getProductImage = (productId: string, productImage?: string) => {
  if (isValidProductImage(productImage)) {
    return productImage;
  }

  const defaultProductImage = DEFAULT_PRODUCTS.find((product) => product.id === productId)?.image;
  if (isValidProductImage(defaultProductImage)) {
    return defaultProductImage;
  }

  return "";
};

export default function ShoppingCart({
  cart,
  onUpdateCart,
  onClose,
}: ShoppingCartProps) {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [processingMessage, setProcessingMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleRemoveItem = (productId: string) => {
    const newCart = removeFromCart(cart, productId);
    onUpdateCart(newCart);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const newCart = updateQuantity(cart, productId, quantity);
    onUpdateCart(newCart);
  };

  const handleClearCart = () => {
    onUpdateCart(clearCart());
  };

  const handleAddSuggestion = (product: Product) => {
    const newCart = addToCart(cart, product, 1);
    onUpdateCart(newCart);
  };

  const cartProductIds = cart.items.map((item) => item.product.id);
  const cartCategories = Array.from(
    new Set(cart.items.flatMap((item) => (item.product.category ? [item.product.category] : [])))
  );

  const recommendedProducts = DEFAULT_PRODUCTS.filter(
    (product) => !cartProductIds.includes(product.id) && (product.stock ?? 1) > 0
  )
    .sort((a, b) => {
      const aCategoryMatch = cartCategories.includes(a.category ?? "");
      const bCategoryMatch = cartCategories.includes(b.category ?? "");
      if (aCategoryMatch !== bCategoryMatch) return aCategoryMatch ? -1 : 1;
      return (b.rating || 0) - (a.rating || 0);
    })
    .slice(0, 3);

  const handleCheckout = async () => {
    if (!clientName.trim() || !clientPhone.trim() || !clientAddress.trim() || !paymentMethod) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");
    setSuccessMessage("");
    setProcessingMessage("⏳ Création de votre commande en cours...");

    console.log("🛒 === DÉBUT VALIDATION COMMANDE ===");
    console.log("📋 Données client:", { clientName, clientPhone, clientAddress, paymentMethod });

    // Timeout de sécurité augmenté à 30 secondes (Firestore peut être lent)
    const timeoutId = setTimeout(() => {
      setIsProcessing(false);
      setProcessingMessage("");
      console.error("❌ TIMEOUT: Firestore n'a pas répondu après 30 secondes");
      setErrorMessage("⏱️ TIMEOUT (30s). Possible causes:\n   1. Clé API Firebase FAUSSE (vérifiez .env.local - ne doit pas avoir 'xxx')\n   2. Connexion Internet lente\n   3. Serveur Firestore indisponible\n→ Vérifiez la console (F12) pour les erreurs détaillées");
    }, 30000);

    try {
      // Créer description détaillée à partir des produits
      const description = cart.items
        .map((item) => `${item.quantity}x ${item.product.name}`)
        .join(", ");
      const orderItems = cart.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: getProductImage(item.product.id, item.product.image),
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
      }));
      const productIds = orderItems.map((item) => item.productId).join(",");
      const productNames = orderItems.map((item) => item.productName).join(", ");
      const productImage = orderItems[0]?.productImage || "";
      const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);

      console.log("📦 Tentative d'enregistrement dans Firestore...");
      console.log("📄 Description produits:", description);
      console.log("💰 Total:", cart.total, "FCFA");

      // Créer la commande dans Firestore
      let commandResult: string;
      try {
        // Déterminer le statut du paiement selon le mode
        let paymentStatus: "En attente" | "Confirmé" | "À payer à la livraison" | "Annulé" = "En attente";
        if (paymentMethod === "livraison") {
          paymentStatus = "À payer à la livraison";
        }

        commandResult = await createCommand({
          telephone: clientPhone,
          phone: clientPhone,
          client: clientName,
          nomClient: clientName,
          customerName: clientName,
          depart: "Boutique",
          destination: clientAddress.trim(),
          description: `Achat boutique: ${description}`,
          prix: cart.total,
          total: cart.total,
          modePayement: paymentMethod,
          paymentMethod,
          paymentStatus: paymentStatus,
          statut: "en attente",
          status: "en attente",
          productId: productIds,
          productName: productNames,
          productImage,
          quantity: totalQuantity,
          price: orderItems[0]?.price || cart.total,
          address: clientAddress.trim(),
          orderItems,
          dateLivraison: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        console.log("✅ createCommand() retourné avec succès");
        console.log("📌 ID Commande Firestore:", commandResult);
      } catch (firebaseError) {
        console.error("❌ ERREUR FIRESTORE:", firebaseError);
        const fbMessage = firebaseError instanceof Error ? firebaseError.message : String(firebaseError);
        throw new Error(`Firestore Error: ${fbMessage}`);
      }

      if (!commandResult || commandResult.trim() === "") {
        console.error("❌ createCommand() retourné vide ou null");
        throw new Error("Firestore n'a pas retourné d'ID de commande valide");
      }

      console.log("🎯 Commande enregistrée avec ID:", commandResult);
      clearTimeout(timeoutId);

      try {
        const orderForWa = {
          id: commandResult,
          client: clientName,
          telephone: clientPhone,
          depart: "Boutique",
          destination: clientAddress.trim(),
          address: clientAddress.trim(),
          productName: productNames,
          orderItems,
          prix: cart.total,
          total: cart.total,
          paymentMethod,
          statut: "en attente",
        } as any;
        const waUrl = getAdminWhatsAppUrl(orderForWa);
        if (typeof window !== "undefined") window.open(waUrl, "_blank");
      } catch (err) {
        console.warn("Could not open WhatsApp:", err);
      }

      // Marquer succès IMMÉDIATEMENT (avant WhatsApp)
      console.log("✅ Affichage message succès");
      setSuccessMessage("✅ Commande enregistrée avec succès!");
      setProcessingMessage("");
      setIsProcessing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);

      console.log("📲 Notification et WhatsApp déclenchés via la création de commande...");

      console.log("🔄 Fermeture du modal et vidage du panier dans 1.2s...");

      // Fermer le modal après 1.2 secondes
      setTimeout(() => {
        onUpdateCart({ items: [], total: 0 });
        setClientName("");
        setClientPhone("");
        setClientAddress("");
        setPaymentMethod("");
        setSuccessMessage("");
        console.log("🎉 === FIN VALIDATION COMMANDE - SUCCÈS ===");
        onClose();
      }, 1200);

    } catch (error) {
      clearTimeout(timeoutId);
      console.error("❌ === ERREUR VALIDATION COMMANDE ===");
      console.error("Erreur complète:", error);

      const errorDetails = error as { code?: string };
      const errorCode = errorDetails?.code;
      let errorMsg = "Erreur lors de la création de la commande";
      
      if (error instanceof Error) {
        console.error("Message d'erreur:", error.message);
        console.error("Code d'erreur:", errorCode);
        console.error("Stack trace:", error.stack);
        errorMsg = error.message;
        
        // Améliorations pour les erreurs spécifiques
        if (errorCode === "permission-denied") {
          errorMsg = `❌ ERREUR PERMISSION\nRègles Firestore invalides.\n→ Allez à Firebase Console → Firestore → Règles\n→ Remplacez par: allow read, write: if true;`;
        } else if (errorCode === "unauthenticated") {
          errorMsg = `❌ ERREUR: Configuration Firebase invalide.\nClé API est FAUSSE ou MANQUANTE dans .env.local`;
        } else if (error.message.includes("Failed to initialize") || 
                   error.message.includes("Could not initialize")) {
          errorMsg = `❌ ERREUR FIRESTORE\nVotre clé API dans .env.local est FAUSSE\n- Doit commencer par AIzaSy mais PAS contenir 'xxx'\n- Consultez la console (F12) pour plus de détails`;
        }
      }

      setErrorMessage(errorMsg);
      setProcessingMessage("");
      setSuccessMessage("");
      setIsProcessing(false);
      console.log("🛒 === FIN VALIDATION COMMANDE - ERREUR ===");
    }
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

      <NotificationToast visible={showToast} onClose={() => setShowToast(false)} />

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
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "900",
                  color: "#1f2937",
                  margin: 0,
                }}
              >
                Panier amélioré
              </h2>
              <p style={{ color: "#6b7280", margin: "8px 0 0", fontSize: "14px" }}>
                {cart.items.length} article{cart.items.length !== 1 ? "s" : ""} • Total automatique
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={handleClearCart}
                style={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  background: "#f8fafc",
                  color: "#111827",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                🧹 Vider le panier
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "1px solid transparent",
                  background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                Fermer
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "16px",
                padding: "18px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px", fontWeight: "700" }}>
                Articles
              </div>
              <div style={{ fontSize: "26px", fontWeight: "900", color: "#1f2937" }}>
                {cart.items.length}
              </div>
            </div>
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "16px",
                padding: "18px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px", fontWeight: "700" }}>
                Total estimé
              </div>
              <div style={{ fontSize: "26px", fontWeight: "900", color: "#7c3aed" }}>
                {cart.total.toLocaleString("fr-FR")} FCFA
              </div>
            </div>
          </div>
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

            {/* Produits recommandés */}
            {recommendedProducts.length > 0 && (
              <div
                style={{
                  marginBottom: "24px",
                  padding: "20px",
                  borderRadius: "18px",
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "800",
                    color: "#1f2937",
                    marginBottom: "14px",
                  }}
                >
                  Suggestions pour compléter votre panier
                </div>
                <div style={{ display: "grid", gap: "14px" }}>
                  {recommendedProducts.map((product) => (
                    <div
                      key={product.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "700", color: "#111827" }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: "13px", color: "#6b7280" }}>
                          {product.price.toLocaleString("fr-FR")} FCFA • {product.rating?.toFixed(1) || "0.0"} ⭐
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddSuggestion(product)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "10px",
                          border: "none",
                          background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                          color: "#ffffff",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        Ajouter
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

              {/* Adresse */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#1f2937",
                  }}
                >
                  📍 Adresse de livraison *
                </label>
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Ex : Keur Massar Unité 5"
                  required
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
              <div style={{ marginBottom: "24px" }}>
                <PaymentSelector
                  value={paymentMethod}
                  onChange={(method) => setPaymentMethod(method)}
                />
              </div>

              {/* Affichage Wave si sélectionné */}
              {paymentMethod === "wave" && (
                <WavePayment
                  total={cart.total}
                  onPaymentClick={() => {
                    console.log("Redirection Wave effectuée");
                  }}
                />
              )}

              {/* Affichage Orange Money si sélectionné */}
              {paymentMethod === "orange" && (
                <OrangeMoneyPayment
                  total={cart.total}
                />
              )}

              {/* Rappel paiement à la livraison */}
              {paymentMethod === "livraison" && (
                <div style={{
                  background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "24px",
                  fontSize: "14px",
                  color: "#15803d",
                  fontWeight: "600",
                }}>
                  💵 Vous paierez {cart.total.toLocaleString("fr-FR")} FCFA au livreur à la réception
                </div>
              )}
            </div>

            {/* Messages */}
            {processingMessage && (
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
                  color: "#1d4ed8",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "14px",
                  fontWeight: "600",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  textAlign: "center",
                  animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              >
                {processingMessage}
              </div>
            )}

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
                  background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
                  color: "#15803d",
                  padding: "16px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "15px",
                  fontWeight: "700",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                  textAlign: "center",
                }}
              >
                ✅ {successMessage}
              </div>
            )}

            {/* Bouton Valider - Uniquement si pas de succès */}
            {!successMessage && (
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
