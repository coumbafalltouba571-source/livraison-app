import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Livraison Pro Sénégal";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          padding: "40px",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>📦</div>
        <h1 style={{ margin: 0, marginBottom: 20 }}>Livraison Pro Sénégal</h1>
        <p style={{ fontSize: 30, margin: 0, opacity: 0.9 }}>
          Livraison rapide à Dakar et partout au Sénégal
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
