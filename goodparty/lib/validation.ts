import { z } from "zod";

export const candidateCreateSchema = z.object({
    name: z.string().min(1),
    party: z.string().min(1),
    office: z.string().min(1),
    state: z.string().length(2),
    district: z.string(),
    bio: z.string().min(10),
    fundsRaised: z.number().min(0),
});

export const candidateFilterSchema = z.object({
    party: z.string().optional(),
    office: z.string().optional(),
    state: z.string().length(2).optional(),
    q: z.string().optional(),
});

export const candidateIdSchema = z.object({ id: z.string().min(1), });

export type CandidateCreateInput = z.infer<typeof candidateCreateSchema>;
export type CandidateFilterInput = z.infer<typeof candidateFilterSchema>;