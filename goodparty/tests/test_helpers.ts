import { db, schema } from "../lib/db";

// Wipe table between suites
export async function resetCandidates() {
  await db.delete(schema.candidates);
}

// Parse JSON from NextResponse/Response
export async function json<T = any>(res: any): Promise<T> {
  return await (res as Response).json();
}