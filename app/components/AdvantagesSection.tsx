/**
 * Composant Avantages - Amélioré
 * Affiche les avantages compétitifs avec design moderne
 */

export default function AdvantagesSection() {
  const avantages = [
    {
      titre: "Plus rapide que la concurrence",
      description: "30 minutes maximum, garantis. Sinon, livraison gratuite!",
      icon: "⚡",
      color: "#7c3aed",
    },
    {
      titre: "Meilleurs tarifs",
      description:
        "Tarification claire et compétitive. De 1000 à 6000 FCFA selon la distance.",
      icon: "💰",
      color: "#2563eb",
    },
    {
      titre: "Assurance complète",
      description:
        "Tous nos colis sont assurés. Perte ou dégât? Remboursement complet.",
      icon: "🛡️",
      color: "#7c3aed",
    },
    {
      titre: "Service 24/7",
      description:
        "Commandez n'importe quand, recevez rapidement, support toujours disponible.",
      icon: "⭐",
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
            Pourquoi choisir nous?
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
            Les meilleures raisons de livrer avec nous
          </p>
        </div>

        {/* Grille d'avantages */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "40px",
            marginBottom: "80px",
          }}
        >
          {avantages.map((avantage, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  minWidth: "70px",
                  height: "70px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${avantage.color}15`,
                  borderRadius: "16px",
                }}
              >
                {avantage.icon}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#0f172a",
                    margin: "0 0 10px 0",
                  }}
                >
                  {avantage.titre}
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    color: "#64748b",
                    margin: "0",
                    lineHeight: "1.6",
                  }}
                >
                  {avantage.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Section CTA */}
        <div
          style={{
            padding: "60px 40px",
            background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
            borderRadius: "24px",
            textAlign: "center",
            color: "#ffffff",
            boxShadow: "0 20px 50px rgba(124, 58, 237, 0.3)",
          }}
        >
          <h3
            style={{
              fontSize: "clamp(24px, 3vw, 40px)",
              fontWeight: "900",
              margin: "0 0 15px 0",
              letterSpacing: "-0.5px",
            }}
          >
            Rejoignez 50,000+ clients satisfaits
          </h3>
          <p
            style={{
              fontSize: "18px",
              margin: "0 0 35px 0",
              opacity: 0.95,
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Une livraison fiable, rapide et transparente - c'est notre promesse
          </p>
          <button
            style={{
              padding: "16px 40px",
              fontSize: "16px",
              fontWeight: "700",
              color: "#7c3aed",
              background: "#ffffff",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 15px 40px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(0, 0, 0, 0.1)";
            }}
          >
            Commander maintenant 🚀
          </button>
        </div>
      </div>
    </section>
  );
}
