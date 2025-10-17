import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '../../../../../lib/db';
import { and, cosineDistance, desc, gt, ne, sql } from 'drizzle-orm';
// Based on https://orm.drizzle.team/docs/guides/vector-similarity-search

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const base = await db.query.candidates.findFirst({
            where: (c, { eq }) => eq(c.id, id),
            columns: { embedding: true },
        });

        if (!base?.embedding || base.embedding.length !== 1536) {
            return NextResponse.json({ items: [] });
        }

        // similarity expression
        const similarity = sql<number>`1 - (${cosineDistance(schema.candidates.embedding, base.embedding)})`;

        // query top k (10) - limit could be made dyamic
        const rows = await db
            .select({
                id: schema.candidates.id,
                name: schema.candidates.name,
                party: schema.candidates.party,
                office: schema.candidates.office,
                state: schema.candidates.state,
                district: schema.candidates.district,
                bio: schema.candidates.bio,
                fundsRaised: schema.candidates.fundsRaised,
                similarity,
            })
            .from(schema.candidates)
            .where(
                and(
                    ne(schema.candidates.id, id),
                    gt(similarity, 0.5) // sim threshold
                )
            )
            .orderBy((t) => desc(t.similarity))
            .limit(10);

        // serialize
        const items = rows.map((row) => ({
            ...row,
        }));

        return NextResponse.json({ items });
    } catch (error) {
        console.error("GET /api/candidates/recommendations/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
