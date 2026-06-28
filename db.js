// lib/db.js — connexion Neon PostgreSQL (serverless, compatible Vercel Edge)
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL manquante — configure-la dans les variables d'environnement Vercel.");
}

export const sql = neon(process.env.DATABASE_URL);
