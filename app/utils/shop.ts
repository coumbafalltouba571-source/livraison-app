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
  },
  {
    id: "5",
    name: "Nike Air Max",
    price: 28000,
    description: "Nike Air Max avec coussin d'air visible - Confort maximum",
    image: "/Chaussures Nike.png",
    images: ["/Chaussures Nike.png"],
    category: "Chaussures",
    autoplay: true,
    autoplayInterval: 5000,
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
  },
];

// Fonctions utilitaires panier
export function addToCart(
  cart: CartState,
  product: Product,
  quantity: number = 1
): CartState {
  const existingItem = cart.items.find((item) => item.product.id === product.id);

  let newItems: CartItem[];
  if (existingItem) {
    newItems = cart.items.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  } else {
    newItems = [...cart.items, { product, quantity }];
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
  const newItems = cart.items.map((item) =>
    item.product.id === productId
      ? { ...item, quantity: Math.max(1, quantity) }
      : item
  );

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
