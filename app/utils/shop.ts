// Types pour les produits et panier
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  images?: string[]; // Galerie d'images pour le produit
  category?: string;
  autoplay?: boolean; // Auto-rotation de galerie
  autoplayInterval?: number; // Intervalle en ms (défaut 5000)
  stock?: number;
  sizes?: string[];
  colors?: string[];
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

// Produits par défaut
export const DEFAULT_PRODUCTS: Product[] = [
  // CHAUSSURES
  {
    id: "1",
    name: "Chaussures Nike",
    price: 25000,
    description: "Chaussures de sport confortables avec technologie de confort avancée",
    image: "/Chaussures Nike.png",
    images: ["/Chaussures Nike.png"],
    category: "Chaussures",
    autoplay: true,
    autoplayInterval: 5000,
    stock: 12,
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["#111827", "#f8fafc", "#ef4444"],
    rating: 4.5,
    reviewCount: 38,
  },
  {
    id: "5",
    name: "Nike Air Max",
    price: 150000,
    description: "Nike Air Max avec coussin d'air visible - Confort maximum",
    image: "/Nike Air Max 1.png",
    images: [
      "/Nike Air Max 1.png",
      "/Nike Air Max 2.png",
      "/Nike Air Max 3.png",
      "/Nike Air Max 4.png",
      "/Nike Air Max 5.png",
      "/Nike Air Max 6.png",
      "/Nike Air Max 7.png",
    ],
    category: "Chaussures",
    autoplay: true,
    autoplayInterval: 5000,
    stock: 8,
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["#0f172a", "#ffffff", "#f59e0b"],
    rating: 4.9,
    reviewCount: 112,
  },
  {
    id: "6",
    name: "Adidas Ultraboost",
    price: 32000,
    description: "Adidas Ultraboost pour performance et style",
    image: "/Chaussures Nike.png",
    images: ["/Chaussures Nike.png"],
    category: "Chaussures",
    autoplay: true,
    autoplayInterval: 5000,
    stock: 5,
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["#0f172a", "#84cc16"],
    rating: 4.1,
    reviewCount: 23,
  },
  {
    id: "7",
    name: "Puma Running",
    price: 22000,
    description: "Puma Running pour vos entraînements intenses",
    image: "/Chaussures Nike.png",
    autoplay: true,
    autoplayInterval: 5000,
    images: ["/Chaussures Nike.png"],
    category: "Chaussures",
    stock: 0,
    sizes: ["40", "41", "42", "43"],
    colors: ["#111827", "#2563eb"],
    rating: 4.2,
    reviewCount: 18,
  },

  // ÉLECTRONIQUE
  {
    id: "2",
    name: "Montre Connectée",
    price: 15000,
    description: "Montre intelligente Bluetooth avec suivi d'activité et galerie photos",
    image: "/montre.png",
    images: ["/montre.png", "/montre.jpg"],
    category: "Électronique",
    autoplay: true,
    autoplayInterval: 5000,
    stock: 14,
    colors: ["#0f172a", "#f8fafc", "#2563eb"],
    rating: 4.4,
    reviewCount: 54,
  },
  {
    id: "8",
    name: "Apple Watch",
    price: 35000,
    description: "Apple Watch Série 8 - Suivi santé avancé et notifications",
    image: "/montre.png",
    images: ["/montre.png", "/montre.jpg"],
    category: "Électronique",
    autoplay: true,
    autoplayInterval: 5000,
    stock: 7,
    colors: ["#111827", "#eab308", "#f97316"],
    rating: 4.8,
    reviewCount: 72,
  },
  {
    id: "9",
    name: "Samsung Galaxy Watch",
    price: 28000,
    description: "Samsung Galaxy Watch avec écran AMOLED",
    image: "/montre.png",
    images: ["/montre.png", "/montre.jpg"],
    category: "Électronique",
    autoplay: true,
    autoplayInterval: 5000,
    stock: 11,
    colors: ["#0f172a", "#ffffff"],
    rating: 4.3,
    reviewCount: 45,
  },
  {
    id: "4",
    name: "Casque Bluetooth",
    price: 12000,
    description: "Son haute qualité avec réduction de bruit - Galerie 4 photos",
    image: "/Casque Bluetooth.png",
    images: [
      "/Casque Bluetooth.png",
      "/Casque Bluetooth (2).png",
      "/Casque Bluetooth (3).png",
      "/Casque Bluetooth (4).png",
    ],
    category: "Électronique",
    autoplay: true,
    autoplayInterval: 3000,
    stock: 3,
    colors: ["#111827", "#94a3b8"],
    rating: 4.0,
    reviewCount: 26,
  },
  {
    id: "10",
    name: "AirPods Pro",
    price: 18000,
    description: "AirPods Pro - Réduction de bruit active et mode transparence",
    image: "/Casque Bluetooth.png",
    images: [
      "/Casque Bluetooth.png",
      "/Casque Bluetooth (2).png",
      "/Casque Bluetooth (3).png",
      "/Casque Bluetooth (4).png",
    ],
    category: "Électronique",
    autoplay: true,
    autoplayInterval: 3000,
    stock: 10,
    colors: ["#ffffff", "#000000"],
    rating: 4.6,
    reviewCount: 61,
  },
  {
    id: "11",
    name: "Casque Sony",
    price: 22000,
    description: "Casque Sony WH-1000XM5 - Son premium et confort optimal",
    image: "/Casque Bluetooth.png",
    images: [
      "/Casque Bluetooth.png",
      "/Casque Bluetooth (2).png",
      "/Casque Bluetooth (3).png",
      "/Casque Bluetooth (4).png",
    ],
    category: "Électronique",
    autoplay: true,
    autoplayInterval: 3000,
    stock: 5,
    colors: ["#111827", "#94a3b8"],
    rating: 4.7,
    reviewCount: 93,
  },

  // VÊTEMENTS
  {
    id: "3",
    name: "T-shirt Premium",
    price: 8000,
    description: "Coton de qualité supérieure, confortable et durable - Galerie 2 photos",
    image: "/blog.png",
    images: ["/blog.png", "/blog (2).png"],
    category: "Vêtements",
    autoplay: true,
    autoplayInterval: 4000,
    stock: 18,
    sizes: ["S", "M", "L", "XL"],
    colors: ["#111827", "#f8fafc", "#8b5cf6"],
    rating: 4.3,
    reviewCount: 21,
  },
  {
    id: "12",
    name: "Polo Premium",
    price: 12000,
    description: "Polo élégant en coton 100% - Parfait pour toutes les occasions",
    image: "/blog.png",
    images: ["/blog.png", "/blog (2).png"],
    category: "Vêtements",
    autoplay: true,
    autoplayInterval: 4000,
    stock: 9,
    sizes: ["S", "M", "L"],
    colors: ["#0f172a", "#2563eb", "#d97706"],
    rating: 4.2,
    reviewCount: 26,
  },
  {
    id: "13",
    name: "Jean Homme",
    price: 18000,
    description: "Jean confortable et tendance - Coupe ajustée",
    image: "/blog.png",
    autoplay: true,
    autoplayInterval: 4000,
    images: ["/blog.png", "/blog (2).png"],
    category: "Vêtements",
    stock: 7,
    sizes: ["30", "32", "34", "36"],
    colors: ["#0f172a", "#475569"],
    rating: 4.5,
    reviewCount: 47,
  },
  {
    id: "14",
    name: "Ensemble Sport",
    price: 20000,
    description: "Ensemble sport complet - Pantalon et t-shirt assortis",
    image: "/blog.png",
    autoplay: true,
    autoplayInterval: 4000,
    images: ["/blog.png", "/blog (2).png"],
    category: "Vêtements",
    stock: 4,
    sizes: ["S", "M", "L", "XL"],
    colors: ["#111827", "#10b981"],
    rating: 4.4,
    reviewCount: 35,
  },
];

// Fonctions utilitaires panier
export function addToCart(
  cart: CartState,
  product: Product,
  quantity: number = 1
): CartState {
  const stockLimit = product.stock ?? Infinity;
  const existingItem = cart.items.find((item) => item.product.id === product.id);

  let newItems: CartItem[];
  if (existingItem) {
    const updatedQuantity = Math.min(existingItem.quantity + quantity, stockLimit);
    newItems = cart.items.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: updatedQuantity }
        : item
    );
  } else {
    const initialQuantity = Math.min(Math.max(1, quantity), stockLimit);
    newItems = stockLimit > 0 ? [...cart.items, { product, quantity: initialQuantity }] : cart.items;
  }

  const newTotal = newItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return { items: newItems, total: newTotal };
}

export function removeFromCart(cart: CartState, productId: string): CartState {
  const newItems = cart.items.filter((item) => item.product.id !== productId);
  const newTotal = newItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return { items: newItems, total: newTotal };
}

export function updateQuantity(
  cart: CartState,
  productId: string,
  quantity: number
): CartState {
  const newItems = cart.items.map((item) => {
    if (item.product.id !== productId) return item;
    const stockLimit = item.product.stock ?? Infinity;
    const clampedQuantity = Math.min(Math.max(1, quantity), stockLimit);
    return { ...item, quantity: clampedQuantity };
  });

  const newTotal = newItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return { items: newItems, total: newTotal };
}

export function clearCart(): CartState {
  return { items: [], total: 0 };
}

// LocalStorage persistence
export function saveCartToStorage(cart: CartState): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("shop_cart", JSON.stringify(cart));
  }
}

export function loadCartFromStorage(): CartState {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("shop_cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { items: [], total: 0 };
      }
    }
  }
  return { items: [], total: 0 };
}
