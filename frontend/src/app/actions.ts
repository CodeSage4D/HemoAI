"use server";

import { neon } from "@neondatabase/serverless";

export async function getData() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is not defined in server runtime");
    return [];
  }

  try {
    const sql = neon(databaseUrl);
    // Secure SQL query targeting the seeded users table
    const data = await sql`
      SELECT id, email, "fullName", role, "isActive" 
      FROM users 
      ORDER BY "createdAt" DESC
    `;
    return data;
  } catch (error) {
    console.error("Neon Serverless Query Failed:", error);
    throw new Error("Failed to fetch database telemetry records via serverless client");
  }
}
