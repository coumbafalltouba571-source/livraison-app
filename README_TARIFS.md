# 🚚 Application Livraison Dakar - Système de Tarifs Intelligents

> Application Next.js avec calcul automatique des tarifs de livraison à Dakar - Style Uber

## ✨ Nouvelles fonctionnalités

### 1. 🧮 Calcul automatique des tarifs
- Calcul en temps réel selon départ et destination
- Tarifs entre **1 000 FCFA** et **6 000 FCFA**
- Basé sur la distance réelle entre quartiers
- Tarifs arrondis à 50 FCFA près

### 2. 📊 Interface moderne style Uber
- Design épuré avec gradients
- Sélection dropdown pour les quartiers
- Affichage dynamique du prix calculé
- Transitions fluides et hover effects

### 3. 🎯 8 quartiers supportés
- Plateau - Centre-ville
- Parcelles - Zone résidentielle
- Médina - Quartier populaire
- Almadies - Zone nord
- Ouakam - Banlieue nord
- Keur Massar - Banlieue est
- Pikine - Banlieue est
- Grand Yoff - Banlieue sud-est

### 4. 🔗 Intégration WhatsApp
- Envoi de commandes via WhatsApp
- Inclusion automatique du prix calculé
- Support Wave et Orange Money

## 📁 Structure du projet

```
livraison-app/
├── app/
│   ├── utils/
│   │   └── tarifs.ts                    # 🔧 Système de calcul des tarifs
│   ├── components/
│   │   ├── TarifsTable.tsx              # 📊 Tableau des tarifs
│   │   └── CalculatriceTarifs.tsx       # 🧮 Calculatrice
│   ├── tarifs/
│   │   └── page.tsx                     # 📄 Page tableau complet
│   ├── page.tsx                         # 🏠 Page principale
│   ├── layout.tsx
│   └── globals.css
├── TARIFS.md                            # 📖 Documentation complète
├── README.md                            # 📋 Ce fichier
├── package.json
├── tsconfig.json
├── next.config.ts
└── ...
```

## 🚀 Démarrage rapide

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

L'app sera disponible sur `http://localhost:3000`

### Production

```bash
npm run build
npm run start
```

## 🎮 Utilisation

### Page principale (Formulaire de commande)

**URL** : `/`

1. Entrez votre numéro de téléphone
2. Sélectionnez le point de départ
3. Sélectionnez la destination
4. Le tarif s'affiche automatiquement ✨
5. Cliquez "Confirmer la commande" pour envoyer via WhatsApp

### Tableau des tarifs

**URL** : `/tarifs`

- Vue complète de tous les tarifs
- Calculatrice interactive
- Tableau complet avec tous les trajets

## 📦 Imports et utilisation

### Utiliser le système de tarifs

```typescript
import {
  QUARTIERS_DAKAR,
  calculerTarif,
  formatPrix,
  getDescriptionRoute,
  validerTarif,
} from "@/app/utils/tarifs";

// Calcul du tarif
const prix = calculerTarif("Plateau", "Médina"); // 1000

// Formatage
console.log(formatPrix(prix)); // "1 000 FCFA"

// Validation
if (validerTarif(prix)) {
  console.log("Tarif valide");
}

// Description
console.log(getDescriptionRoute("Plateau", "Médina")); // "Plateau → Médina"
```

### Utiliser la calculatrice

```tsx
import CalculatriceTarifs from "@/app/components/CalculatriceTarifs";

export default function MyPage() {
  return <CalculatriceTarifs />;
}
```

### Utiliser le tableau des tarifs

```tsx
import TarifsTable from "@/app/components/TarifsTable";

export default function MyPage() {
  return <TarifsTable />;
}
```

## 📊 Exemples de tarifs

| De | Vers | Tarif |
|---|---|---|
| Plateau | Médina | 1 000 FCFA |
| Pikine | Keur Massar | 2 250 FCFA |
| Keur Massar | Grand Yoff | 4 200 FCFA |
| Plateau | Almadies | 2 500 FCFA |
| Plateau | Pikine | 5 500 FCFA |

## 🔧 Configuration

### Ajouter un nouveau quartier

1. Éditez `app/utils/tarifs.ts`
2. Ajoutez le quartier à `QUARTIERS_DAKAR`
3. Ajoutez les distances dans `DISTANCES_MATRIX`

```typescript
// Exemple
export const QUARTIERS_DAKAR = [
  // ... quartiers existants ...
  "Nouveau Quartier",
];
```

### Modifier les limites de tarifs

Dans `app/utils/tarifs.ts`, modifiez la fonction `calculerTarif()` :

```typescript
// Avant
tarif = Math.max(1000, Math.min(6000, tarif));

// Après (exemple: min 500, max 8000)
tarif = Math.max(500, Math.min(8000, tarif));
```

### Modifier la formule de calcul

```typescript
// Actuellement:
let tarif = 500 + distance * 250;

// Vous pouvez changer pour:
let tarif = 400 + distance * 200; // Plus économique
```

## 🎨 Personnalisation du design

### Couleurs utilisées

- **Bleu cyan** : `#22d3ee` (accent principal)
- **Jaune ambre** : `#fbbf24` (prix)
- **Bleu foncé** : `#0f172a` (fond)
- **Gris ardoise** : `#1e293b` (cartes)
- **Gris clair** : `#cbd5e1` (labels)

### Modifier le numéro WhatsApp

Dans `app/page.tsx`, modifiez :

```typescript
window.open(
  `https://wa.me/221773629075?text=${message}`, // ← Modifiez le numéro ici
  "_blank"
);
```

## 📖 Documentation complète

Voir [TARIFS.md](./TARIFS.md) pour la documentation détaillée :
- Formule de calcul complète
- Modification des tarifs
- Ajout de nouveaux quartiers
- Exemples avancés
- Troubleshooting

## 🐛 Troubleshooting

### Le tarif n'est pas calculé

✅ Assurez-vous que les deux champs (départ et destination) sont sélectionnés
✅ Vérifiez que les quartiers existent dans `QUARTIERS_DAKAR`

### Le message WhatsApp n'est pas envoyé

✅ Vérifiez le numéro WhatsApp dans le code
✅ Testez sur mobile ou avec WhatsApp Web
✅ Vérifiez que le numéro commence par le code pays

### Erreur TypeScript

✅ Exécutez `npm run lint` pour vérifier
✅ Vérifiez que tous les imports sont corrects

## 📝 Fichiers modifiés

### ✅ Conservé (code existant préservé)
- Structure originale du formulaire
- Fonction d'envoi WhatsApp
- Design original

### ✨ Ajouté (nouvelles fonctionnalités)
- `app/utils/tarifs.ts` - Système de calcul
- `app/components/TarifsTable.tsx` - Tableau des tarifs
- `app/components/CalculatriceTarifs.tsx` - Calculatrice
- `app/tarifs/page.tsx` - Page tableau complet
- `TARIFS.md` - Documentation technique
- `README.md` - Ce fichier

### 🔄 Modifié (amélioration)
- `app/page.tsx` - Intégration du calcul automatique + design amélioré

## 🌐 Intégration avec le frontend

### Affichage du prix dynamique

```tsx
{depart && destination && (
  <div>
    <p>Route: {depart} → {destination}</p>
    <p>Prix: {formatPrix(calculerTarif(depart, destination))}</p>
  </div>
)}
```

### Validation avant envoi

```tsx
const prix = calculerTarif(depart, destination);
if (validerTarif(prix)) {
  // Envoyer via WhatsApp
  envoyerCommande();
} else {
  console.error("Tarif invalide");
}
```

## 📱 Responsive Design

- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

## 🔐 Sécurité

- ✅ Validation des quartiers
- ✅ Validation des tarifs
- ✅ Protection contre les tarifs invalides

## 🚀 Améliorations futures

- [ ] Tarifs différents selon l'heure (rush hours)
- [ ] Support de plus de quartiers
- [ ] API backend pour les tarifs
- [ ] Historique des commandes
- [ ] Intégration paiement (Stripe, etc.)
- [ ] Tracking en temps réel
- [ ] Système de notation

## 📞 Support

Pour toute question ou problème :

1. Vérifiez [TARIFS.md](./TARIFS.md)
2. Vérifiez la section Troubleshooting ci-dessus
3. Vérifiez les erreurs dans la console (`npm run dev`)

## 📄 Licence

Créé en Mai 2026 pour l'application de livraison Dakar

## ✨ Résumé des changements

| Aspect | Avant | Après |
|--------|-------|-------|
| Tarif | Statique (2000 FCFA) | Dynamique (1000-6000 FCFA) |
| Quartiers | Inputs texte | Selects avec liste |
| Design | Basique | Moderne style Uber |
| Affichage prix | Caché | Dynamique et visible |
| Documentation | Aucune | Complète (TARIFS.md) |
| Calculatrice | Aucune | Intégrée et réutilisable |
| Tableau tarifs | Aucun | Complet et interactif |

---

**Version** : 1.0
**Mise à jour** : Mai 2026
**Status** : ✅ Production-ready
