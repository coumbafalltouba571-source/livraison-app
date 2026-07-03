"use client";

interface WavePaymentProps {
  total: number;
  clientName?: string;
  onPaymentClick?: () => void;
}

export default function WavePayment({ total, clientName = "Client", onPaymentClick }: WavePaymentProps) {
  const handleWavePayment = () => {
    try {
      if (onPaymentClick) {
        onPaymentClick();
      }
      window.open("https://pay.wave.com/m/M_sn_htOGspNwdyAY/c/sn/", "_blank", "noopener,noreferrer");
      console.log("📲 Redirection vers Wave effectuée");
    } catch (error) {
      console.error("❌ Erreur lors de la redirection Wave:", error);
    }
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      borderRadius: "16px",
      padding: "24px",
      color: "white",
      marginTop: "16px",
      boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
    }}>
      <div style={{ marginBottom: "16px" }}>
        <div style={{
          fontSize: "18px",
          fontWeight: "700",
          marginBottom: "8px",
        }}>
          〰️ Paiement Wave
        </div>
        <p style={{
          fontSize: "14px",
          opacity: "0.9",
          margin: 0,
        }}>
          Fonctionnalité de paiement bientôt disponible. Le parcours reste prêt pour l&apos;intégration future.
        </p>
      </div>

      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
        backdropFilter: "blur(10px)",
      }}>
        <div style={{
          fontSize: "12px",
          opacity: "0.8",
          marginBottom: "8px",
        }}>
          Montant à payer
        </div>
        <div style={{
          fontSize: "28px",
          fontWeight: "900",
        }}>
          {total.toLocaleString("fr-FR")} FCFA
        </div>
      </div>

      <button
        onClick={handleWavePayment}
        style={{
          width: "100%",
          padding: "16px",
          background: "rgba(255, 255, 255, 0.2)",
          border: "2px solid rgba(255, 255, 255, 0.4)",
          borderRadius: "12px",
          color: "white",
          fontSize: "16px",
          fontWeight: "700",
          cursor: "pointer",
          transition: "all 0.3s",
          backdropFilter: "blur(10px)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        💳 Payer avec Wave
      </button>

      <div style={{
        fontSize: "12px",
        opacity: "0.7",
        marginTop: "12px",
        textAlign: "center",
      }}>
        ✓ Intégration préparée | ✓ Prêt pour une activation rapide
      </div>
    </div>
  );
}
