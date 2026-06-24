# 🔄 AVANT/APRÈS - Changements de Code

## 1️⃣ IMPORTS

### AVANT ❌
```typescript
import { useEffect, useState, useCallback } from "react";
```

### APRÈS ✅
```typescript
import { useEffect, useState, useCallback, useRef } from "react";
// Ajout: useRef pour timeoutRef
```

---

## 2️⃣ ÉTAT PRINCIPAL

### AVANT ❌
```typescript
const [commands, setCommands] = useState<Command[]>([]);
const [loading, setLoading] = useState(true);  // Seulement true/false
const [error, setError] = useState("");
const [inputTelephone, setInputTelephone] = useState(telephone);
const [hasSearched, setHasSearched] = useState(!!telephone);
const [unsubscribers, setUnsubscribers] = useState<(() => void)[]>([]);
```

### APRÈS ✅
```typescript
// Type pour les états
type LoadingState = "idle" | "loading" | "success" | "error" | "no-commands";

const [commands, setCommands] = useState<Command[]>([]);
const [loadingState, setLoadingState] = useState<LoadingState>("idle");  // 5 états
const [error, setError] = useState("");
const [inputTelephone, setInputTelephone] = useState(telephone);
const [hasSearched, setHasSearched] = useState(!!telephone);
const [unsubscribers, setUnsubscribers] = useState<(() => void)[]>([]);
const timeoutRef = useRef<NodeJS.Timeout | null>(null);  // Nouveau!
```

---

## 3️⃣ NORMALISATION DES NUMÉROS

### AVANT ❌
```typescript
// Pas de normalisation
const clientCommands = await getCommandsByPhone(tel);
// Exact match seulement: "+221 77 123 45 67" ne trouve pas "+22177123456"
```

### APRÈS ✅
```typescript
// Normalisation complète
const normalizePhoneNumber = (phone: string): string => {
  let normalized = phone.replace(/[\s\-\(\)\+]/g, "");
  if (normalized.startsWith("00")) {
    normalized = "+" + normalized.slice(2);
  }
  console.log(`📱 Normalisation téléphone: "${phone}" → "${normalized}"`);
  return normalized;
};

// Utilisation
const normalizedPhone = normalizePhoneNumber(tel);
const clientCommands = await getCommandsByPhone(normalizedPhone);
```

---

## 4️⃣ TIMEOUT IMPLÉMENTATION

### AVANT ❌
```typescript
const loadClientCommands = useCallback(async (tel: string) => {
  setLoading(true);
  
  try {
    // Pas de timeout!
    const clientCommands = await getCommandsByPhone(tel);
    setCommands(clientCommands);
    // [BLOQUÉ ICI SI LE SERVEUR EST LENT] ❌
```

### APRÈS ✅
```typescript
const loadClientCommands = useCallback(async (tel: string) => {
  setLoadingState("loading");
  
  try {
    // Timeout 10 secondes
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutRef.current = setTimeout(() => {
        console.error("⏱️ TIMEOUT! Requête Firestore dépassée après 10 secondes");
        reject(new Error("Timeout: La requête a dépassé 10 secondes"));
      }, 10000);  // 10 secondes
    });

    const normalizedPhone = normalizePhoneNumber(tel);
    const loadPromise = getCommandsByPhone(normalizedPhone);
    
    // Race: qui arrive en premier?
    const clientCommands = await Promise.race([loadPromise, timeoutPromise]);
    
    // Annuler le timeout si succès
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
```

---

## 5️⃣ CLEANUP DES ABONNEMENTS

### AVANT ❌
```typescript
// Pas de fonction dédiée
setUnsubscribers(newUnsubscribers);

// Cleanup au démontage seulement
return () => {
  unsubscribers.forEach((unsub) => unsub());
};
```

### APRÈS ✅
```typescript
// Fonction réutilisable
const cleanupSubscriptions = useCallback(() => {
  console.log(`🧹 Nettoyage de ${unsubscribers.length} abonnements`);
  unsubscribers.forEach((unsub) => {
    try {
      unsub();
    } catch (err) {
      console.error("❌ Erreur lors du nettoyage d'un abonnement:", err);
    }
  });
  setUnsubscribers([]);
}, [unsubscribers]);

// Cleanup avant recherche
cleanupSubscriptions();

// Cleanup au démontage
return () => {
  cleanupSubscriptions();
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    console.log("🧹 Cleanup: timeout annulé au démontage");
  }
};
```

---

## 6️⃣ GESTION D'ERREURS

### AVANT ❌
```typescript
} catch (err) {
  console.error("Erreur:", err);
  setError("Erreur lors de la récupération des commandes");
} finally {
  setLoading(false);
}
```

### APRÈS ✅
```typescript
} catch (err) {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }

  console.error("❌ ERREUR COMPLÈTE lors du chargement:", err);
  
  let errorMessage = "Erreur lors de la récupération des commandes";

  if (err instanceof Error) {
    console.error(`   Message: ${err.message}`);
    console.error(`   Stack: ${err.stack}`);
    
    if (err.message.includes("Timeout")) {
      errorMessage = "Délai d'attente dépassé. Vérifiez votre connexion...";
    } else if (err.message.includes("permission-denied")) {
      errorMessage = "Erreur de permissions Firestore. Contactez le support.";
    } else if (err.message.includes("not-found")) {
      errorMessage = "Service indisponible. Réessayez plus tard.";
    } else if (err.message.includes("unauthenticated")) {
      errorMessage = "Erreur d'authentification Firestore.";
    } else {
      errorMessage = err.message;
    }
  }

  setError(errorMessage);
  setLoadingState("error");
}
```

---

## 7️⃣ LOGIQUE DE COMMANDES TROUVÉES

### AVANT ❌
```typescript
const clientCommands = await getCommandsByPhone(tel);
setCommands(clientCommands);

// Abonnements...
setUnsubscribers(newUnsubscribers);

if (clientCommands.length === 0) {
  setError("Aucune commande trouvée pour ce numéro");  // Affiché comme erreur ❌
}
```

### APRÈS ✅
```typescript
const clientCommands = await getCommandsByPhone(normalizedPhone);
setCommands(clientCommands);

// Vérifier s'il y a des commandes
if (clientCommands.length === 0) {
  console.log("ℹ️ Aucune commande trouvée pour ce numéro");
  setLoadingState("no-commands");  // État dédié! ✅
  return;  // Pas d'abonnements
}

// Abonnements seulement s'il y a des commandes
const newUnsubscribers: (() => void)[] = [];
clientCommands.forEach((cmd) => {
  if (cmd.id) {
    console.log(`📡 Abonnement à la commande: ${cmd.id}`);
    const unsubscribe = subscribeToCommand(cmd.id, (updatedCommand) => {
      if (updatedCommand) {
        console.log(`🔄 Commande mise à jour: ${updatedCommand.id}`);
        setCommands((prev) =>
          prev.map((c) => (c.id === updatedCommand.id ? updatedCommand : c))
        );
      }
    });
    newUnsubscribers.push(unsubscribe);
  }
});

setUnsubscribers(newUnsubscribers);
setLoadingState("success");  // Succès! ✅
```

---

## 8️⃣ RENDU CONDITIONNEL

### AVANT ❌
```typescript
{hasSearched && error && !loading && (
  <div>{error}</div>
)}

{loading && (
  <div>⏳ Chargement de vos commandes...</div>
)}

{!loading && hasSearched && commands.length > 0 && (
  <div>✅ Commandes...</div>
)}
```

### APRÈS ✅
```typescript
{/* État: Erreur */}
{isError && (
  <div>❌ {error}</div>
)}

{/* État: Chargement */}
{isLoading && (
  <div>
    <div>⏳</div>
    <p>Chargement de vos commandes...</p>
    <p>(Timeout après 10 secondes)</p>  {/* Nouveau! */}
  </div>
)}

{/* État: Aucune commande */}
{isNoCommands && (
  <div>
    <div>📦</div>
    <h2>Aucune commande trouvée</h2>
    <p>Nous n'avons trouvé aucune commande pour {inputTelephone}</p>
    <Link href="/">➕ Passer une commande</Link>
  </div>
)}

{/* État: Succès */}
{isSuccess && commands.length > 0 && (
  <div>✅ Commandes...</div>
)}
```

---

## 9️⃣ RESPONSIVE DESIGN

### AVANT ❌
```typescript
<h1 style={{
  fontSize: "32px",  // Fixe, trop gros sur mobile
  fontWeight: "900",
  color: "#1f2937",
}}/>

<div style={{
  display: "flex",
  gap: "12px",
  // Pas de wrapping sur mobile
}}/>

<div style={{
  display: "grid",
  gridTemplateColumns: "96px 1fr",  // Toujours 2 colonnes
  gap: "16px",
}}/>
```

### APRÈS ✅
```typescript
<h1 style={{
  fontSize: "clamp(24px, 5vw, 32px)",  // Fluide: 24px min, 32px max
  fontWeight: "900",
  color: "#1f2937",
}}/>

<div style={{
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",  // Wrapping sur mobile
  flexDirection: "row",
}}/>

<div style={{
  display: "grid",
  gridTemplateColumns: window.innerWidth < 640 ? "1fr" : "96px 1fr",  // Adaptatif
  gap: "16px",
}}/>
```

---

## 🔟 LOGS DE DÉBOGAGE

### AVANT ❌
```typescript
console.error("Erreur:", err);
// Pas assez d'info
```

### APRÈS ✅
```typescript
// Normalisation
console.log(`📱 Normalisation téléphone: "${phone}" → "${normalized}"`);

// Recherche
console.log(`🔍 Recherche des commandes pour: ${tel}`);

// Succès
console.log(`✅ ${clientCommands.length} commandes trouvées`);

// Abonnement
console.log(`📡 Abonnement à la commande: ${cmd.id}`);

// Mise à jour
console.log(`🔄 Commande mise à jour: ${updatedCommand.id}`);

// Timeout
console.error("⏱️ TIMEOUT! Requête Firestore dépassée après 10 secondes");

// Erreur complète
console.error("❌ ERREUR COMPLÈTE lors du chargement:", err);
console.error(`   Message: ${err.message}`);
console.error(`   Stack: ${err.stack}`);
console.error(`   Code: ${errorCode}`);

// Nettoyage
console.log(`🧹 Nettoyage de ${unsubscribers.length} abonnements`);
```

---

## Résumé des Changements

| Aspect | Avant | Après |
|--------|-------|-------|
| **Timeout** | Aucun ❌ | 10 sec ✅ |
| **États** | 2 ❌ | 5 ✅ |
| **Normalisation** | Non ❌ | Oui ✅ |
| **Aucune Commande** | Erreur ❌ | État dédié ✅ |
| **Mobile** | Pas de clamp ❌ | clamp() ✅ |
| **Logs** | Basiques ❌ | 10+ emojis ✅ |
| **Erreurs** | Génériques ❌ | Spécifiques ✅ |
| **Cleanup** | Au démontage ❌ | Systématique ✅ |

---

**Points clés**: 
- `Promise.race()` pour timeout
- `useRef` pour timeoutRef
- 5 states distincts
- Normalisation robuste
- Logs avec emojis
- Responsive avec clamp()
