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
import { calculerDistance, QUARTIERS_COORDS } from "@/app/utils/tarifs";

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

// Icône personnalisée pour départ
const DepartIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Icône personnalisée pour destination
const DestinationIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.setIcon(DefaultIcon);

function ZoomRoute({ points }: { points: [number, number][] }) {
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
  // Récupérer les coordonnées des quartiers
  const pointDepart = depart && QUARTIERS_COORDS[depart];
  const pointDestination = destination && QUARTIERS_COORDS[destination];
  
  const [distance, setDistance] = useState(0);
  const [deliveryStatus, setDeliveryStatus] = useState<"Commande reçue" | "Livreur en route" | "Livraison en cours" | "Livré">("Commande reçue");
  const [livreurPosition, setLivreurPosition] = useState<[number, number]>([14.7167, -17.4674]);

  // Calculer la distance
  useEffect(() => {
    if (depart && destination) {
      const d = calculerDistance(depart, destination);
      setDistance(d);
    }
  }, [depart, destination]);

  // Centre par défaut (Dakar)
  const defaultCenter: [number, number] = [14.7167, -17.4674];
  const center = pointDepart || defaultCenter;

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

  // Animation du livreur qui se déplace de départ vers destination
  useEffect(() => {
    if (!departCoords || !destinationCoords) {
      return;
    }

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
  }, [departCoords, destinationCoords]);

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
              💰 Prix : {prix || 'N/A'} FCFA
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
              ⏱ Temps : {distance ? Math.round(distance * 4) : 'N/A'} min
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

            {/* Affiche la polyline si les deux points sont disponibles */}
            {points.length === 2 && (
              <Polyline positions={points} color="blue" weight={3} />
            )}

            {/* Marker pour le départ */}
            {departCoords && (
              <Marker position={departCoords} icon={DepartIcon}>
                <Popup>📍 Départ: {depart}</Popup>
              </Marker>
            )}

            {/* Marker pour la destination */}
            {destinationCoords && (
              <Marker position={destinationCoords} icon={DestinationIcon}>
                <Popup>📍 Destination: {destination}</Popup>
              </Marker>
            )}

            {/* Marker pour la position du livreur */}
            {livreurPosition && (
              <CircleMarker
                center={livreurPosition}
                radius={8}
                color="#ef4444"
                fillColor="#fca5a5"
                fillOpacity={0.7}
              >
                <Tooltip direction="top" offset={[0, -10]} permanent>
                  🚗 Livreur
                </Tooltip>
              </CircleMarker>
            )}

            {/* Zoom automatique si les deux points sont présents */}
            {points.length === 2 && <ZoomRoute points={points} />}
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