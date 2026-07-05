"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function AdminPremiumMap({ commands }: { commands: any[] }) {
  return (
    <MapContainer center={[14.7167, -17.4674]} zoom={12} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {commands.slice(0, 5).map((c: any) =>
        c.driverLatitude && c.driverLongitude ? (
          <Marker key={c.id} position={[c.driverLatitude, c.driverLongitude] as any as [number, number]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{c.nomClient || c.client || "Client"}</div>
                <div className="text-xs text-gray-600">{c.statut}</div>
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}
