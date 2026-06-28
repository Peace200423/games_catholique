// api/setup.js — À appeler UNE SEULE FOIS pour créer les tables Neon
// GET https://ton-projet.vercel.app/api/setup
import { sql } from "../lib/db.js";

export default async function handler(req, res) {
  // Sécurité minimale : clé secrète en query param
  if (req.query.key !== process.env.SETUP_KEY) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS progress (
        id          SERIAL PRIMARY KEY,
        user_id     TEXT NOT NULL UNIQUE,
        pseudo      TEXT,
        total_xp    INTEGER DEFAULT 0,
        completed   JSONB DEFAULT '{}',
        age_mode    TEXT DEFAULT 'adulte',
        streak      INTEGER DEFAULT 0,
        wrong_answers JSONB DEFAULT '{}',
        updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
        id         SERIAL PRIMARY KEY,
        user_id    TEXT NOT NULL,
        pseudo     TEXT NOT NULL,
        total_xp   INTEGER NOT NULL,
        rank_name  TEXT,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Index pour les requêtes rapides
    await sql`
      CREATE INDEX IF NOT EXISTS idx_progress_xp
      ON progress(total_xp DESC)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_lb_xp
      ON leaderboard_snapshots(total_xp DESC)
    `;

    return res.status(200).json({
      ok: true,
      message: "Tables créées avec succès ! Tu peux supprimer api/setup.js ensuite."
    });
  } catch (err) {
    console.error("Erreur setup:", err);
    return res.status(500).json({ error: err.message });
  }
}
