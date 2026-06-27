# 🏛️ Le Chemin des Saints — Backend API

Backend **Vercel + Neon PostgreSQL** pour le leaderboard mondial et la synchronisation de progression.

---

## 📋 Architecture

```
chemin-des-saints-api/
├── api/
│   ├── setup.js           ← Crée les tables (1 seule fois)
│   ├── leaderboard.js     ← GET  /api/leaderboard
│   ├── save-progress.js   ← POST /api/save-progress
│   └── load-progress.js   ← GET  /api/load-progress?uid=xxx
├── lib/
│   └── db.js              ← Connexion Neon (partagée)
├── package.json
├── vercel.json
└── README.md
```

---

## 🚀 Installation pas-à-pas

### Étape 1 — Créer la base Neon (gratuit)

1. Va sur [neon.tech](https://neon.tech) → **"Sign up"** (GitHub suffit)
2. Crée un projet : **"chemin-des-saints"**
3. Copie la **Connection string** (format : `postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`)

### Étape 2 — Déployer sur Vercel (gratuit)

```bash
# Installer Vercel CLI
npm install -g vercel

# Dans le dossier du projet
cd chemin-des-saints-api
vercel login
vercel --prod
```

Vercel va te demander :
- **Project name** : `chemin-des-saints`
- **Framework** : None (laisse vide)
- **Build command** : laisse vide
- **Output directory** : laisse vide

### Étape 3 — Configurer les variables d'environnement

Dans le **dashboard Vercel** → Settings → Environment Variables :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require` |
| `SETUP_KEY` | Un mot de passe secret de ton choix ex: `saints2024` |

Puis **redéployer** :
```bash
vercel --prod
```

### Étape 4 — Initialiser la base de données

Ouvre dans ton navigateur :
```
https://chemin-des-saints.vercel.app/api/setup?key=saints2024
```

Tu dois voir :
```json
{ "ok": true, "message": "Tables créées avec succès !" }
```

**⚠️ Supprime ensuite `api/setup.js` et redéploie** (sécurité).

### Étape 5 — Mettre à jour l'URL dans le HTML du jeu

Dans `le_chemin_des_saints_v7.html`, cherche :
```javascript
const API_BASE = "https://chemin-des-saints.vercel.app/api";
```

Remplace par ton URL Vercel réelle.

---

## 🧪 Tester les routes

```bash
# Leaderboard
curl https://chemin-des-saints.vercel.app/api/leaderboard

# Sauvegarder un score
curl -X POST https://chemin-des-saints.vercel.app/api/save-progress \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test_123","pseudo":"Jean Marie","total_xp":450,"completed":{},"age_mode":"adulte","streak":3}'

# Charger la progression
curl https://chemin-des-saints.vercel.app/api/load-progress?uid=test_123
```

---

## 🗄️ Schéma SQL

```sql
-- Table principale de progression
CREATE TABLE progress (
  id            SERIAL PRIMARY KEY,
  user_id       TEXT NOT NULL UNIQUE,  -- UUID généré côté client
  pseudo        TEXT,                  -- Pseudo public (leaderboard)
  total_xp      INTEGER DEFAULT 0,
  completed     JSONB DEFAULT '{}',    -- {stationId: true, ...}
  age_mode      TEXT DEFAULT 'adulte', -- junior/adulte/senior/lecture
  streak        INTEGER DEFAULT 0,
  wrong_answers JSONB DEFAULT '{}',    -- Questions ratées pour révision
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 💰 Coûts

| Service | Plan gratuit | Limite |
|---|---|---|
| Vercel | Hobby (gratuit) | 100 GB-h/mois |
| Neon | Free (gratuit) | 0.5 Go, 1 branche |

**Conclusion : 100% gratuit** pour un usage scolaire ou communautaire.

---

## 🔧 Prochaines évolutions possibles

- Authentification avec Clerk ou NextAuth
- Export CSV des scores pour suivi pédagogique
- Statistiques : questions les plus ratées, taux de réussite par chapitre
- Notifications par email (resend.com) pour les nouveaux records
