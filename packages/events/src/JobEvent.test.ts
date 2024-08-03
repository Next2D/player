import { JobEvent } from "./JobEvent";
import { describe, expect, it } from "vitest";

describe("JobEvent.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new JobEvent("test").namespace).toBe("next2d.events.JobEvent");
    });

    it("namespace test static", () =>
    {
        expect(JobEvent.namespace).toBe("next2d.events.JobEvent");
    });
});

describe("JobEvent.js property test", () =>
{
    it("UPDATE test", () =>
    {
        expect(JobEvent.UPDATE).toBe("jobupdate");
    });

    it("STOP test", () =>
    {
        expect(JobEvent.STOP).toBe("jobstop");
    });
});