import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "../../../lib/db";
import { candidateCreateSchema } from "../../../lib/validation";
import { embedText } from "../../../lib/embeddings"
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
    try {
        const json = await req.json()
        const parsed = candidateCreateSchema.safeParse(json)
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 })
        }

        const data = parsed.data;
        const embedding = await embedText(`${data.bio}`)

        const toInsert = {
            id: randomUUID(),
            name: data.name,
            party: data.party.toUpperCase(),
            office: data.office,
            state: data.state.toUpperCase() || "",
            bio: data.bio,
            district: data.district,
            fundsRaised: data.fundsRaised ?? 0,
            embedding,
        } satisfies typeof schema.candidates.$inferInsert;

        await db.insert(schema.candidates).values(toInsert)

        // return creted
        const created = await db.query.candidates.findFirst({
            where: (c, { eq }) => eq(c.id, toInsert.id),
        });
        return NextResponse.json(created, { status: 201 });
        
    } catch (error) {
        console.error("POST /api/candidates error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
