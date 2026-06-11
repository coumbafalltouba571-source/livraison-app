# Guide de Déploiement des Règles Firestore

## Étape 1: Installer Firebase CLI (si pas déjà installé)

```bash
npm install -g firebase-tools
```

## Étape 2: Authentifier avec Firebase

```bash
firebase login
```

## Étape 3: Initialiser Firebase (si pas déjà fait)

```bash
firebase init
```

Sélectionnez "Firestore" quand demandé.

## Étape 4: Déployer les Règles Firestore

```bash
firebase deploy --only firestore:rules
```

## ⚠️ IMPORTANT - Règles Temporaires vs Production

### Règles Actuelles (Développement - Ouverte à tous)

Les règles actuelles dans `firestore.rules` permettent l'accès complet:

```
match /{document=**} {
  allow read, write: if true;
}
```

**Ne jamais utiliser en production!** 🔒

### Pour la Production

Remplacez par des règles sécurisées dans `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /commandes/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /livraisons/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /utilisateurs/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Puis déployez:

```bash
firebase deploy --only firestore:rules
```

## Vérification

1. Allez à [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet: `livraison-app`
3. Allez dans Firestore → Règles
4. Vérifiez que les règles sont bien déployées

## Collections Requises

Assurez-vous que les collections suivantes existent:

- ✅ `commandes` - Stocke les commandes de livraison
- ⚠️ `livraisons` - (Optionnel) Pour le suivi en temps réel
- ⚠️ `utilisateurs` - (Optionnel) Pour les profils utilisateurs

Ces collections se créent automatiquement lors du premier document ajouté.

## Dépannage

### Erreur: "Missing or insufficient permissions"

1. Vérifiez que les règles Firestore ont bien été déployées
2. Vérifiez que le `projectId` dans `firebase.ts` correspond à celui de Firebase Console
3. Attendez quelques secondes après le déploiement (les règles peuvent prendre du temps à se propager)
4. Vérifiez la console du navigateur pour les erreurs détaillées

### Erreur: "Project not found"

1. Vérifiez que `.firebaserc` contient le bon project ID
2. Vérifiez que le projet existe dans Firebase Console

## Documentation Complète

- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
