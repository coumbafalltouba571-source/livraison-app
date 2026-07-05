"use client";

import { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader, TrafficLayer, DirectionsRenderer } from "@react-google-maps/api";

interface CommandLike {
  id?: string;
  depart?: string;
  destination?: string;
  driverLatitude?: number;
  driverLongitude?: number;
  clientLatitude?: number;
  clientLongitude?: number;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function EnhancedDriverMap({ commands }: { commands: CommandLike[] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey || "",
    libraries: ["places", "geometry"],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [activePos, setActivePos] = useState<{ lat: number; lng: number } | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // Pick first command with driver coords as focus
  const focus = commands.find((c) => c.driverLatitude !== undefined && c.driverLongitude !== undefined) || commands[0];

  useEffect(() => {
    if (!focus) return;
    if (focus.driverLatitude && focus.driverLongitude) {
      setActivePos({ lat: focus.driverLatitude, lng: focus.driverLongitude });
    }
  }, [focus]);

  // Request directions between driver and destination when both coords present
  useEffect(() => {
    if (!isLoaded || !focus) return;
    const origin = focus.driverLatitude && focus.driverLongitude ? { lat: focus.driverLatitude, lng: focus.driverLongitude } : null;
    const destination = focus.clientLatitude && focus.clientLongitude ? { lat: focus.clientLatitude, lng: focus.clientLongitude } : null;
    if (!origin || !destination) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: { departureTime: new Date(), trafficModel: google.maps.TrafficModel.BEST_GUESS },
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  }, [isLoaded, focus]);

  // Animate marker when activePos changes
  useEffect(() => {
    if (!isLoaded || !activePos || !mapRef.current) return;
    // center map smoothly
    mapRef.current.panTo(activePos);
  }, [isLoaded, activePos]);

  if (loadError) return <div>Erreur Google Maps: {String(loadError)}</div>;
  if (!isLoaded) return <div>Chargement carte...</div>;

  return (
    <div className="w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={activePos || { lat: 14.7167, lng: -17.4674 }}
        zoom={13}
        onLoad={(map) => { mapRef.current = map; }}
      >
        <TrafficLayer />

        {activePos && (
          <Marker
            position={activePos}
            animation={google.maps.Animation.DROP}
          />
        )}

        {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: false }} />}
      </GoogleMap>
      {/* Overlay for distance/time if directions present */}
      {directions && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow p-3 z-20">
          <div className="text-sm font-semibold">Itinéraire</div>
          <div className="text-xs text-gray-600">
            {directions.routes[0].legs[0].distance?.text} • {directions.routes[0].legs[0].duration?.text}
          </div>
          <div className="text-xs text-gray-500">Arrivée estimée: {/* cannot compute exact ETA without server time sync */}</div>
        </div>
      )}
    </div>
  );
}
