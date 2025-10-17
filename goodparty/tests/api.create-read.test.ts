/**
 * Covers:
 * - POST /api/candidates (valid + invalid)
 * - GET  /api/candidates/[id] (found + 404)
 */
import { db } from "../lib/db";
import { resetCandidates, json } from "./test_helpers";
import * as postRoute from "../app/api/candidates/route";
import * as getByIdRoute from "../app/api/candidates/[id]/route";



describe("Create & Read", () => {
  beforeAll(async () => {
    await resetCandidates()
  });

  test("POST - creates a candidate", async () => {
    const body = {
      name: "Jane Doe",
      party: "Independent",
      office: "House",
      state: "ca",
      district: "12",
      bio: "I'm a community organizer focused on education and healthcare.",
      fundsRaised: 12345.67,
    };
    const req = new Request("http://localhost/api/candidates", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    const res = await postRoute.POST(req as any);
    expect(res.status).toBe(201);

    const created = await json(res);
    expect(created.name).toBe("Jane Doe");
    expect(created.state).toBe("CA"); // upcased
    expect(created.fundsRaised).toBeCloseTo(12345.67, 2);
  });

  test("POST - fails with 400 on validation error", async () => {
    const bad_request = { 
        name: "",
        party: "",
        office: "",
        bio: "" 
    };

    const req = new Request("http://localhost/api/candidates", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(bad_request),
    });
    const res = await postRoute.POST(req as any);
    expect(res.status).toBe(400);
  });

  test("GET - returns 404 when id not found", async () => {
    const res = await getByIdRoute.GET({} as any, { params: { id: "bedugging" } });
    expect(res.status).toBe(404);
  });

  test("GET - id returns the created candidate", async () => {
    const row = await db.query.candidates.findFirst();
    expect(row).toBeTruthy();
    const res = await getByIdRoute.GET({} as any, { params: { id: row!.id } });
    expect(res.status).toBe(200);
    const data = await json(res);
    expect(data.id).toBe(row!.id);
  });
});
