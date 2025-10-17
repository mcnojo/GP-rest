import { randomUUID } from "crypto";
import { db, schema } from "../lib/db";
import { resetCandidates, json } from "./test_helpers";
import * as searchRoute from "../app/api/candidates/search/route";

describe("Filtered search", () => {
    beforeAll(async () => {
        await resetCandidates();
        await db.insert(schema.candidates).values([
            { 
                id: randomUUID(),
                name: "A",
                party: "Democrat",
                office: "House",
                state: "CA",
                district: "1",
                bio: "A",
                fundsRaised: 100
            },
            { 
                id: randomUUID(),
                name: "B",
                party: "Democrat",
                office: "Senate",
                state: "CA",
                district: null,
                bio: "B",
                fundsRaised: 2000
            },
            { 
                id: randomUUID(),
                name: "C",
                party: "Independent",
                office: "Senate",
                state: "CA",
                district: null,
                bio: "C",
                fundsRaised: 500
            },
            { 
                id: randomUUID(),
                name: "D",
                party: "Independent",
                office: "House",
                state: "TX",
                district: null,
                bio: "D",
                fundsRaised: 900
            },
        ]);
    });

    const call = (qs: string) =>
        searchRoute.GET(new Request(`http://localhost/api/candidates/search${qs}`) as any)

    test("Democrats >= 100 funds", async () => {
        const res = await call("?party=Democrat&minFunds=100");
        const rows = await json<any[]>(res)
        expect(rows.map(r => r.name)).toEqual(["A", "B"])
    });
    test("Independents <= 10000 funds", async () => {
        const res = await call("?party=Independent&maxFunds=10000");
        const rows = await json<any[]>(res)
        expect(rows.map(r => r.name)).toEqual(["C", "D"]);
    });

    test("CA + senate", async () => {
        const res = await call("?state=CA&office=Senate&minFunds=1000")
        const rows = await json<any[]>(res)
        expect(rows.map(r => r.name)).toEqual(["B"]);
    });

    test("CA, funds >= 200, funds <=1000", async () => {
        const res = await call("?state=CA&minFunds=200&maxFunds=600")
        const rows = await json<any[]>(res)
        expect(rows.map(r => r.name)).toEqual(["C"]);
    });
});
