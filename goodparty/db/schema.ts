import { pgTable, text, doublePrecision, timestamp, vector, index } from 'drizzle-orm/pg-core';

export const candidates = pgTable(
    "candidate",
    {
        id: text("id").primaryKey(),
        name: text("name").notNull(),
        party:text("party").notNull(),
        office: text("office").notNull(),
        state: text("state").notNull(),
        district: text('district'),
        bio: text("bio").notNull(),
        fundsRaised: doublePrecision("funds_raised").notNull().default(0),
        embedding: vector("embedding", { dimensions: 1536 }),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    },
    (t) => [
        // indexing since system would likely involve many vector reads for comparison
        index('idx_candidate_embedding').using('hnsw', t.embedding.op('vector_cosine_ops')),
    ]
);

export type Candidate = typeof candidates.$inferSelect;
export type NewCandidate = typeof candidates.$inferInsert;