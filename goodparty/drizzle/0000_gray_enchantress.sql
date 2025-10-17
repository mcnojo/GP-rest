CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "candidate" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"party" text NOT NULL,
	"office" text NOT NULL,
	"state" text NOT NULL,
	"bio" text NOT NULL,
	"funds_raised" double precision DEFAULT 0 NOT NULL,
	"embedding" vector(1536),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "idx_candidate_embedding" ON "candidate" USING hnsw ("embedding" vector_cosine_ops);