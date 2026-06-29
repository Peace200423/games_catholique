// api/load-progress.js — GET /api/load-progress?uid=xxx
const { sql } = require("../lib/db.js");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
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

    if (!rows.length) return res.status(404).json({ found: false });

    return res.status(200).json({ found: true, ...rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};
