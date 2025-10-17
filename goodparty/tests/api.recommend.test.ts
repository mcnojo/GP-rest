import { json, resetCandidates } from "./test_helpers";
import * as postRoute from "../app/api/candidates/route";
import * as recRoute from "../app/api/candidates/recommendations/[id]/route";

async function create(body: any) {
    const req = new Request("http://localhost/api/candidates", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    });
    const res = await postRoute.POST(req as any);
    if (res.status !== 201) {
        const err = await res.text();
        throw new Error(`Create failed (${res.status}): ${err}`);
    }
    return json(res);
}

describe("Recommendations testing", () => {
    let base: any;

    beforeAll(async () => {
        await resetCandidates();

        // Base + two similar + one far
        base = await create({
            name: "Base",
            party: "Independent",
            office: "House",
            state: "CA",
            district: "1",
            bio: "Candidate focused on public education, affordable healthcare, and modern infrastructure projects.",
            fundsRaised: 1,
        });

        await create({
            name: "Near1",
            party: "Independent",
            office: "House",
            state: "CA",
            district: "2",
            bio: "Prioritizes improving healthcare access, strengthening schools, and investing in transportation infrastructure.",
            fundsRaised: 2,
        });

        await create({
            name: "Near2",
            party: "Independent",
            office: "House",
            state: "CA",
            district: "3",
            bio: "Education reform advocate who supports universal healthcare and rebuilding roads and bridges.",
            fundsRaised: 3,
        });

        await create({
            name: "Far",
            party: "Republican",
            office: "Senate",
            state: "TX",
            district: "13",
            bio: "Focus on border security, oil & gas expansion, and cutting regulations for business growth.",
            fundsRaised: 4,
        });
    });

    test("similarity tests", async () => {
        const res = await recRoute.GET({} as any, { params: { id: base.id } } as any);
        expect(res.status).toBe(200);
        const body = await json<{ items: { name: string; similarity: number }[] }>(res);

        // should exclude itself
        expect(body.items.find(x => x.name === "Base")).toBeUndefined();

        // shoudl contain btoh near1 / near2
        const names = body.items.map(x => x.name);
        expect(names).toContain("Near1");
        expect(names).toContain("Near2");

        // descending similarity order should be maintained
        const sims = body.items.map(x => x.similarity);
        const sorted = [...sims].sort((a, b) => b - a);
        expect(sims).toEqual(sorted);
    });
});
