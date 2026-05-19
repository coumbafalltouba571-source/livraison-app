"use client";

import { useState } from "react";

interface HeroSectionProps {
  onCommandClick?: () => void;
}

export default function HeroSection({ onCommandClick }: HeroSectionProps) {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      {/* Logo en haut à droite */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#ffffff",
            fontWeight: "900",
            fontSize: "24px",
            letterSpacing: "-1px",
          }}
        >
          <span style={{ fontSize: "32px" }}>📦</span>
          <span>Livraison</span>
        </div>
      </div>

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
        <div style={{ animation: "slideInLeft 0.8s ease" }}>
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
              onClick={onCommandClick}
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

        {/* Illustration - Livreur SVG */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            animation: "slideInRight 0.8s ease",
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
            {/* Ombre au sol */}
            <ellipse cx="200" cy="420" rx="120" ry="25" fill="rgba(0,0,0,0.1)" />

            {/* Scooter */}
            <g>
              {/* Base */}
              <rect x="100" y="300" width="200" height="80" rx="20" fill="#1f2937" />
              {/* Roues */}
              <circle cx="160" cy="360" r="25" fill="#374151" />
              <circle cx="240" cy="360" r="25" fill="#374151" />
              {/* Jantes */}
              <circle cx="160" cy="360" r="15" fill="#fbbf24" />
              <circle cx="240" cy="360" r="15" fill="#fbbf24" />
            </g>

            {/* Plateau livraison */}
            <g>
              <rect x="130" y="260" width="140" height="50" rx="10" fill="#3b82f6" />
              <rect x="140" y="270" width="30" height="30" rx="5" fill="#ffffff" opacity="0.3" />
              <rect x="180" y="270" width="30" height="30" rx="5" fill="#ffffff" opacity="0.3" />
              <rect x="220" y="270" width="30" height="30" rx="5" fill="#ffffff" opacity="0.3" />
            </g>

            {/* Livreur */}
            <g>
              {/* Corps */}
              <ellipse cx="200" cy="200" rx="35" ry="55" fill="#ef4444" />

              {/* Tête */}
              <circle cx="200" cy="120" r="32" fill="#fdbcb4" />

              {/* Cheveux */}
              <path d="M 168 105 Q 168 65 200 65 Q 232 65 232 105" fill="#1f2937" />

              {/* Visage */}
              <circle cx="190" cy="115" r="4" fill="#000000" />
              <circle cx="210" cy="115" r="4" fill="#000000" />
              <path d="M 190 135 Q 200 145 210 135" stroke="#000000" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Casque */}
              <path
                d="M 168 80 Q 168 55 200 55 Q 232 55 232 80"
                stroke="#fbbf24"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />

              {/* Bras gauche */}
              <line x1="170" y1="215" x2="120" y2="270" stroke="#fdbcb4" strokeWidth="14" strokeLinecap="round" />

              {/* Bras droit */}
              <line x1="230" y1="215" x2="280" y2="260" stroke="#fdbcb4" strokeWidth="14" strokeLinecap="round" />

              {/* Jambes */}
              <line x1="185" y1="255" x2="160" y2="320" stroke="#1f2937" strokeWidth="14" strokeLinecap="round" />
              <line x1="215" y1="255" x2="240" y2="320" stroke="#1f2937" strokeWidth="14" strokeLinecap="round" />

              {/* Souliers */}
              <ellipse cx="160" cy="325" rx="15" ry="10" fill="#000000" />
              <ellipse cx="240" cy="325" rx="15" ry="10" fill="#000000" />

              {/* Sac à dos */}
              <rect x="210" y="185" width="50" height="60" rx="8" fill="#7c3aed" opacity="0.8" />
              <text x="235" y="225" textAnchor="middle" fontSize="24" fill="#ffffff">
                📦
              </text>
            </g>

            {/* Vitesse animations */}
            <g opacity="0.6">
              <line x1="50" y1="100" x2="80" y2="90" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
              <line x1="30" y1="130" x2="60" y2="130" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
              <line x1="50" y1="160" x2="80" y2="170" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(20px);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 768px) {
          section {
            padding: 40px 20px;
          }

          div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }

          svg {
            max-width: 300px !important;
          }
        }
      `}</style>
    </section>
  );
}
