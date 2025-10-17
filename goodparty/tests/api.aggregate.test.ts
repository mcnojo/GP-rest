import { randomUUID } from "crypto";
import { db, schema } from "../lib/db";
import { resetCandidates, json } from "./test_helpers";
import * as aggRoute from "../app/api/candidates/aggregate/route";

describe("Aggregate", () => {
    beforeAll(async () => {
        await resetCandidates();
        await db.insert(schema.candidates).values([
            {
                id: randomUUID(),
                name: "A",
                party: "Democratic",
                office: "House",
                state: "CA",
                district: "1",
                bio: "A",
                fundsRaised: 10
            },
            {
                id: randomUUID(),
                name: "B",
                party: "Republican",
                office: "Senate",
                state: "TX",
                district: null,
                bio: "B",
                fundsRaised: 20
            },
            {
                id: randomUUID(),
                name: "C",
                party: "Independent",
                office: "Governor",
                state: "AZ",
                district: null,
                bio: "C",
                fundsRaised: 30
            },
        ]);
    });

    test("returns total fundsRaised by all candidates", async () => {
        const res = await aggRoute.GET();
        const total = await json<number>(res);
        expect(total).toBeCloseTo(60, 5);
    });
});
