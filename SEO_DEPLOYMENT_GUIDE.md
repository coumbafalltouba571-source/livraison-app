# 🚀 GUIDE DE DÉPLOIEMENT - AMÉLIORATIONS SEO

**Date:** 2026-06-23  
**Version:** 1.0  
**Statut:** ✅ Production Ready

---

## 📋 Pré-Déploiement (AVANT de mettre en production)

### Étape 1: Mettre à Jour les Coordonnées

**Fichier:** `app/layout.tsx` (Ligne 50-70)

Recherchez et remplacez :

```typescript
// ❌ AVANT
"telephone": "+221 77 XXX XXXX",
"email": "contact@livraisonpro-senegal.com",

// ✅ APRÈS
"telephone": "+221 77 XXX XXXX",  // Votre numéro réel
"email": "votre-email@livraisonpro.com",  // Votre email réel
```

**Réseaux Sociaux** :
```typescript
"sameAs": [
  "https://www.facebook.com/votre-page",     // ✅ METTEZ À JOUR
  "https://www.instagram.com/votre-compte",  // ✅ METTEZ À JOUR
  "https://wa.me/221XXXXXXXXX"               // ✅ METTEZ À JOUR
]
```

### Étape 2: Vérifier l'URL du Domaine

**Fichier:** `app/layout.tsx`

```typescript
// Ligne 20
metadataBase: new URL("https://livraisonpro-senegal.com"),

// Ligne 24
canonical: "https://livraisonpro-senegal.com",

// Ligne 31
url: "https://livraisonpro-senegal.com",

// Ligne 42
url: "https://livraisonpro-senegal.com/logo2_app.png",
```

⚠️ **Remplacez `livraisonpro-senegal.com` par votre vrai domaine si différent**

### Étape 3: Vérifier les Images

Assurez-vous que le fichier `public/logo2_app.png` existe.

**Commande :**
```bash
ls -la public/logo2_app.png
```

### Étape 4: Tester Localement

```bash
# 1. Arrêter tout serveur existant
# Ctrl+C

# 2. Supprimer les anciens fichiers de build
rm -r .next/

# 3. Réinstaller les dépendances (si nécessaire)
npm install

# 4. Compiler en production
npm run build

# 5. Vérifier les logs pour les erreurs
# Cherchez "✓ Compiled successfully"
```

**Résultat attendu:**
```
✓ Compiled successfully in XX.Xs
✓ Finished TypeScript in XXs
✓ Generating static pages
✓ Finalizing page optimization
```

### Étape 5: Vérifier les Fichiers SEO

```bash
# Tester les routes SEO
curl http://localhost:3000/robots.txt
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/icon
curl http://localhost:3000/opengraph-image
```

**Résultat attendu:**
- ✅ robots.txt (contenu texte)
- ✅ sitemap.xml (contenu XML)
- ✅ icon (image PNG)
- ✅ opengraph-image (image PNG)

---

## 🌍 Déploiement (Après tests locaux)

### Option 1: Vercel (Recommandé pour Next.js)

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Se connecter à Vercel
vercel login

# 3. Déployer
vercel --prod
```

### Option 2: Autres Plateformes

- **Netlify:** Push sur GitHub, Netlify auto-déploie
- **Railway:** `railway up`
- **Heroku:** `git push heroku main`
- **Votre serveur personnalisé:** `npm start`

---

## ✅ Post-Déploiement (APRÈS mise en production)

### Étape 1: Vérifier l'Accessibilité

```bash
# Tester les routes SEO en production
curl https://votre-domaine.com/robots.txt
curl https://votre-domaine.com/sitemap.xml
curl https://votre-domaine.com/icon

# Ou utilisez un navigateur :
# https://votre-domaine.com/robots.txt
# https://votre-domaine.com/sitemap.xml
# https://votre-domaine.com/icon
```

### Étape 2: Configurer Google Search Console

1. **Allez sur:** https://search.google.com/search-console
2. **Cliquez "Ajouter une propriété"**
3. **Entrez votre domaine:** https://votre-domaine.com
4. **Vérifiez la propriété** (par DNS, HTML, Google Analytics, etc.)
5. **Attendez la vérification** (quelques minutes)

### Étape 3: Soumettre le Sitemap

1. **Dans Google Search Console**
2. **Allez à "Sitemap"** (menu gauche)
3. **Cliquez "Ajouter/Tester un sitemap"**
4. **Entrez:** `https://votre-domaine.com/sitemap.xml`
5. **Cliquez "Envoyer"**

**Résultat attendu:**
```
Statut: VALIDE ✅
Pages trouvées: 7
Dernière soumission: Aujourd'hui
```

### Étape 4: Vérifier les Données Structurées

1. **Dans Google Search Console**
2. **Allez à "Résultats enrichis"** (menu gauche)
3. **Cherchez "LocalBusiness"**
4. **Vérifiez l'état:** ✅ Valide

**Outil alternatif:**
```
https://validator.schema.org/
```
Collez le contenu de : `https://votre-domaine.com/opengraph-image`

### Étape 5: Tester les Métadonnées avec Facebook

1. **Allez sur:** https://developers.facebook.com/tools/debug/
2. **Entrez votre URL:** https://votre-domaine.com
3. **Cliquez "Déboguer"**

**Résultat attendu:**
- ✅ og:title affiché
- ✅ og:description affichée
- ✅ og:image affichée
- ✅ Pas d'avertissements

### Étape 6: Attendre l'Indexation

Google indexe généralement :
- **Pages principales:** 1-3 jours
- **Toutes les pages:** 2-7 jours
- **Rich Snippets:** 2-4 semaines

**Vérifier l'indexation:**
```
site:votre-domaine.com
```
Entrez dans Google Search (il faut être connecté)

### Étape 7: Analyser les Résultats

**Après 2-4 semaines:**

1. **Google Search Console → Performance**
   - Vérifier les clics organiques
   - Vérifier les impressions
   - Vérifier le CTR

2. **Google Analytics 4 → Organic Search**
   - Vérifier le trafic organique
   - Vérifier les conversions

3. **Monitorer les classements**
   - Utilisez: https://www.semrush.com/ ou https://www.ahrefs.com/
   - Suivre les mots-clés localisés

---

## 📊 Tableau de Bord Recommandé

### Outils à Configurer

| Outil | URL | Fonction |
|-------|-----|----------|
| Google Search Console | https://search.google.com/search-console | Indexation, erreurs |
| Google Analytics 4 | https://analytics.google.com/ | Trafic, conversions |
| PageSpeed Insights | https://pagespeed.web.dev/ | Performance |
| Semrush | https://www.semrush.com/ | Classements, concurrence |
| Screaming Frog | https://www.screamingfrog.co.uk/ | Audit SEO |

---

## 🔧 Maintenance Régulière

### Chaque Semaine
- [ ] Vérifier Google Search Console pour erreurs
- [ ] Vérifier les statistiques d'indexation
- [ ] Vérifier le trafic organique

### Chaque Mois
- [ ] Analyser les résultats de recherche
- [ ] Vérifier les classements pour mots-clés
- [ ] Vérifier les liens brisés
- [ ] Mettre à jour le contenu si nécessaire

### Tous les Trimestres
- [ ] Audit SEO complet
- [ ] Vérifier la concurrence
- [ ] Optimiser les images
- [ ] Mettre à jour le sitemap si nouvelles pages

---

## 📝 Checklist Final

### Avant Déploiement
- [ ] Mettre à jour coordonnées
- [ ] Vérifier l'URL du domaine
- [ ] Vérifier les images
- [ ] Compilation réussie (`npm run build`)
- [ ] Tests locaux passés

### Après Déploiement
- [ ] Routes SEO accessibles
- [ ] Google Search Console configurée
- [ ] Sitemap soumis
- [ ] Données structurées vérifiées
- [ ] Facebook Debugger testé
- [ ] Indexation vérifiée après 3 jours

### Maintenance Continue
- [ ] Suivre les performances
- [ ] Analyser les résultats
- [ ] Mettre à jour le contenu
- [ ] Vérifier les erreurs
- [ ] Optimiser les mots-clés

---

## 🆘 Troubleshooting

### Problème: "Robots.txt not found"
**Solution:** Vérifier que `/public/robots.txt` existe OU que `app/robots.ts` compile correctement
```bash
npm run build
```

### Problème: "Sitemap not found"
**Solution:** Vérifier que `app/sitemap.ts` compile correctement
```bash
npm run build
```

### Problème: "Open Graph image not showing"
**Solution:** Vérifier que `app/opengraph-image.tsx` compile et que metadataBase est configurée

### Problème: "Not indexed by Google"
**Solution:** 
1. Vérifier robots.txt (doit avoir `Allow: /`)
2. Vérifier Google Search Console pour erreurs
3. Soumettre le sitemap
4. Attendre 5-7 jours

### Problème: "LocalBusiness not recognized"
**Solution:** Valider le JSON-LD avec https://validator.schema.org/

---

## 📞 Ressources Utiles

- **Next.js Metadata API:** https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- **Google SEO Starter Guide:** https://developers.google.com/search/docs/beginner/seo-starter-guide
- **Schema.org LocalBusiness:** https://schema.org/LocalBusiness
- **Open Graph Protocol:** https://ogp.me/
- **Twitter Card Documentation:** https://developer.twitter.com/en/docs/twitter-for-websites/cards

---

## ✨ Résumé

```
1. ✅ Préparer (coordonnées, domaine, images)
2. ✅ Tester localement (npm run build)
3. ✅ Déployer en production
4. ✅ Configurer Google Search Console
5. ✅ Soumettre le sitemap
6. ✅ Attendre l'indexation
7. ✅ Analyser les résultats
8. ✅ Optimiser continuellement
```

---

**🎉 Vous êtes prêt à déployer vos améliorations SEO !**

En cas de questions, consultez la documentation :
- [SEO_IMPROVEMENTS.md](SEO_IMPROVEMENTS.md) - Guide détaillé
- [SEO_VERIFICATION.md](SEO_VERIFICATION.md) - Instructions de test
- [SEO_HTML_EXAMPLE.md](SEO_HTML_EXAMPLE.md) - Exemple HTML

Bonne chance pour le classement Google ! 🚀
