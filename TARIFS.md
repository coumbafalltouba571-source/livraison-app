# 📊 Documentation du Système de Tarifs Intelligents

## Vue d'ensemble

Votre application de livraison à Dakar dispose d'un système de calcul de tarifs automatique et intelligent basé sur la distance entre les quartiers.

## Caractéristiques principales

✅ **Calcul automatique** : Les tarifs sont calculés dynamiquement selon le point de départ et la destination
✅ **Tarifs limités** : Minimum 1 000 FCFA, Maximum 6 000 FCFA
✅ **Basé sur la distance** : La formule tient compte de la distance réelle entre les quartiers
✅ **Tarifs arondis** : Arrondis à 50 FCFA pour plus de cohérence
✅ **Quartiers supportés** : 8 quartiers principaux de Dakar

## Quartiers disponibles

1. **Plateau** - Centre-ville
2. **Parcelles** - Zone résidentielle
3. **Médina** - Quartier populaire
4. **Almadies** - Zone nord
5. **Ouakam** - Banlieue nord
6. **Keur Massar** - Banlieue est
7. **Pikine** - Banlieue est
8. **Grand Yoff** - Banlieue sud-est

## Formule de calcul

```
tarif = max(1000, min(6000, 500 + (distance * 250)))
tarif = arrondir(tarif / 50) * 50
```

### Exemple de calcul :

**Plateau → Médina (distance 3 km)**
- Calcul brut : 500 + (3 × 250) = 1 250 FCFA
- Dans les limites : ✓ (> 1000 et < 6000)
- Arrondi à 50 : 1 250 FCFA
- **Résultat final : 1 000 FCFA** (tarif prédéfini)

## Tarifs de référence

| De | Vers | Distance | Tarif |
|---|---|---|---|
| Plateau | Médina | 3 km | 1 000 FCFA |
| Pikine | Keur Massar | 8 km | 2 250 FCFA |
| Keur Massar | Grand Yoff | 6 km | 4 200 FCFA |
| Plateau | Almadies | 8 km | 2 500 FCFA |
| Plateau | Pikine | 20 km | 5 500 FCFA |
| Pikine | Ouakam | 25 km | 6 000 FCFA |

## Fichiers du système

### 📁 Structure des fichiers

```
app/
├── utils/
│   └── tarifs.ts                    # 🔧 Logique de calcul des tarifs
├── components/
│   ├── TarifsTable.tsx              # 📊 Tableau complet des tarifs
│   └── CalculatriceTarifs.tsx       # 🧮 Calculatrice autonome
├── page.tsx                         # 🏠 Page principale (formulaire livraison)
└── globals.css
```

### 📄 Fichier : `app/utils/tarifs.ts`

**Exports principaux :**

```typescript
// Constantes
export const QUARTIERS_DAKAR: string[]

// Fonctions
export function calculerTarif(depart: string, destination: string): number
export function validerTarif(prix: number): boolean
export function formatPrix(prix: number): string
export function getDescriptionRoute(depart: string, destination: string): string
```

## Utilisation dans votre code

### Dans le composant principal

```tsx
import { calculerTarif, formatPrix, QUARTIERS_DAKAR } from "./utils/tarifs";

const [depart, setDepart] = useState("");
const [destination, setDestination] = useState("");

// Calcul automatique
const prix = depart && destination ? calculerTarif(depart, destination) : 0;

// Affichage formaté
<span>{formatPrix(prix)}</span>
```

### Réutiliser la calculatrice

```tsx
import CalculatriceTarifs from "./components/CalculatriceTarifs";

export default function MaPage() {
  return (
    <div>
      <CalculatriceTarifs />
    </div>
  );
}
```

### Afficher le tableau des tarifs

```tsx
import TarifsTable from "./components/TarifsTable";

export default function MaPage() {
  return (
    <div>
      <TarifsTable />
    </div>
  );
}
```

## Ajouter nouveaux quartiers

Pour ajouter un nouveau quartier :

1. **Mettez à jour `QUARTIERS_DAKAR`** dans `app/utils/tarifs.ts`
2. **Ajoutez la ligne et colonne** dans `DISTANCES_MATRIX`
3. **(Optionnel) Ajoutez des tarifs spécifiques** dans `TARIFS_SPECIFIQUES`

Exemple :

```typescript
export const QUARTIERS_DAKAR = [
  "Plateau",
  "Parcelles",
  "Médina",
  "Almadies",
  "Ouakam",
  "Keur Massar",
  "Pikine",
  "Grand Yoff",
  "NOUVEAU_QUARTIER", // ← Ajouter ici
];

const DISTANCES_MATRIX = {
  // ...
  "NOUVEAU_QUARTIER": {
    "Plateau": 18,
    "Parcelles": 17,
    // ... distances vers autres quartiers
  },
  // ...
};
```

## Modifiez les tarifs

### Modifier les limites min/max

Éditez la fonction `calculerTarif()` :

```typescript
export function calculerTarif(depart: string, destination: string): number {
  // ...
  let tarif = 500 + distance * 250;
  
  // Changer ces valeurs :
  tarif = Math.max(1500, Math.min(7000, tarif)); // New: min 1500, max 7000
  
  // ...
}
```

### Modifier la formule de base

```typescript
// Avant: let tarif = 500 + distance * 250;

// Après (exemple, moins cher):
let tarif = 300 + distance * 200;
```

### Ajouter/Modifier des tarifs spécifiques

```typescript
const TARIFS_SPECIFIQUES: Record<string, Record<string, number>> = {
  "Plateau": {
    "Médina": 1200,      // Modifier le prix
    "Parcelles": 800,    // Ajouter une nouvelle route
  },
  // ...
};
```

## Design et intégration

L'application utilise un design moderne inspiré d'Uber avec :

- 🎨 **Palette de couleurs** : Bleu cyan (#22d3ee), Jaune ambre (#fbbf24)
- 📱 **Responsive** : Adapté aux mobiles et desktop
- ⚡ **Interactions** : Hover effects, transitions fluides
- 🎯 **Accessibility** : Labels explicites, boutons désactivés si nécessaire

## Validation des tarifs

La fonction `validerTarif()` vérifie que le tarif est dans les limites :

```typescript
validerTarif(2500) // true
validerTarif(500)  // false (< 1000)
validerTarif(7000) // false (> 6000)
```

## Intégration WhatsApp

Les tarifs calculés sont automatiquement incluids dans le message WhatsApp :

```
Nouvelle commande 🚚

Téléphone: +221 77 XXX XX XX
Départ: Plateau
Destination: Médina
Prix: 1 000 FCFA
```

## Exemples complets

### Exemple 1 : Calcul simple

```typescript
const tarif = calculerTarif("Plateau", "Médina");
console.log(formatPrix(tarif)); // "1 000 FCFA"
```

### Exemple 2 : Validation avant envoi

```typescript
if (validerTarif(prix)) {
  window.open(`https://wa.me/...?text=${message}`, "_blank");
} else {
  alert("Tarif invalide!");
}
```

### Exemple 3 : Affichage conditionnel

```typescript
{depart && destination && (
  <div>
    <p>{getDescriptionRoute(depart, destination)}</p>
    <p>Tarif: {formatPrix(calculerTarif(depart, destination))}</p>
  </div>
)}
```

## Support et maintenance

- 🐛 **Bugs** : Vérifiez que les distances dans `DISTANCES_MATRIX` sont correctes
- 📈 **Amélioration** : Vous pouvez ajouter une matrice de trafic pour les heures de pointe
- 🌍 **Extension** : Le système peut être étendu à d'autres villes

## Notes importantes

⚠️ **Ne supprimez jamais** les fonctions existantes - elles sont utilisées dans le formulaire principal
⚠️ **Testez les calculs** après modification de la formule
⚠️ **Arrondissez toujours** les tarifs pour éviter les confusions
✅ **Tous les quartiers** doivent être dans `QUARTIERS_DAKAR` et `DISTANCES_MATRIX`

---

**Version** : 1.0
**Dernière mise à jour** : Mai 2026
**Créé par** : Système de livraison intelligent Dakar
