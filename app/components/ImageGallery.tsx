"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  productName: string;
  autoplay?: boolean;
  autoplayInterval?: number;
}

export default function ImageGallery({
  images,
  productName,
  autoplay = false,
  autoplayInterval = 5000,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Autoplay
  useEffect(() => {
    if (!autoplay || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, images.length]);

  // Si une seule image, l'afficher simplement
  if (images.length <= 1) {
    return (
      <div
        style={{
          height: "200px",
          background: "linear-gradient(135deg, #f9fafb 0%, #eff2f5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <Image
          src={images[0]}
          alt={productName}
          fill
          style={{
            objectFit: "contain",
            objectPosition: "center",
            padding: "10px",
          }}
          sizes="(max-width: 768px) 100vw, 300px"
          priority={false}
        />
      </div>
    );
  }

  // Galerie multi-images
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "12px 12px 0 0",
        overflow: "hidden",
      }}
    >
      {/* Image Container */}
      <div
        style={{
          height: "200px",
          background: "linear-gradient(135deg, #f9fafb 0%, #eff2f5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Image
          src={images[currentIndex]}
          alt={`${productName} - ${currentIndex + 1}`}
          fill
          style={{
            objectFit: "contain",
            objectPosition: "center",
            padding: "10px",
          }}
          sizes="(max-width: 768px) 100vw, 300px"
          priority={false}
        />
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          {/* Flèche Gauche */}
          <button
            onClick={handlePrev}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0, 0, 0, 0.5)",
              color: "#ffffff",
              border: "none",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              transition: "all 0.3s",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0, 0, 0, 0.8)";
              e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0, 0, 0, 0.5)";
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
            }}
            aria-label="Image précédente"
          >
            ◀
          </button>

          {/* Flèche Droite */}
          <button
            onClick={handleNext}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0, 0, 0, 0.5)",
              color: "#ffffff",
              border: "none",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              transition: "all 0.3s",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0, 0, 0, 0.8)";
              e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0, 0, 0, 0.5)";
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
            }}
            aria-label="Image suivante"
          >
            ▶
          </button>

          {/* Indicateurs (petits points) */}
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "6px",
              zIndex: 10,
            }}
          >
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                style={{
                  width: index === currentIndex ? "16px" : "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background:
                    index === currentIndex
                      ? "#7c3aed"
                      : "rgba(255, 255, 255, 0.6)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                aria-label={`Aller à l'image ${index + 1}`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    index === currentIndex ? "#7c3aed" : "rgba(255, 255, 255, 0.8)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    index === currentIndex
                      ? "#7c3aed"
                      : "rgba(255, 255, 255, 0.6)";
                }}
              />
            ))}
          </div>

          {/* Compteur images (optionnel) */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "rgba(0, 0, 0, 0.6)",
              color: "#ffffff",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "600",
              zIndex: 10,
            }}
          >
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
