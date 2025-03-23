import { execute } from "./JobUpdateFrameService";
import { Job } from "../../Job";
import { describe, expect, it, vi } from "vitest";

describe("JobUpdateFrameService.js test", () =>
{
    it("execute test case1", () =>
    {
        const MockJob = vi.fn().mockImplementation(() =>
        {
            return {
                "stopFlag": true
            } as unknown as Job;
        });

        const job = new MockJob();
        expect(execute(job, 0)).toBe(-1);
    });

    it("execute test case2", () =>
    {
        const MockJob = vi.fn().mockImplementation(() =>
        {
            return {
                "stopFlag": false,
                "entries": null
            } as unknown as Job;
        });

        const job = new MockJob();
        expect(execute(job, 0)).toBe(-1);
    });
});