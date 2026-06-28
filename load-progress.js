// api/load-progress.js — GET /api/load-progress?uid=xxx
import { sql } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Méthode non autorisée" });

  const { uid } = req.query;
  if (!uid || typeof uid !== "string" || uid.length > 64) {
    return res.status(400).json({ error: "uid invalide" });
  }

  try {
    const rows = await sql`
      SELECT user_id, pseudo, total_xp, completed, age_mode, streak, wrong_answers, updated_at
      FROM progress
      WHERE user_id = ${uid}
      LIMIT 1
    `;

    if (!rows.length) {
      return res.status(404).json({ found: false });
    }

    const row = rows[0];
    return res.status(200).json({
      found: true,
      user_id:      row.user_id,
      pseudo:       row.pseudo,
      total_xp:     row.total_xp,
      completed:    row.completed,
      age_mode:     row.age_mode,
      streak:       row.streak,
      wrong_answers: row.wrong_answers,
      updated_at:   row.updated_at
    });

  } catch (err) {
    console.error("Erreur load-progress:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
