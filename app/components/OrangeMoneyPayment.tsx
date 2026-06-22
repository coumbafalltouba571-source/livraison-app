"use client";

interface OrangeMoneyPaymentProps {
  total: number;
  clientName?: string;
  clientPhone?: string;
}

export default function OrangeMoneyPayment({ 
  total, 
  clientName = "Client", 
  clientPhone = "772000000" 
}: OrangeMoneyPaymentProps) {
  // Numéro Orange Money du marchand
  const ORANGE_MONEY_NUMBER = "772000000";

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(ORANGE_MONEY_NUMBER);
    alert("✅ Numéro copié: " + ORANGE_MONEY_NUMBER);
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #ff8c00 0%, #ff6b00 100%)",
      borderRadius: "16px",
      padding: "24px",
      color: "white",
      marginTop: "16px",
      boxShadow: "0 4px 15px rgba(255, 140, 0, 0.3)",
    }}>
      <div style={{ marginBottom: "20px" }}>
        <div style={{
          fontSize: "18px",
          fontWeight: "700",
          marginBottom: "8px",
        }}>
          🟠 Orange Money
        </div>
        <p style={{
          fontSize: "14px",
          opacity: "0.9",
          margin: 0,
        }}>
          Transfert vers le marchand
        </p>
      </div>

      {/* Montant à payer */}
      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "20px",
        backdropFilter: "blur(10px)",
      }}>
        <div style={{
          fontSize: "12px",
          opacity: "0.8",
          marginBottom: "8px",
        }}>
          💰 Montant à transférer
        </div>
        <div style={{
          fontSize: "28px",
          fontWeight: "900",
        }}>
          {total.toLocaleString("fr-FR")} FCFA
        </div>
      </div>

      {/* Numéro à appeler */}
      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "20px",
        backdropFilter: "blur(10px)",
      }}>
        <div style={{
          fontSize: "12px",
          opacity: "0.8",
          marginBottom: "8px",
        }}>
          📞 Numéro du marchand
        </div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{
            fontSize: "24px",
            fontWeight: "700",
            fontFamily: "monospace",
            letterSpacing: "2px",
          }}>
            {ORANGE_MONEY_NUMBER}
          </div>
          <button
            onClick={handleCopyNumber}
            style={{
              padding: "8px 16px",
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            }}
          >
            📋 Copier
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "20px",
        backdropFilter: "blur(10px)",
      }}>
        <div style={{
          fontSize: "12px",
          fontWeight: "600",
          marginBottom: "12px",
        }}>
          📝 Instructions de paiement
        </div>
        <ol style={{
          fontSize: "12px",
          opacity: "0.9",
          margin: 0,
          paddingLeft: "20px",
          lineHeight: "1.8",
        }}>
          <li>Ouvrez Orange Money sur votre téléphone</li>
          <li>Sélectionnez "Envoyer de l'argent"</li>
          <li>Entrez le numéro: <strong>{ORANGE_MONEY_NUMBER}</strong></li>
          <li>Entrez le montant: <strong>{total.toLocaleString("fr-FR")} FCFA</strong></li>
          <li>Validez la transaction</li>
          <li>Vous recevrez une confirmation par SMS</li>
        </ol>
      </div>

      {/* Confirmation */}
      <div style={{
        fontSize: "12px",
        opacity: "0.8",
        textAlign: "center",
        padding: "12px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        backdropFilter: "blur(10px)",
      }}>
        ✓ Paiement sécurisé | ✓ Confirmation immédiate par SMS
      </div>
    </div>
  );
}
