import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "../../../../lib/db"
import { and, gte, lte, eq, sql } from "drizzle-orm"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const office = searchParams.get("office") ?? undefined
    const party = searchParams.get("party") ?? undefined
    const state = searchParams.get("state") ?? undefined
    const minFunds = searchParams.get("minFunds");
    const maxFunds = searchParams.get("maxFunds");
  
    const filters = [
        office ? eq(schema.candidates.office, office) : undefined,
        party ? eq(schema.candidates.party, party) : undefined,
        state ? eq(schema.candidates.state, state) : undefined,
        minFunds ? gte(schema.candidates.fundsRaised, Number(minFunds)) : undefined,
        maxFunds ? lte(schema.candidates.fundsRaised, Number(maxFunds)) : undefined,
    ].filter(Boolean) as any[];

    const rows = await db
        .select()
        .from(schema.candidates)
        .where(filters.length ? and(...filters) : sql`true`)
        .limit(10);// smol potatos

    return NextResponse.json(rows)
}
