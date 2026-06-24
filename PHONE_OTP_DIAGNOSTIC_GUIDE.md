# 🔧 PHONE OTP DIAGNOSTIC & TROUBLESHOOTING GUIDE

**Version**: 1.0  
**Last Updated**: 24 Juin 2026  
**Status**: ✅ PRODUCTION-READY  

---

## 📋 Table des Matières

1. [Checklist Pre-Déploiement](#checklist-pre-déploiement)
2. [Configuration Firebase Requise](#configuration-firebase-requise)
3. [Erreurs Courantes & Solutions](#erreurs-courantes--solutions)
4. [Tests Détaillés](#tests-détaillés)
5. [Debugging Guide](#debugging-guide)
6. [Performance & Limites](#performance--limites)

---

## ✅ Checklist Pre-Déploiement

### Phase 1: Configuration Firebase

- [ ] **Phone Authentication activé**
  ```
  Firebase Console → Authentication → Sign-in method
  Provider: Phone
  Status: ✅ Enabled
  ```

- [ ] **Blaze Plan (Pay-as-you-go) activé**
  ```
  Project Settings → Billing
  Plan: Blaze (required for SMS)
  Credit card linked: ✅ YES
  ```

- [ ] **Domaines autorisés configurés**
  ```
  Firebase Console → Authentication → Settings
  Authorized domains:
  ✅ localhost:3000
  ✅ 127.0.0.1:3000
  ✅ livraison-app-5154a.firebaseapp.com
  ✅ *.vercel.app
  ```

- [ ] **reCAPTCHA v3 configuré**
  ```
  Firebase Console → Authentication → Settings
  reCAPTCHA Enterprise: ✅ Configured
  ```

### Phase 2: Code Deployment

- [ ] **Fichiers créés/modifiés**
  - [ ] ✅ `app/utils/phoneFormatter.ts` (NEW)
  - [ ] ✅ `app/store/auth.ts` (MODIFIED)
  - [ ] ✅ `app/auth/login/page.tsx` (MODIFIED)
  - [ ] ✅ `app/auth/register/page.tsx` (MODIFIED)

- [ ] **Build réussi**
  ```bash
  npm run build
  Status: ✅ Compiled successfully
  TypeScript Errors: ✅ 0
  ```

- [ ] **Commits et Push**
  ```bash
  git add .
  git commit -m "fix: complete phone OTP authentication"
  git push origin main
  ```

### Phase 3: Vérifications Post-Déploiement

- [ ] **Vercel deployment réussi**
  ```
  Status: ✅ Production
  URL: livraison-app-5154a.vercel.app
  ```

- [ ] **Tests en production**
  - [ ] Login page charge correctement
  - [ ] Phone tab affiche reCAPTCHA
  - [ ] Clic "Send" envoie SMS
  - [ ] Verify OTP page fonctionne
  - [ ] Authentification réussie après OTP

---

## 🔐 Configuration Firebase Requise

### 1. Authentication → Sign-in Method

**DOIT ÊTRE ACTIVÉ:**

```
☐ Phone
  - Status: 🟢 Enabled
  - Provider: Firebase Phone Authentication
  
☐ Email/Password (si désiré)
  - Status: 🟢 Enabled
  
☐ Google OAuth (si désiré)
  - Status: 🟢 Enabled
  - Configuration: Web client ID + secret
```

### 2. Authentication → Settings

**Authorized Domains (CRITIQUE):**

```
Must include AT LEAST these domains:

✅ localhost:3000          (local development)
✅ 127.0.0.1:3000          (local testing)
✅ livraison-app-5154a.firebaseapp.com  (Firebase Hosting)
✅ *.vercel.app             (Vercel deployments)

If custom domain, add:
✅ votredomaine.com
✅ www.votredomaine.com
```

**Sans ces domaines**:
```
❌ Error: "Authorization error"
❌ Error: "Operation not allowed"
❌ SMS ne sera JAMAIS envoyé
```

### 3. Project Settings → Billing

**IMPORTANT - BLAZE PLAN OBLIGATOIRE:**

```
❌ Spark Plan (Free)
   - Phone Authentication: ❌ NOT AVAILABLE
   - SMS SMS: ❌ NOT SUPPORTED
   - Cost: FREE (but limited features)

✅ Blaze Plan (Pay-as-you-go)
   - Phone Authentication: ✅ AVAILABLE
   - SMS SMS: ✅ SUPPORTED
   - Cost: ~$0.01 per SMS
   - Free quota: $200/month worth
```

**Activate Blaze Plan:**
```
1. Firebase Console → Project → Settings (gear icon)
2. Billing → Upgrade to Blaze
3. Add credit card
4. Confirm upgrade
```

### 4. reCAPTCHA Configuration

**Firebase automatically uses reCAPTCHA v3:**

```
You CANNOT opt-out. Firebase automatically:
- Verifies human activity before SMS
- Protects against spam/abuse
- Adds invisible reCAPTCHA to login
```

**What you MUST do:**

```
1. Create visible reCAPTCHA container in UI:
   <div id="recaptcha-container"></div>
   
2. This div MUST exist before sendOTP() is called

3. RecaptchaVerifier will render into this container
```

---

## 🐛 Erreurs Courantes & Solutions

### Erreur #1: "Invalid phone number provided"

**Code Erreur Firebase**:
```
auth/invalid-phone-number
```

**Causes Possibles**:

| Cause | Symptôme | Solution |
|-------|---------|----------|
| Format incorrect | Entré "0773629075" | ✅ Automatiquement convertis via `formatPhoneNumber()` |
| Pays incorrect | Entré "+33773629075" | ✅ Doit commencer par +221 (Sénégal) |
| Mauvais prefix | Entré "+2217736290" | ✅ Doit être +221 + 9 chiffres |
| Non-numérique | Entré "+221-77-362-9075" | ✅ Convertis via fonction |

**Solution**:

Le code utilise `formatPhoneNumber()` qui accepte:
```javascript
"773629075"          ✅ Local format
"77 36 29 075"       ✅ Local spaced
"+221773629075"      ✅ International
"221773629075"       ✅ Sans plus
"+221 77 36 29 075"  ✅ International spaced

Tous sont convertis à: "+221773629075"
```

**Debugging**:

```javascript
// Vérifier dans Console du navigateur:
console.log("Formatted phone:", formattedPhone);
console.log("Is valid Senegal:", isValidSenegalPhone(formattedPhone));
```

---

### Erreur #2: "reCAPTCHA container is not found"

**Code Erreur Firebase**:
```
ReCaptchaVerifier: reCAPTCHA container is either not found or 
already contains inner HTML.
```

**Causes Possibles**:

| Cause | Solution |
|-------|----------|
| Div #recaptcha-container n'existe pas | ✅ Ajouter `<div id="recaptcha-container" />` |
| Div existait mais a été supprimé | ✅ Ne pas supprimer pendant exécution |
| ID incorrect ("recaptcha" au lieu de "recaptcha-container") | ✅ Vérifier l'ID exact |
| Page n'a pas rendu le div | ✅ Vérifier hydratation Next.js |

**Solution - Code Correct**:

```tsx
// ✅ CORRECT
export default function LoginPage() {
  return (
    <div>
      <form>
        <input type="tel" placeholder="773629075" />
        
        {/* ✅ DOIT EXISTER */}
        <div id="recaptcha-container" className="mb-4"></div>
        
        <button type="submit">Send Verification Code</button>
      </form>
    </div>
  );
}
```

**Debugging**:

```javascript
// Dans Console du navigateur:
const div = document.getElementById('recaptcha-container');
console.log("reCAPTCHA container exists?", !!div);
console.log("Is div empty?", div?.innerHTML === "");
```

---

### Erreur #3: "auth/operation-not-allowed"

**Code Erreur Firebase**:
```
The user account has been disabled by an administrator.
```

**Causes Possibles**:

| Cause | Solution |
|-------|----------|
| Phone Auth pas activé dans Firebase | ✅ Aller Firebase Console → Enable Phone Auth |
| Blaze Plan pas activé | ✅ Upgrade à Blaze Plan (SMS nécessite paiement) |
| User créé mais disabled | ✅ Firebase Console → Utilisateurs → Enable user |
| Domaine non autorisé | ✅ Ajouter domaine à Authorized Domains |

**Solution**:

```
1. Firebase Console → Authentication → Sign-in method
2. Chercher "Phone"
3. Cliquer sur "Phone"
4. Mettre à ON/Enable
5. Sauvegarder

Si toujours une erreur:
- Vérifier Billing → Blaze Plan activé
- Vérifier Authorized Domains inclut votre domaine
```

---

### Erreur #4: "Too many requests from this IP address"

**Code Erreur Firebase**:
```
auth/too-many-requests
```

**Causes Possibles**:

| Cause | Solution |
|-------|----------|
| +5 tentatives d'OTP en 5 minutes | ✅ Attendre 5 minutes |
| Spam/abuse détecté | ✅ Attendre 24h |
| Numéro testé trop de fois | ✅ Utiliser numéro différent |

**Solution**:

```javascript
// Dans sendOTP(), on catch cette erreur:
if (error.code === 'auth/too-many-requests') {
  throw new Error("Too many attempts. Wait 5 minutes and try again.");
}

// Afficher à l'utilisateur:
console.error("❌ Too many requests - please wait 5 minutes");
```

---

### Erreur #5: "SMS not received"

**Symptoms**:
```
- SMS sent successfully (pas d'erreur Firebase)
- Mais SMS n'arrive pas sur le téléphone
```

**Causes Possibles**:

| Cause | Probabilité | Solution |
|-------|-------------|----------|
| Numéro au mauvais format | ⭐⭐⭐⭐⭐ | ✅ Utiliser `formatPhoneNumber()` |
| Blaze Plan pas vraiment activé | ⭐⭐⭐⭐⭐ | ✅ Vérifier Billing → vraiment activé? |
| Opérateur bloque SMS Firebase | ⭐⭐⭐ | ✅ Contacter support opérateur |
| Firebase SMS quota dépassé | ⭐⭐ | ✅ Vérifier quotas Firebase |
| Numéro sur liste noire | ⭐ | ✅ Utiliser numéro différent |

**Solution #1: Vérifier le Format**

```javascript
// Dans Console:
const phone = "773629075";
const formatted = formatPhoneNumber(phone);
console.log("Format correct?", formatted === "+221773629075");
// Doit être: true
```

**Solution #2: Vérifier Blaze Plan**

```
Firebase Console → Project Settings → Billing
Status doit être: "Blaze Plan"
Pas "Free (Spark Plan)"
```

**Solution #3: Vérifier Authorized Domains**

```
Si SMS envoyé depuis Vercel:
- Ajouter votre URL Vercel à Authorized Domains
- Format: *.vercel.app
- Puis essayer de nouveau
```

---

## 🧪 Tests Détaillés

### Test #1: Formatter Téléphone

**Code**:
```typescript
import { formatPhoneNumber, isValidSenegalPhone } from "@/app/utils/phoneFormatter";

// Test 1: Local format (9 chiffres)
const test1 = formatPhoneNumber("773629075");
console.assert(test1 === "+221773629075", "Local format failed");
console.log("✅ Local format: 773629075 → ", test1);

// Test 2: Local avec espaces
const test2 = formatPhoneNumber("77 36 29 075");
console.assert(test2 === "+221773629075", "Local spaced format failed");
console.log("✅ Local spaced: 77 36 29 075 → ", test2);

// Test 3: International format
const test3 = formatPhoneNumber("+221773629075");
console.assert(test3 === "+221773629075", "International format failed");
console.log("✅ International: +221773629075 → ", test3);

// Test 4: International sans plus
const test4 = formatPhoneNumber("221773629075");
console.assert(test4 === "+221773629075", "International no + format failed");
console.log("✅ International no +: 221773629075 → ", test4);

// Test 5: Validation
const valid = isValidSenegalPhone("+221773629075");
console.assert(valid === true, "Validation failed");
console.log("✅ Validation: +221773629075 is valid?", valid);

console.log("🎉 All formatter tests passed!");
```

**Expected Output**:
```
✅ Local format: 773629075 →  +221773629075
✅ Local spaced: 77 36 29 075 →  +221773629075
✅ International: +221773629075 →  +221773629075
✅ International no +: 221773629075 →  +221773629075
✅ Validation: +221773629075 is valid? true
🎉 All formatter tests passed!
```

---

### Test #2: sendOTP() Flow

**Setup**:
```
1. Ouvrir: http://localhost:3000/auth/login
2. Clicker sur tab "Phone"
3. Ouvrir DevTools → Console
```

**Test**:

```javascript
// Entrer numéro dans le champ
const phoneInput = document.querySelector('input[type="tel"]');
phoneInput.value = "773629075";

// Attendre que div reCAPTCHA soit rendu
setTimeout(() => {
  // Cliquer le bouton "Send"
  document.querySelector('button[type="submit"]').click();
  
  // Observer les logs console
  // 🔵 [PHONE] Original input: 773629075
  // 🔵 [PHONE] Extracted digits: 773629075
  // ✅ [PHONE] Formatted: +221773629075
  // ✅ [PHONE] Valid Senegal phone: +221773629075
  // 🔵 [OTP] Initializing reCAPTCHA...
  // ✅ [OTP] reCAPTCHA ready
  // 🔵 [OTP] Sending SMS...
  // ✅ [OTP] SMS sent successfully!
}, 100);
```

**Expected Console Output**:
```
🔵 [PHONE] Original input: 773629075
🔵 [PHONE] Extracted digits: 773629075
✅ [PHONE] Formatted: +221773629075
✅ [PHONE] Valid Senegal phone: +221773629075
🔵 [OTP] Initializing reCAPTCHA...
✅ [OTP] reCAPTCHA ready
🔵 [OTP] Sending SMS...
✅ [OTP] SMS sent successfully!
🔵 [REDIRECT] Going to /auth/verify-otp
```

---

### Test #3: verifyOTP() Flow

**Setup**:
```
1. Après Test #2, SMS est envoyé au numéro
2. Attendre 2-3 secondes pour que SMS arrive
3. Copier le code à 6 chiffres du SMS
4. Être automatiquement redirigé à /auth/verify-otp
```

**Test**:

```javascript
// Entrer le code du SMS
const otpInput = document.querySelector('input[placeholder*="000000"]');
otpInput.value = "123456";  // Remplacer par vrai code du SMS

// Attendre reCAPTCHA
setTimeout(() => {
  // Cliquer "Verify"
  document.querySelector('button[type="submit"]').click();
  
  // Observer les logs
  // 🔵 [OTP] Verifying OTP: 123456
  // ✅ [AUTH] User authenticated successfully!
  // 🔵 [REDIRECT] Going to /
}, 100);
```

**Expected Result**:
```
✅ Redirected to / (homepage)
✅ User appears as authenticated
✅ Can see "Logout" button (if authenticated)
```

---

## 🔍 Debugging Guide

### Enable Detailed Logging

**Dans Console du Navigateur**, run:

```javascript
// Afficher TOUS les logs Firebase
localStorage.setItem('debug', '*');

// Recharger la page
location.reload();

// Maintenant tous les logs vont s'afficher (y compris Firebase)
```

### Check reCAPTCHA Status

```javascript
// Dans Console:

// 1. Vérifier que le div existe
const container = document.getElementById('recaptcha-container');
console.log("Container exists?", !!container);

// 2. Vérifier le contenu
console.log("Container HTML:", container?.innerHTML);

// 3. Si vide, RecaptchaVerifier pas encore rendu
// Si contient <iframe>, récatpcha est rendu ✅
```

### Check Auth Store State

```javascript
// Dans Console:
import { useAuthStore } from "@/app/store/auth";

const store = useAuthStore.getState();
console.log("Auth state:", {
  isAuthenticated: store.isAuthenticated,
  user: store.user,
  confirmationResult: store.confirmationResult ? "EXISTS" : "NULL",
  recaptchaVerifier: store.recaptchaVerifier ? "EXISTS" : "NULL",
  error: store.error
});
```

### Firebase Error Codes Reference

```javascript
// Les erreurs courantes Firebase:

'auth/invalid-phone-number'      → Format téléphone incorrect
'auth/operation-not-allowed'     → Phone auth pas activé
'auth/too-many-requests'         → Trop de tentatives
'auth/invalid-verification-code' → Code OTP incorrect
'auth/session-expired'           → Session OTP expiré (> 10 min)
'auth/quota-exceeded'            → SMS quota dépassé
'auth/user-disabled'             → User compte disabled
'auth/network-error'             → Pas de connexion internet
```

---

## 📊 Performance & Limites

### Limites Firebase Phone Auth

| Limite | Valeur | Impact |
|--------|--------|--------|
| OTP Validity | 10 minutes | Code valide pendant 10 min |
| Max attempts | 5 par 5 min | Au-delà, wait 5 min |
| SMS Delivery | 30-60 sec | Délai normal SMS |
| Session Timeout | 1 heure | Après OTP, session 1h |
| Daily SMS Limit | 500 per project | Free tier limit |

### Coûts Firebase (Blaze Plan)

| Service | Coût | Notes |
|---------|------|-------|
| SMS SMS | $0.01 per SMS | Le plus cher |
| Phone Auth | FREE | Authentification gratuite |
| Firestore | $0.06 per 100k reads | Si stocké |
| Cloud Functions | $0.40 per 1M invocations | Si utilisé |

### Optimizations

```javascript
// ✅ GOOD: Réutiliser RecaptchaVerifier
let verifier = useAuthStore.getState().recaptchaVerifier;
if (!verifier) {
  verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    size: 'normal',
  });
}

// ❌ BAD: Créer nouvelle instance à chaque appel
const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  size: 'invisible',
});  // Creates conflict!

// ✅ GOOD: Vérifier format avant d'envoyer SMS
if (!isValidSenegalPhone(formattedPhone)) {
  throw new Error("Invalid format");  // Avoid SMS cost
}

// ❌ BAD: Envoyer SMS à chaque tentative
// Coûte $0.01 × 5 = $0.05 par user qui se trompe
```

---

## 🆘 Support & Resources

### Debug Checklist

- [ ] reCAPTCHA container existe? (`document.getElementById('recaptcha-container')`)
- [ ] Phone format correct? (Utilise `formatPhoneNumber()`)
- [ ] Blaze Plan activé? (Vérifier Firebase Billing)
- [ ] Domaine autorisé? (Ajouter à Authorized Domains)
- [ ] Phone Auth activé? (Vérifier Firebase Sign-in method)
- [ ] API key configurée? (Vérifier firebase.ts)

### Further Resources

- Firebase Phone Auth: https://firebase.google.com/docs/auth/web/phone-auth
- reCAPTCHA v3: https://cloud.google.com/recaptcha-enterprise/docs
- Senegal Phone Numbers: +221 + 9 digits
- Format Examples: +221773629075, +221774629075

---

**Last Updated**: 24 Juin 2026  
**Status**: ✅ PRODUCTION-READY  
**Next Steps**: Deploy to Vercel + Monitor errors
