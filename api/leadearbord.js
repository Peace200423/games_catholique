// api/leaderboard.js — GET /api/leaderboard?uid=xxx
import { sql } from "../lib/db.js";

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Méthode non autorisée" });

  const { uid } = req.query;

  try {
    // Top 20 scores (un score par user_id — on garde le meilleur)
    const rows = await sql`
      SELECT DISTINCT ON (user_id)
        user_id,
        pseudo,
        total_xp,
        streak,
        updated_at
      FROM progress
      WHERE pseudo IS NOT NULL AND pseudo != ''
      ORDER BY user_id, total_xp DESC
    `;

    // Trier par XP décroissant
    const sorted = [...rows].sort((a, b) => b.total_xp - a.total_xp).slice(0, 20);

    // Rang du joueur courant
    let myRank = null;
    if (uid) {
      const allRows = await sql`
        SELECT user_id, total_xp FROM progress
        WHERE pseudo IS NOT NULL AND pseudo != ''
        ORDER BY total_xp DESC
      `;
      const idx = allRows.findIndex(r => r.user_id === uid);
      if (idx !== -1) myRank = idx + 1;
    }

    return res.status(200).json({ rows: sorted, myRank, total: rows.length });

  } catch (err) {
    console.error("Erreur leaderboard:", err);
    return res.status(500).json({ error: "Erreur serveur", rows: [], myRank: null });
  }
}
