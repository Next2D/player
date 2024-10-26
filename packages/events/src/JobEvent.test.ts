import { JobEvent } from "./JobEvent";
import { describe, expect, it } from "vitest";

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