# 🏛️ Le Chemin des Saints — Backend API

Backend officiel du jeu **Le Chemin des Saints**.

Cette API permet de :

- 📈 Sauvegarder la progression des joueurs
- 🏆 Gérer le classement mondial (Leaderboard)
- ☁️ Synchroniser les données entre plusieurs appareils
- 🗄️ Stocker les informations dans PostgreSQL (Neon)

Le projet est entièrement compatible avec **Vercel Serverless Functions** et **Neon PostgreSQL**.

---

# ✨ Fonctionnalités

- Sauvegarde automatique de la progression
- Classement mondial des joueurs
- Synchronisation Cloud
- API REST simple
- Déploiement 100 % gratuit
- Compatible Vercel + Neon

---

# 📂 Structure du projet

```
chemin-des-saints-api/
│
├── api/
│   ├── setup.js            # Création des tables (à utiliser une seule fois)
│   ├── leaderboard.js      # GET  /api/leaderboard
│   ├── save-progress.js    # POST /api/save-progress
│   └── load-progress.js    # GET  /api/load-progress?uid=xxx
│
├── lib/
│   └── db.js               # Connexion PostgreSQL (Neon)
│
├── package.json
├── vercel.json
└── README.md
```

---

# 🚀 Déploiement

## 1. Créer une base PostgreSQL (Neon)

Créer gratuitement un compte :

👉 https://neon.tech

Créer un nouveau projet :

```
chemin-des-saints
```

Puis copier votre **DATABASE_URL**

Exemple :

```
postgresql://user:password@ep-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

---

## 2. Déployer sur Vercel

Installer Vercel CLI :

```bash
npm install -g vercel
```

Se connecter :

```bash
vercel login
```

Puis déployer :

```bash
vercel --prod
```

Lors de la configuration :

| Paramètre | Valeur |
|------------|---------|
| Framework | None |
| Build Command | *(laisser vide)* |
| Output Directory | *(laisser vide)* |

---

## 3. Ajouter les variables d'environnement

Depuis :

```
Vercel Dashboard
→ Settings
→ Environment Variables
```

Ajouter :

| Variable | Description |
|-----------|-------------|
| DATABASE_URL | URL PostgreSQL Neon |
| SETUP_KEY | Clé secrète permettant de créer la base |

Exemple :

```
DATABASE_URL=postgresql://....
SETUP_KEY=saints2026
```

Une fois ajouté :

```bash
vercel --prod
```

---

## 4. Initialiser la base

Ouvrir :

```
https://votre-projet.vercel.app/api/setup?key=saints2026
```

Réponse attendue :

```json
{
  "ok": true,
  "message": "Tables créées avec succès !"
}
```

---

## ⚠️ Important

Une fois les tables créées :

Supprimer le fichier

```
api/setup.js
```

Puis redéployer le projet.

Cela évite qu'une personne puisse recréer ou modifier la base.

---

# 🔗 Intégration dans le jeu

Dans le fichier HTML :

```javascript
const API_BASE = "https://votre-projet.vercel.app/api";
```

Remplacer simplement par l'URL de votre projet Vercel.

---

# 🧪 Tester l'API

## Leaderboard

```bash
curl https://votre-projet.vercel.app/api/leaderboard
```

---

## Sauvegarder une progression

```bash
curl -X POST https://votre-projet.vercel.app/api/save-progress \
-H "Content-Type: application/json" \
-d '{
"user_id":"test123",
"pseudo":"Jean Marie",
"total_xp":450,
"completed":{},
"age_mode":"adulte",
"streak":3
}'
```

---

## Charger une progression

```bash
curl https://votre-projet.vercel.app/api/load-progress?uid=test123
```

---

# 🗄️ Structure de la base de données

```sql
CREATE TABLE progress (

id SERIAL PRIMARY KEY,

user_id TEXT UNIQUE NOT NULL,

pseudo TEXT,

total_xp INTEGER DEFAULT 0,

completed JSONB DEFAULT '{}',

age_mode TEXT DEFAULT 'adulte',

streak INTEGER DEFAULT 0,

wrong_answers JSONB DEFAULT '{}',

updated_at TIMESTAMPTZ DEFAULT NOW()

);
```

---

# 📡 Endpoints disponibles

| Méthode | Endpoint | Description |
|----------|----------|-------------|
| GET | /api/leaderboard | Retourne le classement mondial |
| POST | /api/save-progress | Sauvegarde la progression |
| GET | /api/load-progress | Charge la progression d'un joueur |
| GET | /api/setup | Initialise la base (à supprimer ensuite) |

---

# 💸 Coût

| Service | Plan |
|----------|------|
| Vercel | Gratuit |
| Neon PostgreSQL | Gratuit |

Pour un projet éducatif ou associatif, le backend fonctionne entièrement sans frais.

---

# 🛣️ Feuille de route

Fonctionnalités prévues :

- 🔐 Authentification des joueurs
- ☁️ Sauvegarde multi-appareils
- 📊 Tableau de statistiques
- 📈 Progression détaillée
- 🏅 Succès (Achievements)
- 📤 Export CSV
- 📧 Notifications
- 👥 Classements par paroisse
- 🏛️ Classements par diocèse
- 🌍 Classement mondial

---

# ❤️ À propos

**Le Chemin des Saints** est un jeu catholique conçu pour rendre l'apprentissage de la foi plus interactif grâce aux récits bibliques, aux quiz et à une progression ludique.

Développé avec ❤️ au Bénin.

> *"Tout ce que vous faites, faites-le pour la gloire de Dieu."*  
> **1 Corinthiens 10:31**
