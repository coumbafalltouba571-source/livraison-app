"use client";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
        color: "#fff",
        padding: "70px 20px 30px",
        marginTop: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* TOP */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "40px",
            marginBottom: "50px",
          }}
        >
          {/* LOGO */}
          <div>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "900",
                marginBottom: "15px",
                background:
                  "linear-gradient(135deg,#7c3aed 0%,#2563eb 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              🚚 Livraison Dakar
            </h2>

            <p
              style={{
                color: "#cbd5e1",
                lineHeight: "1.8",
                fontSize: "15px",
              }}
            >
              Plateforme moderne de livraison rapide à Dakar.
              Commandez facilement avec calcul automatique
              des prix selon les quartiers.
            </p>
          </div>

          {/* SERVICES */}
          <div>
            <h3
              style={{
                marginBottom: "20px",
                fontSize: "18px",
              }}
            >
              Services
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                color: "#cbd5e1",
              }}
            >
              <span>⚡ Livraison Express</span>
              <span>📍 GPS Dakar</span>
              <span>💬 Chat livreur</span>
              <span>📦 Suivi colis</span>
            </div>
          </div>

          {/* ENTREPRISE */}
          <div>
            <h3
              style={{
                marginBottom: "20px",
                fontSize: "18px",
              }}
            >
              Entreprise
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                color: "#cbd5e1",
              }}
            >
              <span>🏢 À propos</span>
              <span>🔒 Confidentialité</span>
              <span>📜 Conditions</span>
              <span>📞 Support</span>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3
              style={{
                marginBottom: "20px",
                fontSize: "18px",
              }}
            >
              Contact
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                color: "#cbd5e1",
              }}
            >
              <span>📱 +221 77 362 90 75</span>
              <span>📍 Dakar Sénégal</span>

              <a
                href="https://wa.me/221773629075"
                target="_blank"
                rel="noreferrer"
                style={{
                  background:
                    "linear-gradient(135deg,#7c3aed 0%,#2563eb 100%)",
                  padding: "12px 18px",
                  borderRadius: "12px",
                  color: "#fff",
                  textDecoration: "none",
                  width: "fit-content",
                  fontWeight: "700",
                }}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "25px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          <span>© 2026 Livraison Dakar - Tous droits réservés</span>

          <div
            style={{
              display: "flex",
              gap: "15px",
            }}
          >
            <span>📘</span>
            <span>📸</span>
            <span>💬</span>
            <span>🎥</span>
          </div>
        </div>
      </div>
    </footer>
  );
}