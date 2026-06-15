"use client";

import Image from "next/image";
import ImageGallery from "./ImageGallery";
import { Product } from "@/app/utils/shop";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease",
        border: "1px solid #e5e7eb",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.15)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Galerie d'images */}
      {product.images && product.images.length > 0 ? (
        <ImageGallery
          images={product.images}
          productName={product.name}
          autoplay={product.autoplay}
          autoplayInterval={product.autoplayInterval}
        />
      ) : (
        <div
          style={{
            height: "200px",
            background: "linear-gradient(135deg, #f9fafb 0%, #eff2f5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {/* Fallback gradient pendant le chargement */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              opacity: 0.03,
            }}
          />

          {/* Image produit */}
          {product.image && product.image.startsWith("/") ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              style={{
                objectFit: "contain",
                objectPosition: "center",
                padding: "10px",
              }}
              sizes="(max-width: 768px) 100vw, 300px"
              priority={false}
            />
          ) : (
            <span style={{ position: "relative", zIndex: 1, fontSize: "80px" }}>
              {product.image}
            </span>
          )}
        </div>
      )}

      {/* Contenu */}
      <div style={{ padding: "20px" }}>
        {/* Catégorie */}
        {product.category && (
          <div
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#7c3aed",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "8px",
            }}
          >
            {product.category}
          </div>
        )}

        {/* Nom */}
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#1f2937",
            margin: "0 0 8px 0",
            minHeight: "50px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {product.name}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            margin: "0 0 16px 0",
            lineHeight: "1.5",
            minHeight: "45px",
          }}
        >
          {product.description}
        </p>

        {/* Prix */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            paddingBottom: "16px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "600" }}>
            💰 Prix
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "900",
              color: "#7c3aed",
            }}
          >
            {product.price.toLocaleString("fr-FR")} FCFA
          </span>
        </div>

        {/* Bouton Commander */}
        <button
          onClick={() => onAddToCart(product, 1)}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(124, 58, 237, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          🛒 Commander
        </button>
      </div>
    </div>
  );
}
