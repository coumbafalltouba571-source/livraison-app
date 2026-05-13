/**
 * Composant Hero Section - Amélioré
 * Section principale style Uber/Glovo avec image et CTA
 */

"use client";

export default function HeroSection() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      {/* Décoration de fond animée */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "600px",
          height: "600px",
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "50%",
          pointerEvents: "none",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-30%",
          left: "-5%",
          width: "400px",
          height: "400px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "50%",
          pointerEvents: "none",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      <div
        style={{
          maxWidth: "1400px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Contenu texte */}
        <div>
          <div style={{ marginBottom: "20px" }}>
            <span
              style={{
                display: "inline-block",
                background: "rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "50px",
                fontSize: "14px",
                fontWeight: "600",
                backdropFilter: "blur(10px)",
              }}
            >
              🚀 Livraison express à Dakar
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 72px)",
              fontWeight: "900",
              color: "#ffffff",
              marginBottom: "20px",
              lineHeight: "1.1",
              letterSpacing: "-1px",
            }}
          >
            Vos colis livrés en
            <br />
            <span style={{ color: "#fbbf24" }}>30 minutes</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(18px, 2vw, 22px)",
              color: "rgba(255, 255, 255, 0.95)",
              marginBottom: "40px",
              lineHeight: "1.6",
              maxWidth: "500px",
            }}
          >
            Tarifs transparents, livreurs vérifiés et suivi en temps réel. Zéro caché, 100% confiance.
          </p>

          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "50px",
            }}
          >
            <button
              style={{
                padding: "16px 36px",
                fontSize: "16px",
                fontWeight: "700",
                color: "#7c3aed",
                background: "#ffffff",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 15px 40px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(0, 0, 0, 0.2)";
              }}
            >
              Commander maintenant 🚀
            </button>

            <button
              style={{
                padding: "16px 36px",
                fontSize: "16px",
                fontWeight: "700",
                color: "#ffffff",
                background: "rgba(255, 255, 255, 0.15)",
                border: "2px solid rgba(255, 255, 255, 0.4)",
                borderRadius: "50px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Voir comment ça marche
            </button>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "30px",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "900",
                  color: "#fbbf24",
                  margin: "0",
                }}
              >
                50K+
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.8)",
                  margin: "8px 0 0 0",
                }}
              >
                Livraisons
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "900",
                  color: "#fbbf24",
                  margin: "0",
                }}
              >
                4.8★
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.8)",
                  margin: "8px 0 0 0",
                }}
              >
                Évaluation
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "900",
                  color: "#fbbf24",
                  margin: "0",
                }}
              >
                30 min
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.8)",
                  margin: "5px 0 0 0",
                }}
              >
                Délai moyen
              </p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <svg
            width="100%"
            height="500"
            viewBox="0 0 400 500"
            style={{
              maxWidth: "500px",
              filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2))",
            }}
          >
            {/* Livreur SVG moderne */}
            {/* Moto/scooter */}
            <ellipse cx="200" cy="350" rx="100" ry="30" fill="rgba(0,0,0,0.1)" />

            {/* Scooter */}
            <rect x="120" y="280" width="160" height="80" rx="20" fill="#1f2937" />
            <circle cx="160" cy="330" r="25" fill="#374151" />
            <circle cx="240" cy="330" r="25" fill="#374151" />
            <circle cx="160" cy="330" r="15" fill="#ffffff" />
            <circle cx="240" cy="330" r="15" fill="#ffffff" />

            {/* Plateau livraison */}
            <rect x="140" y="240" width="120" height="50" rx="10" fill="#3b82f6" />
            <text
              x="200"
              y="272"
              textAnchor="middle"
              fontSize="12"
              fill="white"
              fontWeight="bold"
            >
              📦
            </text>

            {/* Corps du livreur */}
            <ellipse cx="200" cy="180" rx="35" ry="50" fill="#fdbcb4" />

            {/* Tête */}
            <circle cx="200" cy="110" r="30" fill="#fdbcb4" />

            {/* Cheveux */}
            <path d="M 170 95 Q 170 60 200 60 Q 230 60 230 95" fill="#1f2937" />

            {/* Visage souriant */}
            <circle cx="190" cy="105" r="3" fill="#000000" />
            <circle cx="210" cy="105" r="3" fill="#000000" />
            <path d="M 190 120 Q 200 130 210 120" stroke="#000000" strokeWidth="2" fill="none" />

            {/* Casque de sécurité */}
            <path
              d="M 170 70 Q 170 50 200 50 Q 230 50 230 70"
              stroke="#fbbf24"
              strokeWidth="8"
              fill="none"
            />

            {/* Bras */}
            <line
              x1="170"
              y1="200"
              x2="130"
              y2="250"
              stroke="#fdbcb4"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <line
              x1="230"
              y1="200"
              x2="270"
              y2="240"
              stroke="#fdbcb4"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Jambes */}
            <line
              x1="185"
              y1="230"
              x2="170"
              y2="300"
              stroke="#1f2937"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <line
              x1="215"
              y1="230"
              x2="230"
              y2="300"
              stroke="#1f2937"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Souliers */}
            <ellipse cx="170" cy="305" rx="12" ry="8" fill="#000000" />
            <ellipse cx="230" cy="305" rx="12" ry="8" fill="#000000" />

            {/* Sac à dos */}
            <rect
              x="205"
              y="185"
              width="50"
              height="70"
              rx="8"
              fill="#ef4444"
              opacity="0.9"
            />
            <text
              x="230"
              y="230"
              textAnchor="middle"
              fontSize="32"
              fill="white"
            >
              🎯
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
