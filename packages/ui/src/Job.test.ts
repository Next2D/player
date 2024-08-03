import { Job } from "./Job";
import { describe, expect, it } from "vitest";

describe("Job.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new Job({}, { "name": 0 }, { "name": 1 }).namespace).toBe("next2d.ui.Job");
    });

    it("namespace test static", () =>
    {
        expect(Job.namespace).toBe("next2d.ui.Job");
    });
});