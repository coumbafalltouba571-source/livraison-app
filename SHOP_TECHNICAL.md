# 👨‍💻 DOCUMENTATION TECHNIQUE - BOUTIQUE

## 🏗️ ARCHITECTURE

### Types
```typescript
// Product
interface Product {
  id: string;           // Unique ID
  name: string;         // Nom du produit
  price: number;        // Prix en FCFA
  description: string;  // Description longue
  image: string;        // Emoji ou URL
  category?: string;    // Catégorie optionnelle
}

// CartItem (produit + quantité)
interface CartItem {
  product: Product;
  quantity: number;
}

// CartState (état du panier)
interface CartState {
  items: CartItem[];
  total: number;  // Total en FCFA
}
```

### Composants
```
ProductCard         → Affichage produit individuel
ShoppingCart        → Modal panier + checkout
ShopPage            → Page /boutique complète
```

---

## 🔄 FLUX DE DONNÉES

### Création Commande (E-commerce)
```
Client ajoute produit au panier
  ↓
LocalStorage sauvegarde cart
  ↓
Client valide commande
  ↓
ShoppingCart crée Command Firestore
  ↓
Command avec:
  - depart: "Boutique"
  - description: "Achat boutique: produits"
  - prix: total panier
  ↓
WhatsApp notification admin
  ↓
Commande visible dans /admin
```

### Intégration avec historique
```
Client va à /commander/history
  ↓
Filtre par téléphone
  ↓
Voir commandes boutique (depart="Boutique")
  ↓
Même historique que commandes normales
```

---

## 📁 FICHIERS

### app/utils/shop.ts
**Exports:**
- `Product`, `CartItem`, `CartState` (types)
- `DEFAULT_PRODUCTS` (produits initiaux)
- `addToCart()` - Ajouter au panier
- `removeFromCart()` - Supprimer du panier
- `updateQuantity()` - Changer quantité
- `clearCart()` - Vider panier
- `saveCartToStorage()` - Sauvegarder localStorage
- `loadCartFromStorage()` - Charger localStorage

**Utilisation:**
```typescript
import { addToCart, loadCartFromStorage } from "@/app/utils/shop";

// Charger panier sauvegardé
const cart = loadCartFromStorage();

// Ajouter produit
const newCart = addToCart(cart, product, 1);

// Sauvegarder
saveCartToStorage(newCart);
```

### app/components/ProductCard.tsx
**Props:**
```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}
```

**Utilisation:**
```tsx
<ProductCard
  product={product}
  onAddToCart={(product, qty) => handleAddToCart(product, qty)}
/>
```

### app/components/ShoppingCart.tsx
**Props:**
```typescript
interface ShoppingCartProps {
  cart: CartState;
  onUpdateCart: (newCart: CartState) => void;
  onClose: () => void;
}
```

**Fonctionnalités:**
- Affiche articles du panier
- Permet modifier quantité
- Formulaire checkout (nom, tel, paiement)
- Crée Command dans Firestore
- Envoie WhatsApp
- Vide panier après succès

### app/boutique/page.tsx
**Fonctionnalités:**
- Navigation recherche
- Filtrage par catégorie
- Affichage grille produits
- Bouton panier flottant
- Badge nombre articles
- LocalStorage persistence

---

## 🔌 INTÉGRATION FIRESTORE

### Command Structure (Commande Boutique)
```typescript
{
  id: "auto",
  telephone: "+221773629075",
  client: "John Doe",
  nomClient: "John Doe",
  depart: "Boutique",              // ← Marque comme boutique
  destination: "À livrer",
  description: "Achat boutique: 1x Chaussures Nike, 2x T-shirt Premium",
  prix: 41000,
  modePayement: "Wave",
  statut: "en attente",
  dateLivraison: Date,
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

### Requête Firestore
```typescript
// Dans ShoppingCart.tsx
await createCommand({
  telephone: clientPhone,
  client: clientName,
  nomClient: clientName,
  depart: "Boutique",  // ← Important!
  destination: "À livrer",
  description: `Achat boutique: ${productList}`,
  prix: cart.total,
  // ... autres champs
});
```

---

## 💾 LOCALSTORAGE

### Clé/Valeur
```javascript
localStorage.getItem("shop_cart");
// → JSON CartState

{
  "items": [
    {
      "product": { "id": "1", "name": "...", ... },
      "quantity": 2
    }
  ],
  "total": 41000
}
```

### Utilisation
```typescript
// Sauvegarder
saveCartToStorage(cart);

// Charger
const cart = loadCartFromStorage();

// Vider
localStorage.removeItem("shop_cart");
```

---

## 🎨 STYLING

### Colors
```typescript
Primary:     "#7c3aed" (Violet)
Secondary:   "#2563eb" (Bleu)
Success:     "#10b981" (Vert)
Error:       "#ef4444" (Rouge)
Neutral:     "#6b7280" (Gris)
```

### Responsive
```typescript
// ProductCard grid
gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))"

// Fonctionne sur:
// - Mobile: 1 colonne
// - Tablet: 2 colonnes
// - Desktop: 3-4 colonnes
```

---

## 🚀 EXTENSION - AJOUTER DES PRODUITS

### Méthode 1: Code (Statique)
```typescript
// app/utils/shop.ts
const DEFAULT_PRODUCTS: Product[] = [
  // ... produits existants
  {
    id: "5",
    name: "Nouveau Produit",
    price: 20000,
    description: "Description détaillée",
    image: "🎯",
    category: "Nouvelle Catégorie",
  }
];
```

### Méthode 2: Admin Dashboard (Future)
```typescript
// À implémenter dans phase 3
// Admin peut ajouter/éditer produits via UI
// Stockés dans Firestore
```

### Checklist Nouveau Produit
- [ ] ID unique (string)
- [ ] Nom court et clair
- [ ] Prix > 0
- [ ] Description 1-2 phrases
- [ ] Emoji approprié
- [ ] Catégorie cohérente

---

## 🔐 SÉCURITÉ

### Données Client
- Téléphone: **Stocké Firestore** (normal)
- Nom: **Stocké Firestore** (normal)
- Panier: **LocalStorage** (navigateur local)

### Validation
- Tous champs requis avant commande
- Vérif prix > 0
- Vérif quantité >= 1

### WhatsApp
- Lien public (sûr)
- Pas de données sensibles

---

## 🧪 TESTS

### Unit Tests (À implémenter)
```typescript
// Tester addToCart
expect(addToCart(emptyCart, product1, 1).total).toBe(product1.price);

// Tester removeFromCart
expect(removeFromCart(cartWith2, product1.id).items.length).toBe(1);

// Tester localStorage
saveCartToStorage(testCart);
expect(loadCartFromStorage()).toEqual(testCart);
```

### E2E Tests (À implémenter)
```typescript
// Scénario complet
1. Naviguer /boutique
2. Rechercher "Nike"
3. Ajouter au panier
4. Vérifier badge +1
5. Ouvrir panier
6. Remplir formulaire
7. Cliquer "Valider"
8. Vérifier Firestore
9. Vérifier historique client
```

---

## 📊 PERFORMANCE

### Optimisations Actuelles
- ✅ ProductCard memoization (TODO)
- ✅ LocalStorage caching
- ✅ Lazy loading images (emojis)

### Améliorations Futures
- [ ] Product images CDN
- [ ] Infinite scroll
- [ ] Server-side filtering
- [ ] Product pagination

---

## 🔗 LIENS UTILES

### Fichiers
- [shop.ts](/app/utils/shop.ts) - Utilitaires
- [ProductCard.tsx](/app/components/ProductCard.tsx) - Composant produit
- [ShoppingCart.tsx](/app/components/ShoppingCart.tsx) - Panier modal
- [boutique/page.tsx](/app/boutique/page.tsx) - Page boutique

### Documentation
- [SHOP_GUIDE.md](/SHOP_GUIDE.md) - Guide utilisateur
- [SYSTEM_IMPROVEMENTS.md](/SYSTEM_IMPROVEMENTS.md) - Vue d'ensemble système

---

## 🚨 ISSUES CONNUS

### À régler
- [ ] Images produits (actuellement emojis uniquement)
- [ ] Promo codes (non implémentés)
- [ ] Stock (pas de gestion stock)
- [ ] Variantes produits (tailles, couleurs)

### Futures Features
- [ ] Wishlist/Favoris
- [ ] Avis produits
- [ ] Photos clients
- [ ] Recommandations IA
- [ ] Panier partageable

---

**Dernière mise à jour:** 2026-06-11  
**Version:** 1.0  
**Mainteneur:** Dev Team
