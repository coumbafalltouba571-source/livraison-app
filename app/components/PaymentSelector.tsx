"use client";

interface PaymentSelectorProps {
  value: string;
  onChange: (method: string) => void;
}

export default function PaymentSelector({ value, onChange }: PaymentSelectorProps) {
  const paymentMethods = [
    {
      id: "livraison",
      name: "💵 Paiement à la livraison",
      description: "Payez directement au livreur",
      color: "#10b981",
    },
    {
      id: "wave",
      name: "〰️ Wave",
      description: "Paiement mobile sécurisé",
      color: "#3b82f6",
    },
    {
      id: "orange",
      name: "🟠 Orange Money",
      description: "Transfert Orange Money",
      color: "#ff8c00",
    },
  ];

  return (
    <div style={{ marginBottom: "24px" }}>
      <label style={{
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: "12px",
      }}>
        💳 Mode de paiement (obligatoire)
      </label>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "12px",
      }}>
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onChange(method.id)}
            style={{
              padding: "16px",
              border: value === method.id ? `3px solid ${method.color}` : "2px solid #e5e7eb",
              borderRadius: "12px",
              background: value === method.id ? `${method.color}15` : "#f9fafb",
              cursor: "pointer",
              transition: "all 0.2s",
              textAlign: "left",
              fontSize: "14px",
              fontWeight: "600",
              color: "#1f2937",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (value !== method.id) {
                e.currentTarget.style.borderColor = method.color;
                e.currentTarget.style.background = `${method.color}08`;
              }
            }}
            onMouseLeave={(e) => {
              if (value !== method.id) {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.background = "#f9fafb";
              }
            }}
          >
            <div style={{ marginBottom: "4px" }}>{method.name}</div>
            <div style={{
              fontSize: "12px",
              color: "#6b7280",
              fontWeight: "400",
            }}>
              {method.description}
            </div>
            {value === method.id && (
              <div style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                width: "20px",
                height: "20px",
                background: method.color,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
              }}>
                ✓
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
