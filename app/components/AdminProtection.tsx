"use client";

import { useState } from "react";

interface AdminProtectionProps {
  onUnlock: () => void;
}

const ADMIN_CODE = "8080"; // Code admin simple

export default function AdminProtection({ onUnlock }: AdminProtectionProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      setIsLocked(false);
      onUnlock();
      // Sauvegarder dans sessionStorage pour cette session
      if (typeof window !== "undefined") {
        sessionStorage.setItem("adminAccess", "true");
      }
    } else {
      setError("❌ Code admin incorrect");
      setCode("");
    }
  };

  // Vérifier si déjà déverrouillé dans cette session
  if (typeof window !== "undefined" && sessionStorage.getItem("adminAccess") === "true") {
    return null;
  }

  if (!isLocked) {
    return null;
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.95)",
      backdropFilter: "blur(4px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
        borderRadius: "24px",
        padding: "60px 40px",
        maxWidth: "500px",
        width: "90%",
        border: "2px solid #7c3aed",
        boxShadow: "0 20px 60px rgba(124, 58, 237, 0.3)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            fontSize: "64px",
            marginBottom: "16px",
          }}>🔐</div>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "900",
            color: "#ffffff",
            margin: 0,
            marginBottom: "8px",
          }}>
            Accès Admin
          </h1>
          <p style={{
            color: "#9ca3af",
            fontSize: "14px",
            margin: 0,
          }}>
            Entrez le code d&apos;accès administrateur
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              placeholder="Entrez le code"
              autoFocus
              style={{
                width: "100%",
                padding: "16px 20px",
                fontSize: "18px",
                letterSpacing: "0.2em",
                border: "2px solid #7c3aed",
                borderRadius: "12px",
                background: "#0f172a",
                color: "#ffffff",
                boxSizing: "border-box",
                textAlign: "center",
                transition: "all 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124, 58, 237, 0.3)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "#fca5a5",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              textAlign: "center",
              fontWeight: "600",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "16px 20px",
              fontSize: "16px",
              fontWeight: "700",
              color: "#ffffff",
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(124, 58, 237, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            🔓 Déverrouiller
          </button>
        </form>

        <p style={{
          color: "#6b7280",
          fontSize: "12px",
          textAlign: "center",
          margin: 0,
        }}>
          Seuls les administrateurs peuvent accéder à cette page
        </p>
      </div>
    </div>
  );
}
