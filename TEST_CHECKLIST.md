# ✅ CHECKLIST DE TEST - SYSTÈME DE COMMANDES

## 🧪 TESTS CLIENT

### Création de Commande
- [ ] Accéder à la page landing `/`
- [ ] Voir le nouveau champ "📦 Description de la commande"
- [ ] Remplir un formulaire complet SANS description
  - [ ] Bouton "Commander" grisé/désactivé
- [ ] Remplir avec description
  - [ ] Bouton "Commander" activé
- [ ] Soumettre commande
  - [ ] Message "✅ Commande créée avec succès!"
  - [ ] Redirection WhatsApp
  - [ ] Description dans le message WhatsApp

### Vérification Firestore
- [ ] Accéder à Firebase Console → Firestore
- [ ] Vérifier collection "commandes"
- [ ] Confirmer chaque commande a le champ "description"
- [ ] Vérifier les statuts possibles

### Page Historique Client
- [ ] Aller sur `/commander/history`
- [ ] Voir formulaire "Numéro de téléphone"
- [ ] Entrer un téléphone **SANS** commande
  - [ ] Message: "Aucune commande trouvée"
- [ ] Entrer un téléphone AVEC commandes (celui juste créé)
  - [ ] Voir toutes les commandes
  - [ ] Voir description
  - [ ] Voir prix
  - [ ] Voir départ/destination
  - [ ] Voir date
  - [ ] Voir statut "En attente" (⏳)
- [ ] Vérifier que d'autres téléphones ne voient pas ces commandes

### Mise à Jour Temps Réel
- [ ] Ouvrir `/commander/history` dans 2 onglets
- [ ] Dans onglet 1: entrer téléphone et rechercher
- [ ] Dans onglet 2: aller sur `/admin` → code 8080
- [ ] Admin change le statut d'une commande
- [ ] Onglet 1: vérifier que le statut s'update AUTOMATIQUEMENT
  - [ ] Pas besoin de rafraîchir
  - [ ] Changement instantané

---

## 🧪 TESTS ADMIN

### Protection Admin
- [ ] Aller sur `/admin`
- [ ] Voir écran de déverrouillage
- [ ] Entrer code **incorrect** (ex: 1111)
  - [ ] Message erreur rouge
  - [ ] Rester bloqué
- [ ] Entrer code **correct** (8080)
  - [ ] Déblocage
  - [ ] Voir dashboard
- [ ] Rafraîchir la page
  - [ ] Rester déblocké (session)
- [ ] Ouvrir `/admin` dans un nouvel onglet
  - [ ] Demander le code à nouveau

### Dashboard Admin - Vue Tableau
- [ ] Voir boutons "📊 Tableau" et "🃏 Cartes"
- [ ] Cliquer sur "📊 Tableau"
  - [ ] Affichage tableau
- [ ] Vérifier toutes les colonnes:
  - [ ] #ID
  - [ ] Nom Client
  - [ ] Téléphone
  - [ ] Départ
  - [ ] Destination
  - [ ] 💰 Prix
  - [ ] Statut
  - [ ] Date
  - [ ] Actions (Détails)

### Section Détails Expandable
- [ ] Cliquer "▶ Détails" sur une commande
  - [ ] Ligne s'expand
  - [ ] Voir 📦 Description complète (textarea)
  - [ ] Voir boutons de statut
- [ ] Cliquer à nouveau
  - [ ] Ligne collapse
  - [ ] Description cachée

### Changement de Statut
- [ ] Expand une commande
- [ ] Voir tous les statuts possibles:
  - [ ] ⏳ En attente
  - [ ] ✅ Confirmée
  - [ ] 🔄 En cours de traitement
  - [ ] 🚚 En livraison
  - [ ] 📦 Livrée
  - [ ] ❌ Annulée
- [ ] Cliquer sur un statut
  - [ ] Bouton devient aller/retour
  - [ ] Status se met à jour dans le tableau
- [ ] Ouvrir `/commander/history` client
  - [ ] Vérifier que le statut est à jour

### Vue Cartes
- [ ] Cliquer "🃏 Cartes"
  - [ ] Affichage cartes
  - [ ] Chaque commande sur une carte
- [ ] Cliquer sur une carte pour voir détails
- [ ] Changer statut depuis carte
  - [ ] Mise à jour

### Filtrage par Statut
- [ ] Cliquer "Tous"
  - [ ] Afficher toutes les commandes
- [ ] Cliquer "En attente"
  - [ ] Afficher uniquement statut "En attente"
- [ ] Tester autres filtres
  - [ ] Chaque filtre fonctionne

---

## 🧪 TESTS STATUTS

### Nouveaux Statuts
- [ ] Vérifier 6 statuts disponibles:
  1. ⏳ En attente
  2. ✅ Confirmée
  3. 🔄 En cours de traitement
  4. 🚚 En livraison
  5. 📦 Livrée
  6. ❌ Annulée
- [ ] Chaque statut a couleur distincte
- [ ] Chaque statut a emoji

### Workflow Complet
- [ ] Créer commande → statut "En attente" ⏳
- [ ] Admin change → "Confirmée" ✅
- [ ] Admin change → "En cours de traitement" 🔄
- [ ] Admin change → "En livraison" 🚚
- [ ] Admin change → "Livrée" 📦
- [ ] Client voit toutes les transitions en temps réel

---

## 🧪 TESTS FONCTIONNALITÉS EXISTANTES

### Design (pas modifié)
- [ ] Page landing intact
- [ ] Sections toutes présentes
- [ ] Couleurs gradient conservées
- [ ] Responsive mobile/tablet/desktop

### Carte GPS (pas modifiée)
- [ ] Carte visible dans la landing
- [ ] Quartiers affichés
- [ ] Interactivité fonctionne

### Paiements (pas modifiés)
- [ ] Boutons paiement visibles
- [ ] Wave, Orange Money, Cash, Carte disponibles

### Autres sections
- [ ] Services Section intact
- [ ] How It Works intact
- [ ] Advantages intact
- [ ] Footer intact

---

## 🧪 TESTS DE SÉCURITÉ

### Isolation des données
- [ ] Client A créé commande avec tél: 77111111
- [ ] Client B va sur `/commander/history`
- [ ] Client B entre tél: 77222222
  - [ ] Voir uniquement ses commandes
  - [ ] NE PAS voir les commandes de Client A
- [ ] Test avec 3+ clients différents

### Protection Admin
- [ ] Page `/admin` demande code
- [ ] Sans code correct: accès refusé
- [ ] Avec code correct: accès accordé
- [ ] Code changeable en production

---

## 🧪 TESTS DE PERFORMANCE

### Chargement
- [ ] Tableau charge rapidement (< 3s)
- [ ] 100+ commandes chargent sans ralentir
- [ ] Filtrage instantané
- [ ] Recherche (historique) rapide

### Temps réel
- [ ] Update statut visible < 1s
- [ ] Pas de lag
- [ ] Sync Firestore stable

---

## 🎯 RÉSUMÉ FINAL

**Total de tests:** 50+

**Avant de déployer en production:**
- [ ] Tous les tests ✅ passent
- [ ] Pas d'erreurs console
- [ ] Changer code admin (pas 8080)
- [ ] Vérifier Firestore rules
- [ ] Vérifier Firebase config

**Status:** ⏳ En attente de test complet
