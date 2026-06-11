# 🛒 GUIDE BOUTIQUE - SYSTÈME E-COMMERCE

## 📋 Vue d'ensemble

Nouvelle fonctionnalité complète de boutique e-commerce intégrée à l'application de livraison.

### Caractéristiques
- ✅ Catalogue de produits avec recherche
- ✅ Filtrage par catégorie
- ✅ Panier persistant (localStorage)
- ✅ Commande automatique via Firestore
- ✅ Notification WhatsApp
- ✅ Historique des commandes boutique

---

## 👥 GUIDE CLIENT - UTILISER LA BOUTIQUE

### 1️⃣ Accéder à la Boutique

**Option 1: Navigation Header**
- Sur la page d'accueil
- Cliquer sur **"🛒 Boutique"** en haut

**Option 2: Section Boutique**
- Scroller sur la page d'accueil
- Cliquer sur **"🛍️ Visiter la Boutique"**

**Option 3: URL directe**
- Aller à `/boutique`

### 2️⃣ Parcourir les Produits

**Voir tous les produits**
- La page affiche 4 produits par défaut:
  1. 👟 Chaussures Nike - 25,000 FCFA
  2. ⌚ Montre Connectée - 15,000 FCFA
  3. 👕 T-shirt Premium - 8,000 FCFA
  4. 🎧 Casque Bluetooth - 12,000 FCFA

**Chaque produit affiche:**
- 📷 Image/Emoji représentatif
- 📝 Nom du produit
- 💬 Description détaillée
- 💰 Prix en FCFA
- 🏷️ Catégorie
- 🛒 Bouton "Commander"

### 3️⃣ Rechercher un Produit

- Utiliser la barre **"🔍 Rechercher un produit..."**
- Taper le nom du produit
- Les résultats se mettent à jour en temps réel

### 4️⃣ Filtrer par Catégorie

Cliquer sur une catégorie:
- **Tous les produits** - Voir tous
- **Chaussures** - Voir les chaussures
- **Électronique** - Voir l'électronique
- **Vêtements** - Voir les vêtements

### 5️⃣ Ajouter au Panier

1. Cliquer **"🛒 Commander"** sur un produit
2. Message: **"✅ Produit ajouté au panier!"**
3. Le produit s'ajoute au panier

### 6️⃣ Consulter le Panier

- Cliquer le **bouton flottant 🛒** en bas à droite
- Voir:
  - Liste des articles
  - Quantité par article
  - Prix total
  - Nombre d'articles

### 7️⃣ Modifier le Panier

**Changer la quantité:**
- Cliquer **−** pour diminuer
- Cliquer **+** pour augmenter

**Supprimer un article:**
- Cliquer **✕** rouge à côté de l'article

**Vider le panier:**
- Cliquer **✕** en haut du panier

### 8️⃣ Valider la Commande

1. Remplir vos informations:
   - **Nom complet**
   - **Téléphone**
   - **Méthode de paiement** (Wave, Orange Money, Cash, Carte)

2. Vérifier le total FCFA

3. Cliquer **"✅ Valider la commande"**

4. Résultat:
   - ✅ Commande créée dans Firestore
   - 📲 Message WhatsApp à l'admin
   - 🔄 Redirection WhatsApp
   - 📋 Commande visible dans historique

### 9️⃣ Voir l'Historique

- Aller à **"📍 Mon Historique"**
- Entrer votre téléphone
- Voir vos commandes boutique
- Suivre le statut (En attente → Livrée)

---

## 👨‍💼 GUIDE ADMIN - GÉRER LA BOUTIQUE

### Accéder aux Commandes Boutique

1. Aller à `/admin`
2. Entrer code: **8080**
3. Les commandes boutique apparaissent comme des commandes normales
4. **Départ:** "Boutique"
5. **Destination:** "À livrer"

### Identifier une Commande Boutique

**Caractéristiques:**
- Description commence par "Achat boutique:"
- Contient les noms des produits
- Départ = "Boutique"
- Montant = Total produits

**Exemple:**
```
Description: Achat boutique: 1x Chaussures Nike, 2x T-shirt Premium
Total: 41,000 FCFA
```

### Gérer les Commandes

1. **Voir les détails:**
   - Cliquer "▶ Détails"
   - Voir description complète

2. **Changer le statut:**
   - ⏳ En attente → ✅ Confirmée
   - ✅ Confirmée → 🔄 En cours
   - 🔄 En cours → 🚚 En livraison
   - 🚚 En livraison → 📦 Livrée

3. **Client voit les mises à jour** en temps réel!

---

## 🗂️ STRUCTURE FICHIERS

### Nouveaux fichiers
```
app/
  ├── utils/shop.ts          # Types + utilitaires panier
  ├── components/
  │   ├── ProductCard.tsx    # Carte produit
  │   └── ShoppingCart.tsx   # Panier modal
  └── boutique/
      └── page.tsx           # Page boutique
```

### Fichiers modifiés
```
app/
  └── page.tsx              # Ajout header nav + section boutique
```

---

## 💾 STOCKAGE

### LocalStorage
- **Clé:** `shop_cart`
- **Valeur:** CartState JSON
- **Durée:** Persistant (jusqu'à suppression)
- **Automatique:** Sauvegarde à chaque changement

### Firestore
- **Collection:** `commandes` (existante)
- **Champ départ:** "Boutique"
- **Champ description:** "Achat boutique: [produits]"

---

## 🛍️ AJOUTER DES PRODUITS

### Dans le code (app/utils/shop.ts)

```typescript
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "5",
    name: "Votre Produit",
    price: 10000,
    description: "Description du produit",
    image: "😀",  // Emoji
    category: "Catégorie",
  },
  // ... autres produits
];
```

### Champs requis
- `id`: Identifiant unique (string)
- `name`: Nom du produit
- `price`: Prix en FCFA
- `description`: Description longue
- `image`: Emoji représentatif
- `category`: Optionnel (pour filtrage)

### Emojis suggérés
- 👟 Chaussures
- ⌚ Accessoires électroniques
- 👕 Vêtements
- 🍔 Alimentation
- 📚 Livres
- 🎮 Jeux

---

## 🔧 CUSTOMIZATION

### Changer la couleur du bouton panier
Fichier: `ShoppingCart.tsx`
```typescript
background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)"
```

### Ajouter un logo à la boutique
Fichier: `boutique/page.tsx` ligne 1
```typescript
// Ajouter un Image component
```

### Changer le numéro WhatsApp
Fichier: `ShoppingCart.tsx` ligne 85
```typescript
`https://wa.me/YOUR_NUMBER?text=...`
```

---

## 🧮 CALCULS

### Panier total automatique
```
Total = Σ(Prix_produit × Quantité)
```

### Exemple
- 1× Chaussures Nike (25,000) = 25,000
- 2× T-shirt Premium (8,000) = 16,000
- **Total = 41,000 FCFA**

---

## 🚀 FONCTIONNALITÉS FUTURES (Phase 3)

- [ ] Promotion/Codes de réduction
- [ ] Quantité en stock
- [ ] Images produits uploadables
- [ ] Avis clients
- [ ] Wishlist/Favoris
- [ ] Pré-commandes
- [ ] Variantes produit (tailles, couleurs)
- [ ] Panier avec livraison choisie

---

## 🐛 DÉPANNAGE

### "Panier vide après rafraîchissement"
- Vérifier localStorage dans DevTools
- Clé: `shop_cart`
- Peut être vidé manuellement

### "Produit pas ajouté"
- Vérifier console (F12)
- Vérifier que l'ID du produit est unique

### "Commande pas créée"
- Vérifier nom et téléphone remplis
- Vérifier Firestore rules
- Voir console pour erreurs

### "Prix ne s'affiche pas"
- Vérifier que price est un nombre
- Localization française: `.toLocaleString("fr-FR")`

---

## 📊 METRICS

### Par jour
- Nombre de produits consultés
- Nombre de panier abandonnés
- Nombre de commandes boutique
- Total ventes boutique

---

**Dernière mise à jour:** 2026-06-11  
**Version:** 1.0 - Boutique initiale  
**Status:** ✅ Production Ready
