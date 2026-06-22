"use client";

import { useState } from "react";
import { QUARTIERS_DAKAR, calculerDistance, calculerTarifParDistance } from "@/app/utils/tarifs";

interface QuartierSelectorProps {
  label: string;
  value: string;
  onChange: (quartier: string) => void;
  onDistanceChange?: (distance: number) => void;
  onTarifChange?: (tarif: number) => void;
  otherQuartier?: string; // Le quartier sélectionné de l'autre côté pour calculer distance
  showDistance?: boolean;
  showPrice?: boolean;
}

export default function QuartierSelector({
  label,
  value,
  onChange,
  onDistanceChange,
  onTarifChange,
  otherQuartier,
  showDistance = false,
  showPrice = false,
}: QuartierSelectorProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredQuartiers = search.trim()
    ? QUARTIERS_DAKAR.filter((q) =>
        q.toLowerCase().includes(search.toLowerCase())
      )
    : QUARTIERS_DAKAR;

  const handleSelect = (quartier: string) => {
    onChange(quartier);
    setSearch("");
    setIsOpen(false);

    // Calculer distance et tarif si l'autre quartier est disponible
    if (otherQuartier) {
      const distance = calculerDistance(quartier, otherQuartier);
      const tarif = calculerTarifParDistance(distance);

      if (onDistanceChange) onDistanceChange(distance);
      if (onTarifChange) onTarifChange(tarif);
    }
  };

  // Calculer distance et tarif au changement du quartier sélectionné
  const distance = value && otherQuartier ? calculerDistance(value, otherQuartier) : 0;
  const tarif = distance > 0 ? calculerTarifParDistance(distance) : 0;

  return (
    <div style={{ marginBottom: "16px", position: "relative" }}>
      <label style={{
        display: "block",
        fontSize: "13px",
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: "8px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}>
        {label}
      </label>

      {/* Input avec recherche */}
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder={value || "Sélectionner..."}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "2px solid #e5e7eb",
            borderRadius: "10px",
            fontSize: "14px",
            boxSizing: "border-box",
            outline: "none",
            transition: "all 0.2s",
            background: "#ffffff",
            cursor: "pointer",
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false);
          }}
        />

        {/* Dropdown */}
        {isOpen && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#ffffff",
            border: "2px solid #e5e7eb",
            borderTop: "none",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            maxHeight: "300px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}>
            {filteredQuartiers.length > 0 ? (
              filteredQuartiers.map((quartier) => (
                <button
                  key={quartier}
                  onClick={() => handleSelect(quartier)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    background: value === quartier ? "#f0f0f0" : "transparent",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#1f2937",
                    transition: "background 0.2s",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = value === quartier ? "#f0f0f0" : "transparent";
                  }}
                >
                  {quartier}
                </button>
              ))
            ) : (
              <div style={{
                padding: "16px",
                textAlign: "center",
                color: "#9ca3af",
                fontSize: "14px",
              }}>
                Aucun quartier trouvé
              </div>
            )}
          </div>
        )}
      </div>

      {/* Affichage distance et tarif */}
      {(showDistance || showPrice) && value && otherQuartier && (
        <div style={{
          marginTop: "12px",
          padding: "12px",
          background: "#f0f9ff",
          borderRadius: "8px",
          border: "1px solid #bfdbfe",
          fontSize: "13px",
          color: "#1e40af",
          fontWeight: "600",
        }}>
          {showDistance && (
            <div style={{ marginBottom: showPrice ? "4px" : "0" }}>
              📍 Distance: {distance.toFixed(1)} km
            </div>
          )}
          {showPrice && (
            <div>
              💰 Tarif: {tarif.toLocaleString("fr-FR")} FCFA
            </div>
          )}
        </div>
      )}
    </div>
  );
}
