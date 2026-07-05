"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/app/components/ProductCard";
import ShoppingCart from "@/app/components/ShoppingCart";
import { DEFAULT_PRODUCTS, CartState, Product, addToCart, saveCartToStorage, loadCartFromStorage } from "@/app/utils/shop";
import Link from "next/link";

export default function ShopPage() {
  const [products] = useState(DEFAULT_PRODUCTS);
  const [cart, setCart] = useState<CartState>(() => {
    if (typeof window !== "undefined") {
      return loadCartFromStorage();
    }
    return { items: [], total: 0 };
  });
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("relevance");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");

  // Sauvegarder le panier
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const handleAddToCart = (product: Product, quantity: number) => {
    const newCart = addToCart(cart, product, quantity);
    setCart(newCart);
    // Feedback visuel
    alert(`✅ ${product.name} ajouté au panier!`);
  };

  const handleUpdateCart = (newCart: CartState) => {
    setCart(newCart);
  };

  const allSizes = Array.from(new Set(products.flatMap((product) => product.sizes || []))).sort();
  const allColors = Array.from(new Set(products.flatMap((product) => product.colors || []))).sort();

  // Filtrer les produits
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesSize = selectedSize === "all" || (product.sizes || []).includes(selectedSize);
      const matchesColor = selectedColor === "all" || (product.colors || []).includes(selectedColor);
      return matchesSearch && matchesCategory && matchesSize && matchesColor;
    })
    .sort((a, b) => {
      if (sortOption === "priceAsc") return a.price - b.price;
      if (sortOption === "priceDesc") return b.price - a.price;
      if (sortOption === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortOption === "stock") return (b.stock || 0) - (a.stock || 0);
      return 0;
    });

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ) as string[];

  return (
    <main style={{ minHeight: "100vh", background: "#ffffff" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
          padding: "40px 20px",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: "400px",
            height: "400px",
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "24px" }}>
            <Link
              href="/"
              style={{
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              ← Retour accueil
            </Link>
          </div>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "900",
              margin: 0,
              marginBottom: "8px",
            }}
          >
            🛒 Boutique
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.9)",
              margin: 0,
            }}
          >
            Découvrez nos produits exclusifs et commandez en ligne
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        {/* Panier Badge - Icône moderne SVG */}
        <button
          onClick={() => setShowCart(true)}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
            color: "#ffffff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(124, 58, 237, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            zIndex: 30,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(124, 58, 237, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(124, 58, 237, 0.3)";
          }}
          title={`${cart.items.length} article(s) dans le panier`}
        >
          {/* SVG Icône Panier */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>

          {/* Badge rouge avec nombre d'articles */}
          {cart.items.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: "800",
                color: "#ffffff",
                border: "3px solid #ffffff",
                boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
              }}
            >
              {cart.items.length}
            </div>
          )}
        </button>

        {/* Filtres */}
        <div style={{ marginBottom: "40px" }}>
          {/* Recherche */}
          <div style={{ marginBottom: "24px" }}>
            <input
              type="text"
              placeholder="🔍 Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "16px",
                boxSizing: "border-box",
                transition: "all 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#7c3aed";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124, 58, 237, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  padding: "8px 16px",
                  border: !selectedCategory ? "2px solid #7c3aed" : "1px solid #e5e7eb",
                  background: !selectedCategory ? "rgba(124, 58, 237, 0.1)" : "#f9fafb",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  transition: "all 0.2s",
                }}
              >
                Tous
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: "8px 16px",
                    border: selectedCategory === category ? "2px solid #7c3aed" : "1px solid #e5e7eb",
                    background: selectedCategory === category ? "rgba(124, 58, 237, 0.1)" : "#f9fafb",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                    transition: "all 0.2s",
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                style={{ padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: "12px", width: "100%" }}
              >
                <option value="all">Toutes tailles</option>
                {allSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                style={{ padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: "12px", width: "100%" }}
              >
                <option value="all">Toutes couleurs</option>
                {allColors.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{ padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: "12px", width: "100%" }}
              >
                <option value="relevance">Pertinence</option>
                <option value="priceAsc">Prix ascendant</option>
                <option value="priceDesc">Prix descendant</option>
                <option value="rating">Meilleure note</option>
                <option value="stock">Stock disponible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Produits */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
            <p style={{ color: "#6b7280", fontSize: "16px" }}>
              Aucun produit ne correspond à votre recherche
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        <div
          style={{
            marginTop: "60px",
            paddingTop: "40px",
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          <p>
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""} trouvé
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Panier Modal */}
      {showCart && (
        <ShoppingCart
          cart={cart}
          onUpdateCart={handleUpdateCart}
          onClose={() => setShowCart(false)}
        />
      )}
    </main>
  );
}
