# 🔧 Guide d'Implémentation reCAPTCHA et Phone OTP

**Version**: Firebase Auth v2.0  
**Date**: 24 Juin 2026

---

## 📝 Changements à Apporter

### 1. **Ajouter reCAPTCHA au HTML**

Dans les pages qui utilisent Phone Authentication, ajouter ce div:

```html
<!-- Conteneur pour reCAPTCHA visible -->
<div id="recaptcha-container" className="mb-4"></div>

<!-- Conteneur pour reCAPTCHA invisible (pour OTP) -->
<div id="recaptcha-invisible"></div>
```

### 2. **Initialiser reCAPTCHA au montage du composant**

```typescript
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/app/store/auth';

export default function LoginPage() {
  const { initializeRecaptcha } = useAuthStore();

  useEffect(() => {
    // Initialiser reCAPTCHA au montage
    initializeRecaptcha('recaptcha-container');
  }, [initializeRecaptcha]);

  // ... reste du composant
}
```

### 3. **Modifier handlePhoneLogin pour utiliser sendOTP**

```typescript
const handlePhoneLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLocalError("");

  if (!phone) {
    setLocalError(t("common.required", "Required field"));
    return;
  }

  try {
    // Envoyer l'OTP au numéro de téléphone
    await sendOTP(phone);
    
    // Rediriger vers la page de vérification du OTP
    router.push("/auth/verify-otp");
  } catch (err: any) {
    setLocalError(err.message || "Failed to send OTP");
  }
};
```

### 4. **Modifier handlePhoneRegister pour utiliser sendOTP**

```typescript
const handlePhoneRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setLocalError("");

  if (!phone || !displayName) {
    setLocalError(t("common.required", "Required field"));
    return;
  }

  try {
    // Envoyer l'OTP au numéro de téléphone
    await sendOTP(phone);
    
    // Stocker le numéro et le nom d'affichage temporairement
    sessionStorage.setItem('pendingPhone', phone);
    sessionStorage.setItem('pendingDisplayName', displayName);
    
    // Rediriger vers la page de vérification du OTP
    router.push("/auth/verify-otp");
  } catch (err: any) {
    setLocalError(err.message || "Failed to send OTP");
  }
};
```

### 5. **Modifier verify-otp page pour confirmer le OTP**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/store/auth';

export default function VerifyOTPPage() {
  const { verifyOTP, isLoading, error } = useAuthStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleVerify = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    try {
      // Vérifier le OTP
      await verifyOTP(otpString);
      
      // Succès - l'utilisateur sera redirigé automatiquement
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    }
  };

  // ... reste du composant
}
```

### 6. **Activer Google Sign-In sur Android**

```typescript
import { signInWithRedirect } from 'firebase/auth';

const handleGoogleLogin = async () => {
  setLocalError("");
  try {
    const userAgent = typeof navigator !== 'undefined' 
      ? navigator.userAgent 
      : '';

    if (userAgent.includes('Android')) {
      // Utiliser redirect pour Android
      await signInWithRedirect(auth, new GoogleAuthProvider());
    } else {
      // Utiliser popup pour desktop/iOS
      await signInWithGoogle();
    }
    
    router.push("/");
  } catch (err: any) {
    setLocalError(err.message);
  }
};
```

---

## 🧪 Checklist d'Implémentation

### Login Page (`/auth/login/page.tsx`)
```
☐ Ajouter <div id="recaptcha-container" />
☐ Ajouter useEffect(() => initializeRecaptcha())
☐ Modifier handlePhoneLogin pour utiliser sendOTP()
☐ Ajouter redirect vers /auth/verify-otp après OTP
☐ Améliorer handleGoogleLogin avec signInWithRedirect
☐ Tester localement
```

### Register Page (`/auth/register/page.tsx`)
```
☐ Ajouter <div id="recaptcha-container" />
☐ Ajouter useEffect(() => initializeRecaptcha())
☐ Modifier handlePhoneRegister pour utiliser sendOTP()
☐ Stocker données temporaires dans sessionStorage
☐ Ajouter redirect vers /auth/verify-otp après OTP
☐ Tester localement
```

### Verify OTP Page (`/auth/verify-otp/page.tsx`)
```
☐ Utiliser verifyOTP() du store
☐ Afficher message de succès
☐ Rediriger vers / après succès
☐ Afficher erreur si OTP invalide
☐ Ajouter bouton "Renvoyer le code"
☐ Tester localement
```

---

## 🔍 Diagnostic des Erreurs

### Erreur: "reCAPTCHA container is either not found or already contains inner HTML"

**Cause**: Le div `recaptcha-container` n'existe pas ou est vide

**Solution**:
```html
<!-- S'assurer que ce div existe dans le JSX -->
<div id="recaptcha-container" className="mb-4"></div>
```

### Erreur: "The user hasn't granted the app permission to use their Google account"

**Cause**: Domaine non autorisé dans Firebase Console

**Solution**:
```
1. Firebase Console → Authentication → Settings
2. Ajouter domaines autorisés:
   - localhost:3000
   - 127.0.0.1:3000
   - votre-domaine-vercel.app
3. Sauvegarder et attendre quelques secondes
```

### Erreur: "No OTP confirmation result available"

**Cause**: sendOTP() n'a pas été appelé ou reCAPTCHA n'est pas vérifié

**Solution**:
```typescript
// S'assurer que sendOTP est appelé avant verifyOTP
await sendOTP(phoneNumber);  // ← Doit être appelé d'abord
await verifyOTP(code);       // ← Ensuite vérifier
```

### Erreur: "SMS OTP not received"

**Cause Possible**:
1. Firebase SMS service non activé
2. Numéro au mauvais format (doit être +221XXXXXXXXX)
3. Abonnement Firebase insuffisant (Blaze plan requis)
4. Émulateur Android (SMS non supporté)

**Solution**:
```typescript
// Vérifier format du numéro
const phoneNumber = "+221" + phone.replace(/\D/g, "");
console.log("Sending OTP to:", phoneNumber);

// Vérifier logs dans Firebase Console → Authentication
```

---

## 📱 Support Android

### Problème: Pop-up Google Sign-In Bloquée sur Android

**Cause**: Webview Android ne supporte pas les pop-ups

**Solution Implémentée**:
```typescript
// Détection automatique Android
if (userAgent.includes('Android')) {
  await signInWithRedirect(auth, provider);
} else {
  await signInWithPopup(auth, provider);
}
```

### Problème: SMS OTP Non Envoyé sur Android

**Cause**: Limitation Firebase ou réseau

**Solution**:
1. Utiliser un vrai appareil (pas d'émulateur)
2. Avoir un abonnement Firebase Blaze (pay-as-you-go)
3. Tester avec un vrai numéro Sénégal (+221)

---

## 📊 Logs Attendus

### Console Navigateur - Google Sign-In

```
🔵 [AUTH] Initiating Google Sign-In...
✅ [AUTH] Google Sign-In successful: user@gmail.com
```

### Console Navigateur - Phone OTP

```
🔵 [OTP] Sending OTP to: +221XXXXXXXXX
🔵 [RECAPTCHA] Initializing reCAPTCHA...
✅ [RECAPTCHA] RecaptchaVerifier created successfully
✅ [OTP] OTP sent successfully to: +221XXXXXXXXX
🔵 [OTP] Verifying OTP code...
✅ [OTP] OTP verified successfully
```

### Console Navigateur - Erreurs

```
❌ [AUTH] Google Sign-In error: auth/popup-blocked "Pop-up was blocked"
❌ [OTP] Failed to send OTP: auth/invalid-phone-number "Invalid phone number"
❌ [RECAPTCHA] Failed to initialize RecaptchaVerifier: "Container element not found"
```

---

## 🚀 Étapes Suivantes

1. ✅ **Corriger firebase.ts** - FAIT
2. ✅ **Corriger app/store/auth.ts** - FAIT
3. ⏳ **Mettre à jour login page** - À FAIRE
4. ⏳ **Mettre à jour register page** - À FAIRE
5. ⏳ **Tester localement** - À FAIRE
6. ⏳ **Commit et push** - À FAIRE
7. ⏳ **Déployer sur Vercel** - À FAIRE

---

## 📞 Support

Pour toute erreur:
1. Ouvrir console navigateur (F12)
2. Vérifier les logs rouges et bleus
3. Copier l'erreur exacte
4. Vérifier Firebase Console pour les permissions

**Tous les changements sont rétro-compatibles et ne cassent rien d'existant.**
