# 💡 Exemples d'utilisation - Système de tarifs

## 📌 Exemples simples

### 1. Calcul basique

```tsx
import { calculerTarif, formatPrix } from "@/app/utils/tarifs";

const prix = calculerTarif("Plateau", "Médina");
console.log(formatPrix(prix)); // "1 000 FCFA"
```

### 2. Affichage conditionnel

```tsx
{depart && destination && (
  <div>
    <p>Prix: {formatPrix(calculerTarif(depart, destination))}</p>
  </div>
)}
```

### 3. Validation

```tsx
import { validerTarif } from "@/app/utils/tarifs";

const prix = calculerTarif("Plateau", "Pikine");
if (validerTarif(prix)) {
  console.log("Tarif valide!");
} else {
  console.error("Tarif invalide!");
}
```

---

## 🎯 Exemples réalistes

### Exemple 1: Calcul avec logging

```tsx
import { 
  calculerTarif, 
  formatPrix, 
  getDescriptionRoute,
  QUARTIERS_DAKAR 
} from "@/app/utils/tarifs";

function calculerCommande(depart: string, destination: string) {
  const prix = calculerTarif(depart, destination);
  const description = getDescriptionRoute(depart, destination);
  
  console.log(`Trajet: ${description}`);
  console.log(`Tarif: ${formatPrix(prix)}`);
  
  return { prix, description };
}

// Utilisation
const commande = calculerCommande("Plateau", "Médina");
// Logs:
// "Trajet: Plateau → Médina"
// "Tarif: 1 000 FCFA"
```

### Exemple 2: Boucler sur les quartiers

```tsx
import { QUARTIERS_DAKAR, calculerTarif, formatPrix } from "@/app/utils/tarifs";

const depart = "Plateau";

console.log(`Tarifs au départ de ${depart}:\n`);

QUARTIERS_DAKAR.forEach((destination) => {
  if (destination !== depart) {
    const prix = calculerTarif(depart, destination);
    console.log(`  → ${destination}: ${formatPrix(prix)}`);
  }
});

// Logs:
// "Tarifs au départ de Plateau:
//   → Parcelles: 1 050 FCFA
//   → Médina: 1 000 FCFA
//   → Almadies: 2 500 FCFA
//   ..."
```

### Exemple 3: Afficher le tableau des tarifs en array

```tsx
import { QUARTIERS_DAKAR, calculerTarif, formatPrix } from "@/app/utils/tarifs";

function getTarifsArray() {
  const tarifs = [];
  
  for (let i = 0; i < QUARTIERS_DAKAR.length; i++) {
    for (let j = i + 1; j < QUARTIERS_DAKAR.length; j++) {
      const de = QUARTIERS_DAKAR[i];
      const vers = QUARTIERS_DAKAR[j];
      const prix = calculerTarif(de, vers);
      
      tarifs.push({
        de,
        vers,
        prix,
        prixFormaté: formatPrix(prix),
      });
    }
  }
  
  return tarifs;
}

const tarifs = getTarifsArray();
console.table(tarifs);
// Affiche un tableau avec toutes les combinaisons
```

### Exemple 4: Intégrer dans un formulaire React

```tsx
"use client";

import { useState } from "react";
import { 
  QUARTIERS_DAKAR, 
  calculerTarif, 
  formatPrix 
} from "@/app/utils/tarifs";

export default function FormulaireCommande() {
  const [depart, setDepart] = useState("");
  const [destination, setDestination] = useState("");
  const [telephone, setTelephone] = useState("");
  
  const prix = depart && destination ? calculerTarif(depart, destination) : 0;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `Commande livraison:
Téléphone: ${telephone}
De: ${depart}
Vers: ${destination}
Tarif: ${formatPrix(prix)}`;
    
    alert(message);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <select value={telephone} onChange={(e) => setTelephone(e.target.value)}>
        <option>Téléphone</option>
      </select>
      
      <select value={depart} onChange={(e) => setDepart(e.target.value)}>
        <option value="">Départ</option>
        {QUARTIERS_DAKAR.map(q => (
          <option key={q} value={q}>{q}</option>
        ))}
      </select>
      
      <select value={destination} onChange={(e) => setDestination(e.target.value)}>
        <option value="">Destination</option>
        {QUARTIERS_DAKAR.map(q => (
          <option key={q} value={q}>{q}</option>
        ))}
      </select>
      
      {prix > 0 && <p>Prix: {formatPrix(prix)}</p>}
      
      <button type="submit">Commander</button>
    </form>
  );
}
```

### Exemple 5: Créer un composant personnalisé

```tsx
"use client";

import { calculerTarif, formatPrix } from "@/app/utils/tarifs";

interface AffichagePrixProps {
  depart: string;
  destination: string;
  style?: "compact" | "large";
}

export function AffichagePrix({ 
  depart, 
  destination, 
  style = "compact" 
}: AffichagePrixProps) {
  const prix = calculerTarif(depart, destination);
  
  if (style === "compact") {
    return <span>{formatPrix(prix)}</span>;
  }
  
  return (
    <div style={{ 
      padding: "20px", 
      background: "#f0f0f0", 
      borderRadius: "8px",
      textAlign: "center"
    }}>
      <p>{depart} → {destination}</p>
      <h2>{formatPrix(prix)}</h2>
    </div>
  );
}

// Utilisation
<AffichagePrix depart="Plateau" destination="Médina" style="large" />
```

---

## 🔧 Exemples avancés

### Exemple 6: Ajouter un quartier

```tsx
// dans app/utils/tarifs.ts

// 1. Ajouter à la liste
export const QUARTIERS_DAKAR = [
  // ... quartiers existants ...
  "Dakar Plateau", // ← Nouveau
];

// 2. Ajouter les distances
const DISTANCES_MATRIX: Record<string, Record<string, number>> = {
  // ...
  "Dakar Plateau": {
    "Plateau": 5,
    "Parcelles": 4,
    "Médina": 6,
    // ... etc
  },
  // ...
};
```

### Exemple 7: Modifier la formule

```tsx
// Avant
let tarif = 500 + distance * 250;

// Après: formule progressive (moins cher pour long)
let tarif = 800 + distance * 150;

// Ou: tarif fixe par zone
if (distance < 5) tarif = 1200;
else if (distance < 10) tarif = 2000;
else if (distance < 15) tarif = 3500;
else tarif = 5000;
```

### Exemple 8: Cache de tarifs

```tsx
// Créer un cache si les tarifs changent souvent
const cacheT = new Map<string, number>();

function calculerTarifAvecCache(depart: string, destination: string): number {
  const key = `${depart}→${destination}`;
  
  if (cacheT.has(key)) {
    return cacheT.get(key)!;
  }
  
  const prix = calculerTarif(depart, destination);
  cacheT.set(key, prix);
  
  return prix;
}
```

### Exemple 9: API endpoint (futur)

```tsx
// app/api/tarif/route.ts
import { calculerTarif, validerTarif } from "@/app/utils/tarifs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const depart = searchParams.get("depart");
  const destination = searchParams.get("destination");
  
  if (!depart || !destination) {
    return Response.json({ error: "Paramètres manquants" }, { status: 400 });
  }
  
  const prix = calculerTarif(depart, destination);
  
  if (!validerTarif(prix)) {
    return Response.json({ error: "Tarif invalide" }, { status: 500 });
  }
  
  return Response.json({ depart, destination, prix });
}

// Utilisation:
// GET /api/tarif?depart=Plateau&destination=Médina
// Réponse: { depart: "Plateau", destination: "Médina", prix: 1000 }
```

### Exemple 10: Test unitaire

```tsx
import { calculerTarif, validerTarif, formatPrix } from "@/app/utils/tarifs";

describe("Système de tarifs", () => {
  it("Plateau → Médina = 1000", () => {
    const prix = calculerTarif("Plateau", "Médina");
    expect(prix).toBe(1000);
  });
  
  it("Pikine → Keur Massar = 2250", () => {
    const prix = calculerTarif("Pikine", "Keur Massar");
    expect(prix).toBe(2250);
  });
  
  it("Tarif valide entre 1000 et 6000", () => {
    const prix = calculerTarif("Plateau", "Almadies");
    expect(validerTarif(prix)).toBe(true);
  });
  
  it("formatPrix formate correctement", () => {
    const texte = formatPrix(1000);
    expect(texte).toBe("1 000 FCFA");
  });
});
```

---

## 🎨 Exemples de design

### Affichage du prix style Uber

```tsx
<div style={{
  background: "linear-gradient(135deg, #0f172a 0%, #1a2332 100%)",
  padding: "16px",
  borderRadius: "12px",
  border: "2px solid #22d3ee",
  textAlign: "center"
}}>
  <p style={{ color: "#94a3b8", fontSize: "12px" }}>Tarif estimé</p>
  <h1 style={{ color: "#fbbf24", fontSize: "32px", margin: "0" }}>
    {formatPrix(prix)}
  </h1>
</div>
```

### Sélecteur de quartier personnalisé

```tsx
<select style={{
  padding: "12px",
  borderRadius: "8px",
  border: "2px solid #334155",
  background: "#0f172a",
  color: "#ffffff",
  fontSize: "14px",
  cursor: "pointer"
}}>
  <option value="">Sélectionner...</option>
  {QUARTIERS_DAKAR.map(q => (
    <option key={q} value={q}>{q}</option>
  ))}
</select>
```

---

## 📊 Export des données

### Exporter en JSON

```tsx
import { QUARTIERS_DAKAR, calculerTarif, formatPrix } from "@/app/utils/tarifs";

function exportTarifsJSON() {
  const tarifs = QUARTIERS_DAKAR.flatMap((de, i) =>
    QUARTIERS_DAKAR.slice(i + 1).map((vers) => ({
      de,
      vers,
      prix: calculerTarif(de, vers),
      prixFormaté: formatPrix(calculerTarif(de, vers))
    }))
  );
  
  const json = JSON.stringify(tarifs, null, 2);
  
  // Télécharger le fichier
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tarifs-dakar.json";
  a.click();
}
```

### Exporter en CSV

```tsx
function exportTarifsCSV() {
  let csv = "De,Vers,Tarif (FCFA)\n";
  
  for (let i = 0; i < QUARTIERS_DAKAR.length; i++) {
    for (let j = i + 1; j < QUARTIERS_DAKAR.length; j++) {
      const de = QUARTIERS_DAKAR[i];
      const vers = QUARTIERS_DAKAR[j];
      const prix = calculerTarif(de, vers);
      csv += `${de},${vers},${prix}\n`;
    }
  }
  
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tarifs-dakar.csv";
  a.click();
}
```

---

## 🧪 Cas limites

### Même quartier (départ = destination)

```tsx
const prix = calculerTarif("Plateau", "Plateau");
console.log(prix); // 1000 (minimum)
```

### Quartier invalide

```tsx
const prix = calculerTarif("INVALIDE", "Plateau");
// Utilise la distance par défaut (10 km)
console.log(prix); // 2500
```

---

## 📱 React Hooks

### Custom hook

```tsx
function useTarif(depart: string, destination: string) {
  const prix = depart && destination 
    ? calculerTarif(depart, destination) 
    : 0;
  
  return {
    prix,
    prixFormaté: prix > 0 ? formatPrix(prix) : "N/A",
    estValide: validerTarif(prix),
  };
}

// Utilisation
export function MaCommande() {
  const [depart, setDepart] = useState("");
  const [destination, setDestination] = useState("");
  const { prix, prixFormaté, estValide } = useTarif(depart, destination);
  
  return (
    <div>
      <p>{prixFormaté}</p>
      {!estValide && <p style={{ color: "red" }}>Tarif invalide</p>}
    </div>
  );
}
```

---

Tous ces exemples utilisent le système de tarifs sans rien modifier au code existant!

**Questions?** Consultez [TARIFS.md](./TARIFS.md) ou [MIGRATION.md](./MIGRATION.md)
