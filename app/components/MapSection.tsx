"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Configure Leaflet default markers
const DefaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.setIcon(DefaultIcon);

const quartiers = {
  Plateau: [14.6708, -17.4381],
  Médina: [14.6833, -17.4500],
  Parcelles: [14.7560, -17.4480],
  Almadies: [14.7368, -17.5110],
  Ouakam: [14.7247, -17.4906],
  Pikine: [14.7645, -17.3900],
  KeurMassar: [14.7860, -17.3113],
  GrandYoff: [14.7392, -17.4576],
  Yoff: [14.7470, -17.4900],
  Mermoz: [14.7062, -17.4758],
  SacreCoeur: [14.7285, -17.4638],
  Liberté6: [14.7448, -17.4549],
  HLM: [14.6951, -17.4467],
  Hann: [14.7217, -17.4294],
  Rufisque: [14.7158, -17.2733],
  Guediawaye: [14.7761, -17.3956],
  Diamniadio: [14.7300, -17.2000],
  Ngor: [14.7449, -17.5150],
  Fann: [14.6937, -17.4677],
  Cambérène: [14.7640, -17.4480],
};

function calculDistance(point1: number[], point2: number[]) {
  const dx = point1[0] - point2[0];
  const dy = point1[1] - point2[1];

  return (Math.sqrt(dx * dx + dy * dy) * 111).toFixed(1);
}

function calculPrix(distance: number) {
  const prixBase = 1000;
  const prixParKm = 250;

  return Math.round(prixBase + distance * prixParKm);
}

function ZoomRoute({ points }: any) {
  const map = useMap();

  if (points.length === 2) {
    map.fitBounds(points, {
      padding: [80, 80],
    });
  }

  return null;
}

export default function MapSection({
  depart,
  destination,
  prix,
}: {
  depart?: string;
  destination?: string;
  prix?: number;
}) {
  const [livreurPosition, setLivreurPosition] = useState<[number, number] | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<"Commande reçue" | "Livreur en route" | "Livraison en cours" | "Livré">("Commande reçue");
  
  const pointDepart =
    depart && quartiers[depart as keyof typeof quartiers];

  const pointDestination =
    destination &&
    quartiers[destination as keyof typeof quartiers];

  // Assurer que les coordonnées sont correctement typées
  const departCoords: [number, number] | null = pointDepart
    ? (pointDepart as [number, number])
    : null;

  const destinationCoords: [number, number] | null = pointDestination
    ? (pointDestination as [number, number])
    : null;

  // Créer le tableau de points uniquement si les deux coordonnées sont valides
  const points: [number, number][] =
    departCoords && destinationCoords ? [departCoords, destinationCoords] : [];

  const distance =
    departCoords && destinationCoords
      ? calculDistance(departCoords, destinationCoords)
      : null;

  const prixDynamique = distance
    ? calculPrix(Number(distance))
    : null;

  const tempsEstime = distance
    ? Math.round(Number(distance) * 4)
    : null;

  // Animation du livreur qui se déplace de départ vers destination
  useEffect(() => {
    // Logs pour déboguer
    console.log("🗺️ MapSection Debug:");
    console.log("Départ:", depart, "→", departCoords);
    console.log("Destination:", destination, "→", destinationCoords);
    console.log("Points array:", points);
    console.log("Points length:", points.length);

    if (!departCoords || !destinationCoords) {
      console.warn("⚠️ Coordonnées manquantes - polyline ne s'affichera pas");
      setLivreurPosition(null);
      return;
    }

    console.log("✅ Coordonnées valides - démarrage de l'animation");
    console.log("Interpolation de:", departCoords, "vers:", destinationCoords);

    // Initialiser la position du livreur au départ
    setLivreurPosition(departCoords);
    setDeliveryStatus("Commande reçue");

    // Simuler le mouvement du livreur
    const steps = 50;
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep <= steps) {
        const progress = currentStep / steps;
        
        // Interpolation linéaire
        const lat = departCoords[0] + (destinationCoords[0] - departCoords[0]) * progress;
        const lng = departCoords[1] + (destinationCoords[1] - departCoords[1]) * progress;
        
        setLivreurPosition([lat, lng]);

        // Mettre à jour le statut
        if (progress === 0) {
          setDeliveryStatus("Commande reçue");
        } else if (progress < 0.3) {
          setDeliveryStatus("Livreur en route");
        } else if (progress < 1) {
          setDeliveryStatus("Livraison en cours");
        } else {
          setDeliveryStatus("Livré");
        }

        currentStep++;
      } else {
        clearInterval(interval);
        setLivreurPosition(destinationCoords);
        setDeliveryStatus("Livré");
      }
    }, 500); // Mise à jour toutes les 500ms

    return () => clearInterval(interval);
  }, [depart, destination]);

  return (
    <section
      style={{
        padding: "100px 20px",
        background:
          "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "56px",
            fontWeight: "900",
            textAlign: "center",
            marginBottom: "20px",
            color: "#ffffff",
          }}
        >
          Carte GPS Dakar
        </h2>

        <p
          style={{
            textAlign: "center",
            fontSize: "20px",
            color: "#cbd5e1",
            marginBottom: "50px",
          }}
        >
          Suivi intelligent des livraisons
        </p>

        {distance && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginBottom: "30px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                padding: "15px 25px",
                borderRadius: "18px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                fontWeight: "700",
              }}
            >
              📍 Distance : {distance} KM
            </div>

            <div
              style={{
                background:
                  "linear-gradient(135deg,#7c3aed,#2563eb)",
                color: "#ffffff",
                padding: "15px 25px",
                borderRadius: "18px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                fontWeight: "700",
              }}
            >
              💰 Prix : {prixDynamique} FCFA
            </div>

            <div
              style={{
                background:
                  "linear-gradient(135deg,#22c55e,#16a34a)",
                color: "#ffffff",
                padding: "15px 25px",
                borderRadius: "18px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                fontWeight: "700",
              }}
            >
              ⏱ Temps : {tempsEstime} min
            </div>

            {/* Statut de livraison */}
            <div
              style={{
                background:
                  deliveryStatus === "Livré"
                    ? "linear-gradient(135deg,#22c55e,#16a34a)"
                    : "linear-gradient(135deg,#f59e0b,#d97706)",
                color: "#ffffff",
                padding: "15px 25px",
                borderRadius: "18px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                fontWeight: "700",
                animation: deliveryStatus !== "Commande reçue" ? "pulse 2s infinite" : "none",
              }}
            >
              {deliveryStatus === "Commande reçue" && "📦 Commande reçue"}
              {deliveryStatus === "Livreur en route" && "🚗 Livreur en route"}
              {deliveryStatus === "Livraison en cours" && "📍 Livraison en cours"}
              {deliveryStatus === "Livré" && "✅ Livré"}
            </div>
          </div>
        )}

        <div
          style={{
            overflow: "hidden",
            borderRadius: "30px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
            border: "6px solid white",
          }}
        >
          <MapContainer
            center={[14.7167, -17.4677]}
            zoom={12}
            scrollWheelZoom={true}
            style={{
              height:
                typeof window !== "undefined" &&
                window.innerWidth < 768
                  ? "400px"
                  : "600px",
              width: "100%",
              borderRadius: "24px",
            }}
          >
            <TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

            {Object.entries(quartiers).map(
              ([nom, position], idx) => (
                <Marker
                  key={idx}
                  position={position as [number, number]}
                >
                  <Popup>
                    <div
                      style={{
                        minWidth: "220px",
                        fontFamily: "sans-serif",
                      }}
                    >
                      <h3
                        style={{
                          margin: "0 0 10px",
                          color: "#2563eb",
                        }}
                      >
                        🚚 Livraison Dakar
                      </h3>

                      <p>
                        <strong>📍 Départ :</strong>{" "}
                        {depart}
                      </p>

                      <p>
                        <strong>🎯 Destination :</strong>{" "}
                        {destination}
                      </p>

                      <p>
                        <strong>📏 Distance :</strong>{" "}
                        {distance} KM
                      </p>

                      <p>
                        <strong>⏱ Temps :</strong>{" "}
                        {tempsEstime} min
                      </p>

                      <div
                        style={{
                          marginTop: "10px",
                          padding: "10px",
                          borderRadius: "12px",
                          background:
                            "linear-gradient(135deg,#2563eb,#7c3aed)",
                          color: "white",
                          fontWeight: "bold",
                          textAlign: "center",
                          fontSize: "20px",
                        }}
                      >
                        💰 {prixDynamique} FCFA
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            )}

            {points.length === 2 && (
              <>
                {/* Polyline animée */}
                <Polyline
                  positions={points}
                  pathOptions={{
                    color: "#7c3aed",
                    weight: 6,
                    opacity: 1,
                    dashArray: "10, 5",
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                />

                {/* Marqueur de départ */}
                <CircleMarker
                  center={departCoords!}
                  radius={12}
                  pathOptions={{
                    color: "#22c55e",
                    fillColor: "#22c55e",
                    fillOpacity: 1,
                  }}
                >
                  <Tooltip permanent direction="top">
                    📍 Départ
                  </Tooltip>

                  <Popup>
                    🚀 Départ : {depart}
                  </Popup>
                </CircleMarker>

                {/* Marqueur de destination */}
                <CircleMarker
                  center={destinationCoords!}
                  radius={12}
                  pathOptions={{
                    color: "#ef4444",
                    fillColor: "#ef4444",
                    fillOpacity: 1,
                  }}
                >
                  <Tooltip permanent direction="top">
                    🎯 Destination
                  </Tooltip>

                  <Popup>
                    🚚 Destination : {destination}
                  </Popup>
                </CircleMarker>

                {/* Marqueur livreur animé */}
                {livreurPosition && (
                  <CircleMarker
                    center={livreurPosition}
                    radius={10}
                    pathOptions={{
                      color: "#facc15",
                      fillColor: "#facc15",
                      fillOpacity: 1,
                      weight: 3,
                    }}
                  >
                    <Tooltip permanent direction="top">
                      🛵 Livreur - {deliveryStatus}
                    </Tooltip>
                    <Popup>
                      <div style={{ fontFamily: "sans-serif", minWidth: "180px" }}>
                        <strong>🛵 Livreur</strong>
                        <p style={{ margin: "5px 0" }}>Statut: {deliveryStatus}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                )}

                <ZoomRoute points={points} />
              </>
            )}
          </MapContainer>
        </div>
      </div>

      {/* Styles d'animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </section>
  );
}