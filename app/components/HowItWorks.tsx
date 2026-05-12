/**
 * Composant Comment Ça Marche - Amélioré
 * Explique le processus en 4 étapes avec design moderne
 */

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      titre: "Entrez vos infos",
      description: "Téléphone, lieu de départ et destination",
      icon: "📝",
    },
    {
      number: "2",
      titre: "Tarif automatique",
      description: "Le prix s'affiche en temps réel",
      icon: "💰",
    },
    {
      number: "3",
      titre: "Confirmez",
      description: "Validez votre commande par WhatsApp",
      icon: "✅",
    },
    {
      number: "4",
      titre: "Livré!",
      description: "Votre colis arrive rapidement",
      icon: "🎉",
    },
  ];

  return (
    <section
      style={{
        padding: "120px 20px",
        background: "#ffffff",
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
            Comment ça marche?
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
            4 étapes simples pour livrer votre colis
          </p>
        </div>

        {/* Étapes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "30px",
            position: "relative",
            marginBottom: "60px",
          }}
        >
          {/* Ligne de connexion (desktop) */}
          <svg
            style={{
              position: "absolute",
              top: "50px",
              left: "0",
              right: "0",
              height: "2px",
              display: window.innerWidth > 1024 ? "block" : "none",
              zIndex: 0,
            }}
          >
            <line
              x1="0"
              y1="1"
              x2="100%"
              y2="1"
              stroke="#e2e8f0"
              strokeWidth="2"
            />
          </svg>

          {steps.map((step, idx) => (
            <div key={idx} style={{ position: "relative", zIndex: 1 }}>
              <div style={{ textAlign: "center" }}>
                {/* Numéro cercle gradient */}
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 25px",
                    color: "#ffffff",
                    fontSize: "36px",
                    fontWeight: "900",
                    boxShadow: "0 15px 35px rgba(124, 58, 237, 0.3)",
                    position: "relative",
                    border: "4px solid #ffffff",
                  }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div style={{ fontSize: "32px", marginBottom: "15px" }}>
                  {step.icon}
                </div>

                {/* Contenu */}
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#0f172a",
                    margin: "0 0 10px 0",
                  }}
                >
                  {step.titre}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    margin: "0",
                    lineHeight: "1.6",
                  }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <button
            style={{
              padding: "16px 40px",
              fontSize: "16px",
              fontWeight: "700",
              color: "#ffffff",
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 10px 30px rgba(124, 58, 237, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 15px 40px rgba(124, 58, 237, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(124, 58, 237, 0.3)";
            }}
          >
            Commander maintenant 🚀
          </button>
        </div>
      </div>
    </section>
  );
}
