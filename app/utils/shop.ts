// Types pour les produits et panier
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category?: string;
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
  {
    id: "1",
    name: "Chaussures Nike",
    price: 25000,
    description: "Chaussures de sport confortables avec technologie de confort avancée",
    image: "/product-chaussures.svg",
    category: "Chaussures",
  },
  {
    id: "2",
    name: "Montre Connectée",
    price: 15000,
    description: "Montre intelligente Bluetooth avec suivi d'activité",
    image: "/montre.jpg",
    category: "Électronique",
  },
  {
    id: "3",
    name: "T-shirt Premium",
    price: 8000,
    description: "Coton de qualité supérieure, confortable et durable",
    image: "/product-tshirt.svg",
    category: "Vêtements",
  },
  {
    id: "4",
    name: "Casque Bluetooth",
    price: 12000,
    description: "Son haute qualité avec réduction de bruit",
    image: "/product-casque.svg",
    category: "Électronique",
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
