# Guide Complet - Authentification et Paramètres Livraison Pro

## 🎯 Vue d'ensemble

Ce guide explique comment utiliser le nouveau système d'authentification et de paramètres de Livraison Pro.

## 📋 Table des matières

1. [Installation et Configuration](#installation-et-configuration)
2. [Authentification](#authentification)
3. [Paramètres Utilisateur](#paramètres-utilisateur)
4. [Système Multilingue](#système-multilingue)
5. [Centre d'Aide](#centre-daide)
6. [Protection des Routes](#protection-des-routes)
7. [Déploiement](#déploiement)

---

## Installation et Configuration

### 1. Variables d'environnement

Assurez-vous que votre fichier `.env.local` contient:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Dependances Installes

```bash
npm install
```

Les packages suivants ont été ajoutés:
- `i18next` - Gestion multilingue
- `react-i18next` - Intégration React pour i18next
- Tous les packages Firebase existants

### 3. Démarrer l'Application

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

---

## Authentification

### Connexion

Les utilisateurs peuvent se connecter via:

#### 1. **Email + Mot de passe**
- Accédez à `/auth/login`
- Sélectionnez l'onglet "Email"
- Entrez votre email et mot de passe
- Cliquez sur "Se connecter"

#### 2. **Téléphone + Mot de passe**
- Accédez à `/auth/login`
- Sélectionnez l'onglet "Téléphone"
- Entrez votre numéro de téléphone et mot de passe
- Cliquez sur "Se connecter"

#### 3. **Google Sign-In**
- Accédez à `/auth/login`
- Sélectionnez l'onglet "Google"
- Cliquez sur "Se connecter avec Google"
- Complétez le processus Google

### Inscription

Les utilisateurs peuvent s'inscrire avec:

#### Option 1: Email
1. Accédez à `/auth/register`
2. Cliquez sur "S'inscrire avec Email"
3. Remplissez le formulaire (Nom, Email, Mot de passe)
4. Cliquez sur "S'inscrire"
5. Vérifiez votre email via le lien reçu

#### Option 2: Téléphone
1. Accédez à `/auth/register`
2. Cliquez sur "S'inscrire avec Téléphone"
3. Remplissez le formulaire (Nom, Téléphone, Mot de passe)
4. Cliquez sur "S'inscrire"
5. Entrez le code OTP à 6 chiffres reçu par SMS

### Vérification du Compte

#### Pour Email:
- Une page de vérification s'affiche après l'inscription
- Cliquez sur le lien de vérification dans l'email
- Le compte est activé après vérification

#### Pour Téléphone:
- Une page avec 6 cases de code s'affiche
- Entrez le code OTP reçu par SMS
- Le compte est activé après vérification

### Déconnexion

- Cliquez sur votre profil en haut à droite
- Sélectionnez "Se déconnecter"
- Vous serez redirigé vers la page d'accueil

---

## Paramètres Utilisateur

Accédez à `/settings` pour gérer vos paramètres.

### Onglet Profil
- **Modifier le nom**: Changez votre nom d'affichage
- **Modifier l'email**: Mettez à jour votre adresse email
- **Modifier le téléphone**: Changez votre numéro de téléphone
- **Photo de profil**: Téléchargez une nouvelle photo

### Onglet Sécurité
- **Changer le mot de passe**: Mettez à jour votre mot de passe
- Entrez votre mot de passe actuel
- Entrez le nouveau mot de passe
- Confirmez le nouveau mot de passe

### Onglet Langue
- Choisissez parmi 4 langues:
  - 🇫🇷 Français (par défaut)
  - 🇬🇧 English
  - 🇪🇸 Español
  - 🇸🇳 Wolof

---

## Système Multilingue

### Langues Supportées

1. **Français** - Langue par défaut
2. **English** - Anglais
3. **Español** - Espagnol
4. **Wolof** - Langue nationale du Sénégal

### Comment ça fonctionne

1. **Sélecteur de langue**: 
   - Disponible dans la navbar (coin supérieur droit)
   - Cliquez sur le code de langue (FR, EN, ES, WO)
   - Choisissez votre langue préférée

2. **Persistance**:
   - La langue est sauvegardée dans le profil utilisateur
   - La langue est restaurée automatiquement à la connexion

3. **Traductions**:
   - Tous les textes de l'application sont traduits
   - Incluant: navigation, formulaires, messages, etc.

### Ajouter une Nouvelle Langue

Pour ajouter une nouvelle langue:

1. Ouvrez `app/utils/translations.ts`
2. Ajoutez une nouvelle entrée de langue:
```typescript
pt: { // Portuguese
  nav: {
    login: "Entrar",
    // ...
  },
  // ...
}
```

3. Mettez à jour `app/store/language.ts` pour accepter le nouveau code

---

## Centre d'Aide

Accédez à `/help` pour accéder au centre d'aide.

### Contenu Disponible

#### 1. **Contact Direct**
- **WhatsApp**: Contactez-nous directement
- **Email**: Envoyez-nous vos questions
- **Téléphone**: Support 24/7

#### 2. **FAQ**
Questions fréquemment posées:
- Comment fonctionne le service?
- Quels sont les tarifs?
- Comment suivre une commande?
- Modes de paiement acceptés
- Gestion des problèmes

#### 3. **Documents Légaux**
- **Conditions d'Utilisation**: `/legal/terms`
- **Politique de Confidentialité**: `/legal/privacy`

---

## Structure des Fichiers

```
app/
├── auth/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── verify-email/page.tsx
│   └── verify-otp/page.tsx
├── settings/page.tsx
├── help/page.tsx
├── legal/
│   ├── terms/page.tsx
│   └── privacy/page.tsx
├── components/
│   ├── Navbar.tsx
│   └── LandingSection.tsx
├── hooks/
│   └── useTranslation.ts
├── store/
│   ├── auth.ts
│   └── language.ts
├── providers/
│   └── AuthProvider.tsx
└── utils/
    └── translations.ts
```

---

## Protection des Routes

### Routes Publiques
Ces routes n'requirent pas d'authentification:
- `/` - Page d'accueil
- `/auth/*` - Pages d'authentification
- `/help` - Centre d'aide
- `/legal/*` - Pages légales

### Routes Privées
Ces routes requirent une authentification:
- `/settings` - Paramètres utilisateur
- `/commander` - Créer une commande
- `/commands` - Historique des commandes
- `/track` - Suivi des livraisons
- `/admin` - Panel admin

### Vérification d'Authentification

Le système vérifie automatiquement:
1. Firebase Authentication pour l'utilisateur
2. Profil utilisateur dans Firestore
3. Session persistante

---

## Déploiement

### Sur Vercel

1. **Poussez vers GitHub**:
```bash
git add .
git commit -m "Complete authentication implementation"
git push origin main
```

2. **Déploiement Automatique**:
- Accédez à https://vercel.com
- Connectez votre repository GitHub
- Vercel déploiera automatiquement

3. **Variables d'Environnement sur Vercel**:
- Allez à "Settings" → "Environment Variables"
- Ajoutez toutes vos variables Firebase

4. **Test Post-Déploiement**:
- Testez la connexion/inscription
- Testez les différentes langues
- Testez la vérification email
- Testez le changement de paramètres

---

## Dépannage

### Problème: "Firebase Config Invalid"

**Solution**: 
- Vérifiez vos variables d'environnement Firebase
- Assurez-vous que les clés ne sont pas fictives
- Redémarrez le serveur de développement

### Problème: La langue ne change pas

**Solution**:
- Videz le cache du navigateur
- Vérifiez localStorage dans les DevTools
- Rechargez la page

### Problème: Impossible de se connecter

**Solution**:
- Vérifiez que Firebase Authentication est activée
- Vérifiez les logs Firebase Console
- Assurez-vous que le profil utilisateur existe dans Firestore

---

## Prochaines Étapes

1. **Tester Complètement**: Tester tous les scénarios d'authentification
2. **Améliorer la Sécurité**: Ajouter CSRF protection, rate limiting
3. **Intégrer SMS OTP**: Connecter un service SMS réel (Twilio, etc.)
4. **Analytics**: Ajouter le suivi des utilisateurs
5. **Notifications**: Implémenter les notifications par email/SMS

---

## Support

Pour toute question ou problème:
- 📧 Email: support@livraisonpro.com
- 💬 WhatsApp: +221 77 XXX XX XX
- 📱 Téléphone: +221 XX XXX XX XX

---

**Dernière mise à jour**: Juin 2026
**Version**: 1.0.0
