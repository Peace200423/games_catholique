// api/save-progress.js — POST /api/save-progress
const { sql } = require("../lib/db.js");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

  const { user_id, pseudo, total_xp, completed, age_mode, streak, wrong_answers } = req.body || {};

  if (!user_id || typeof user_id !== "string" || user_id.length > 64) {
    return res.status(400).json({ error: "user_id invalide" });
  }
  if (typeof total_xp !== "number" || total_xp < 0) {
    return res.status(400).json({ error: "total_xp invalide" });
  }

  const cleanPseudo = typeof pseudo === "string"
    ? pseudo.trim().slice(0, 20).replace(/[<>"']/g, "")
    : null;

  try {
    const result = await sql`
      INSERT INTO progress (user_id, pseudo, total_xp, completed, age_mode, streak, wrong_answers, updated_at)
      VALUES (
        ${user_id},
        ${cleanPseudo},
        ${total_xp},
        ${JSON.stringify(completed || {})},
        ${age_mode || "adulte"},
        ${streak || 0},
        ${JSON.stringify(wrong_answers || {})},
        NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        pseudo        = EXCLUDED.pseudo,
        total_xp      = GREATEST(progress.total_xp, EXCLUDED.total_xp),
        completed     = EXCLUDED.completed,
        age_mode      = EXCLUDED.age_mode,
        streak        = EXCLUDED.streak,
        wrong_answers = EXCLUDED.wrong_answers,
        updated_at    = NOW()
      RETURNING id, total_xp, updated_at
    `;

    return res.status(200).json({ ok: true, id: result[0]?.id, total_xp: result[0]?.total_xp });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};
