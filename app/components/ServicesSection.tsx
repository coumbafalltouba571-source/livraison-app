/**
 * Composant Services Section - Amélioré
 * Affiche les services principaux avec design moderne
 */

"use client";

export default function ServicesSection() {
  const services = [
    {
      icon: "⚡",
      titre: "Ultra rapide",
      description: "Livraison en 30 minutes maximum dans toute Dakar",
      color: "#7c3aed",
    },
    {
      icon: "💰",
      titre: "Tarifs transparents",
      description: "Pas de frais cachés. Tarif fixe calculé automatiquement",
      color: "#2563eb",
    },
    {
      icon: "🔒",
      titre: "Sécurisé",
      description: "Tous nos livreurs vérifiés et assurés",
      color: "#7c3aed",
    },
    {
      icon: "📍",
      titre: "Suivi en temps réel",
      description: "Suivez votre colis du départ à l'arrivée",
      color: "#2563eb",
    },
    {
      icon: "💳",
      titre: "Paiement flexible",
      description: "Wave, Orange Money, et cash acceptés",
      color: "#7c3aed",
    },
    {
      icon: "🎯",
      titre: "Précision garantie",
      description: "Livraison à l'adresse exacte, ou remboursé",
      color: "#2563eb",
    },
  ];

  return (
    <section
      style={{
        padding: "120px 20px",
        background: "#f8fafc",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* En-tête */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 56px)",
              fontWeight: "900",
              color: "#0f172a",
              margin: "0 0 15px 0",
              letterSpacing: "-1px",
            }}
          >
            Nos services premium
          </h2>
          <div
            style={{
              width: "60px",
              height: "4px",
              background: "linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)",
              margin: "20px auto 20px",
              borderRadius: "2px",
            }}
          />
          <p
            style={{
              fontSize: "18px",
              color: "#475569",
              margin: "0",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Tout ce dont vous avez besoin pour une livraison sans souci
          </p>
        </div>

        {/* Grille de services */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px",
          }}
        >
          {services.map((service, idx) => (
            <div
              key={idx}
              style={{
                padding: "40px 30px",
                background: "#ffffff",
                borderRadius: "20px",
                border: "2px solid #e2e8f0",
                transition: "all 0.3s ease",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(-8px)";
                el.style.border = `2px solid ${service.color}`;
                el.style.boxShadow =
                  `0 25px 50px ${service.color}20`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(0)";
                el.style.border = "2px solid #e2e8f0";
                el.style.boxShadow = "none";
              }}
            >
              {/* Fond gradient subtil */}
              <div
                style={{
                  position: "absolute",
                  top: "-50%",
                  right: "-50%",
                  width: "200px",
                  height: "200px",
                  background: `${service.color}15`,
                  borderRadius: "50%",
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "20px",
                    display: "inline-block",
                    padding: "12px 16px",
                    background: `${service.color}15`,
                    borderRadius: "12px",
                  }}
                >
                  {service.icon}
                </div>

                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#0f172a",
                    margin: "20px 0 12px 0",
                  }}
                >
                  {service.titre}
                </h3>

                <p
                  style={{
                    fontSize: "15px",
                    color: "#64748b",
                    margin: "0",
                    lineHeight: "1.6",
                  }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
