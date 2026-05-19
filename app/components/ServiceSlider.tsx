"use client";

import { useState, useEffect } from "react";

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: "active" | "coming-soon";
  color: string;
}

const services: Service[] = [
  {
    id: 1,
    title: "Livraison Express",
    description: "Livraison rapide en 30 minutes",
    icon: "🚗",
    status: "active",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    title: "Taxi Premium",
    description: "Transport confortable et sûr",
    icon: "🚕",
    status: "coming-soon",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: 3,
    title: "Food Delivery",
    description: "Nourriture chaude à domicile",
    icon: "🍔",
    status: "coming-soon",
    color: "from-red-500 to-red-600",
  },
  {
    id: 4,
    title: "Shopping",
    description: "Courses et shopping en ligne",
    icon: "🛍️",
    status: "coming-soon",
    color: "from-pink-500 to-pink-600",
  },
  {
    id: 5,
    title: "Cargo",
    description: "Transport de gros volumes",
    icon: "📦",
    status: "coming-soon",
    color: "from-orange-500 to-orange-600",
  },
];

export default function ServiceSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
    setIsAutoPlay(false);
  };

  const visibleServices = [];
  for (let i = 0; i < 3; i++) {
    visibleServices.push(services[(currentIndex + i) % services.length]);
  }

  return (
    <section
      style={{
        padding: "60px 20px",
        background: "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: "900",
              color: "#1f2937",
              margin: "0 0 16px 0",
              letterSpacing: "-0.5px",
            }}
          >
            Nos Services 🎯
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "#6b7280",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Découvrez nos solutions de livraison innovantes et fiables
          </p>
        </div>

        {/* Slider Container */}
        <div
          style={{
            position: "relative",
            marginBottom: "40px",
          }}
        >
          {/* Services Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "30px",
              marginBottom: "40px",
              overflow: "hidden",
            }}
          >
            {visibleServices.map((service, index) => (
              <div
                key={service.id}
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 0.1}s forwards`,
                  opacity: 0,
                }}
                onMouseEnter={() => setIsAutoPlay(false)}
                onMouseLeave={() => setIsAutoPlay(true)}
              >
                <div
                  style={{
                    background: `linear-gradient(135deg, var(--color-start) 0%, var(--color-end) 100%)`,
                    borderRadius: "20px",
                    padding: "40px 30px",
                    color: "#ffffff",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  } as React.CSSProperties & { "--color-start": string; "--color-end": string }}
                  style={{
                    background: `linear-gradient(135deg, ${service.color.split(" ")[1]} 0%, ${service.color.split(" ")[3]} 100%)`,
                    borderRadius: "20px",
                    padding: "40px 30px",
                    color: "#ffffff",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "48px",
                        marginBottom: "16px",
                      }}
                    >
                      {service.icon}
                    </div>
                    <h3
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        margin: "0 0 12px 0",
                      }}
                    >
                      {service.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        opacity: 0.95,
                        margin: "0",
                        lineHeight: "1.6",
                      }}
                    >
                      {service.description}
                    </p>
                  </div>

                  {service.status === "coming-soon" && (
                    <div
                      style={{
                        marginTop: "24px",
                        display: "inline-block",
                        background: "rgba(255, 255, 255, 0.3)",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      ⏰ Bientôt disponible
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Dots Navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlay(false);
                }}
                style={{
                  width: index === currentIndex ? "32px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  border: "none",
                  background:
                    index === currentIndex ? "#7c3aed" : "#d1d5db",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* All Services Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "20px",
          }}
        >
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                const index = services.findIndex((s) => s.id === service.id);
                setCurrentIndex(index);
                setIsAutoPlay(false);
              }}
              style={{
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: "600",
                border:
                  currentIndex % services.length ===
                  services.findIndex((s) => s.id === service.id)
                    ? "2px solid #7c3aed"
                    : "1px solid #e5e7eb",
                background:
                  currentIndex % services.length ===
                  services.findIndex((s) => s.id === service.id)
                    ? "#f3e8ff"
                    : "#ffffff",
                color: "#1f2937",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor: service.status === "coming-soon" ? "#f3f4f6" : undefined,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#7c3aed";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(124, 58, 237, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  currentIndex % services.length ===
                  services.findIndex((s) => s.id === service.id)
                    ? "#7c3aed"
                    : "#e5e7eb";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {service.icon} {service.title}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(20px);
          }
        }

        @media (max-width: 768px) {
          section {
            padding: 40px 16px;
          }
        }
      `}</style>
    </section>
  );
}
