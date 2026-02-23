# PROMPT — Créer un portfolio GitHub Pages avec panneau admin

> Copiez ce document, remplissez les sections **QUESTIONNAIRE** et **CANEVAS**, puis envoyez le tout à une IA (Claude, ChatGPT, etc.).
> Le système sera identique à ce portfolio : thème sombre tech, admin panel, publication GitHub intégrée.

---

## INSTRUCTIONS POUR L'IA

Tu vas créer un portfolio professionnel complet avec panneau d'administration, basé sur le système déjà développé pour TOUDJI Kokouvi Édouard (dépôt de référence : `ashbornarise/TOUDZI-Edouard`).

**Architecture à reproduire :**
- `index.html` — portfolio public (rendu dynamique par JS)
- `admin.html` — panneau admin protégé par mot de passe
- `css/style.css` — thème principal
- `css/admin.css` — styles admin
- `js/main.js` — chargement des données + rendu (DEFAULT_DATA → localStorage → portfolio-data.json)
- `js/admin.js` — logique admin (formulaires, sauvegarde, publication GitHub API)
- `favicon.svg` — initiales de la personne
- `portfolio-data.json` — données publiées (vide `{}` au départ)

**Règles importantes :**
1. Les données se chargent dans cet ordre : `portfolio-data.json` (GitHub) > `localStorage` (admin) > `DEFAULT_DATA` (code)
2. `mergeDeep()` ne remplace jamais les valeurs par défaut par des chaînes vides ou tableaux vides
3. `saveDataLocal()` supprime les base64 avant sauvegarde localStorage (quota ~5 MB)
4. `fillEmptyWithDefaults()` est appelée avant chaque publication GitHub
5. `cleanStoredBase64()` est appelée au démarrage de l'admin
6. Le déploiement complet utilise `arrayBuffer()` pour les fichiers binaires (images)
7. L'encodage GitHub API utilise `TextEncoder` (support accents français)
8. L'en-tête d'auth est `Bearer {token}` (pas `token {token}`)

---

## QUESTIONNAIRE — À remplir

### IDENTITÉ
```
Prénom(s)          : ________________________________
Nom de famille     : ________________________________
Initiales (favicon): __ __ (ex: TE pour TOUDJI Édouard)
Profession / Titre : ________________________________
Slogan / Sous-titre: ________________________________ (ex: "Portfolio Professionnel")
```

### CONTACT
```
Email              : ________________________________
Téléphone/WhatsApp : ________________________________
Ville / Pays       : ________________________________
Instagram (URL)    : ________________________________ (laisser vide si aucun)
LinkedIn (URL)     : ________________________________ (laisser vide si aucun)
```

### FORMATION(S) — Répéter pour chaque diplôme
```
--- Formation 1 ---
École / Université : ________________________________
Diplôme / Filière  : ________________________________
Année(s)           : ________________________________
Description        : ________________________________

--- Formation 2 ---
École / Université : ________________________________
Diplôme / Filière  : ________________________________
Année(s)           : ________________________________
Description        : ________________________________
```

### COMPÉTENCES — Répéter pour chaque catégorie (4 à 8 catégories)
```
--- Catégorie 1 ---
Nom de la catégorie: ________________________________
Emoji icône        : ________________________________ (ex: ⚙️ 💻 📐 🔧)
Tags (séparés par ,): ________________________________

--- Catégorie 2 ---
Nom de la catégorie: ________________________________
Emoji icône        : ________________________________
Tags               : ________________________________

(continuer pour chaque catégorie...)
```

### EXPÉRIENCES / PROJETS PRATIQUES — Répéter
```
--- Expérience 1 ---
Titre du poste/projet: ________________________________
Entreprise / Contexte: ________________________________
Période             : ________________________________
Type (Stage/CDI/etc) : ________________________________
Description         : ________________________________
Tags compétences    : ________________________________
Image (chemin local): ________________________________ (ex: mes-projets/exp1.jpg)
```

### PROJETS ACADÉMIQUES / PERSONNELS — Répéter (4 à 8 projets)
```
--- Projet 1 ---
Nom du projet       : ________________________________
Catégorie           : ________________________________
Description         : ________________________________
Tags                : ________________________________
Image (chemin local): ________________________________ (ex: mes-projets/projet1.jpg)

--- Projet 2 ---
Nom du projet       : ________________________________
Catégorie           : ________________________________
Description         : ________________________________
Tags                : ________________________________
Image (chemin local): ________________________________

(continuer pour chaque projet...)
```

### TÉMOIGNAGES — Répéter (1 à 4)
```
--- Témoignage 1 ---
Auteur              : ________________________________
Rôle / Poste        : ________________________________
Texte               : ________________________________
Note (1 à 5 étoiles): ____
```

### FEUILLE DE ROUTE (timeline)
```
--- Étape 1 ---
Emoji               : ________________________________
Date / Année        : ________________________________
Titre               : ________________________________
Description         : ________________________________
Accompli ? (oui/non): ________________________________

(continuer pour 4 à 6 étapes...)
```

### INSPIRATIONS (personnes admirées)
```
--- Inspiration 1 ---
Nom                 : ________________________________
Rôle / Titre        : ________________________________
Pourquoi inspirant  : ________________________________

--- Inspiration 2 ---
Nom                 : ________________________________
Rôle / Titre        : ________________________________
Pourquoi inspirant  : ________________________________
```

### OBJECTIF PROFESSIONNEL
```
Titre de la section : ________________________________
Texte (2-3 paragraphes, séparés par une ligne vide) :

________________________________

________________________________

________________________________
```

### GITHUB PAGES
```
Nom d'utilisateur GitHub : ________________________________
Nom du dépôt GitHub      : ________________________________
Branche                  : main
```

### MOT DE PASSE ADMIN
```
Mot de passe souhaité : ________________________________ (défaut : admin2026)
```

---

## CANEVAS THÈME — Choisir un style

Cochez le thème voulu ou décrivez le vôtre :

- [ ] **Dark Green Tech** (identique à TOUDZI) — fond `#080a08`, accent `#39d353`, fonts Bebas Neue + Syne + JetBrains Mono
- [ ] **Dark Blue Tech** — fond `#080a14`, accent `#3b82f6`
- [ ] **Dark Purple** — fond `#0a080e`, accent `#a855f7`
- [ ] **Dark Amber** — fond `#0c0900`, accent `#f59e0b`
- [ ] **Thème personnalisé** :
  ```
  Couleur de fond        : ________________________________ (hex)
  Couleur accent principale: ______________________________ (hex)
  Couleur accent secondaire: ______________________________ (hex)
  Police titre           : ________________________________ (Google Fonts)
  Police corps           : ________________________________ (Google Fonts)
  Police mono/code       : ________________________________ (Google Fonts)
  ```

---

## CANEVAS SECTIONS — Choisir les sections à inclure

Cochez les sections à afficher (toutes actives par défaut) :

- [x] Hero (nom, photo, stats)
- [x] Introduction (qui suis-je)
- [x] À propos (texte, qualités, valeurs)
- [x] Éducation (timeline formations)
- [x] Compétences (cartes par catégorie)
- [x] Expérience (postes, stages, projets pratiques)
- [x] Projets (galerie avec images)
- [x] Témoignages
- [x] Blog & Articles
- [x] Feuille de route (timeline)
- [x] Inspirations
- [x] Objectif professionnel
- [x] Contact + formulaire

---

## CANEVAS IMAGES

Listez les images disponibles localement et leur usage :

```
Image de profil (hero)   : Image/hero.jpg
Photo introduction       : ________________________________
Photo à propos           : ________________________________

Images projets :
  Projet 1               : mes-projets/projet1.jpg
  Projet 2               : mes-projets/projet2.jpg
  Projet 3               : mes-projets/projet3.jpg
  (continuer...)

Images expériences :
  Expérience 1           : mes-projets/exp1.jpg
  (continuer...)
```

> **Convention de nommage recommandée :**
> - Photo principale → `Image/hero.jpg`
> - Projets → `mes-projets/nom-court.jpg`
> - Formats acceptés : JPG, PNG, WebP

---

## INSTRUCTIONS DE DÉPLOIEMENT (à fournir avec le questionnaire)

Une fois le code généré par l'IA :

```
1. Créez un dépôt GitHub vide avec le nom indiqué dans le questionnaire
2. Activez GitHub Pages : Settings → Pages → Source: Deploy from branch → main → / (root)
3. Placez vos images dans les dossiers Image/ et mes-projets/
4. Ouvrez admin.html via Live Server (VSCode : clic droit → Open with Live Server)
   OU via terminal : python -m http.server 8080 → http://localhost:8080/admin.html
5. Connectez-vous (mot de passe défini dans le questionnaire)
6. Allez dans Publication GitHub → remplissez vos paramètres → Enregistrer
7. Cliquez 🌐 Déploiement complet (première fois)
8. Attendez ~2 minutes → votre site est en ligne
9. Pour les mises à jour : modifiez dans l'admin → 🚀 Publier (données)
```

---

## EXEMPLE COMPLÉTÉ — Pour référence

Voici comment le questionnaire a été rempli pour **TOUDJI Kokouvi Édouard** :

```
Prénom(s)     : KOKOUVI ÉDOUARD
Nom           : TOUDJI
Initiales     : TE
Profession    : Génie Mécanique & Productique
Sous-titre    : GMP — ESIG Global Success
Email         : edboysedouardo@gmail.com
Téléphone     : +228 98 25 50 11
Ville / Pays  : Lomé, Togo

Formation 1   : ESIG Global Success — BUT GMP — 2023-En cours
Formation 2   : Lycée — Bac Série C — 2022

Compétences   :
  ⚙️ Conception & CAO       → SolidWorks, CATIA, AutoCAD
  🔧 Fabrication & Usinage  → Tournage, Fraisage, Contrôle qualité
  ⚡ Électrotechnique        → Moteurs asynchrones, Câblage
  🤖 Automatisme            → Grafcet, Logique combinatoire
  📐 Analyse & Méthode      → FAST, SADT, AMDEC
  👥 Transversales          → Travail en équipe, Communication

Projets SAE :
  SAE 1 → Électrotechnique  → mes-projets/sae1.jpg
  SAE 2 → Automatisme       → mes-projets/sae2.jpg
  SAE 3 → Conception        → mes-projets/sae3.jpg
  SAE 4 → Ergonomie         → mes-projets/sae4.jpg

GitHub        : ashbornarise / TOUDZI-Edouard
```

---

*Généré pour le portfolio TOUDZI-Edouard — Système réutilisable*
