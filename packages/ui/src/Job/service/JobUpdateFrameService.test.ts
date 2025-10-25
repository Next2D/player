import { execute } from "./JobUpdateFrameService";
import { Job } from "../../Job";
import { describe, expect, it, vi } from "vitest";

describe("JobUpdateFrameService.js test", () =>
{
    it("execute test case1", () =>
    {
        const MockJob = vi.fn(function(this: any) {
            this.stopFlag = true;
        }) as any;

        const job = new MockJob();
        expect(execute(job, 0)).toBe(-1);
    });

    it("execute test case2", () =>
    {
        const MockJob = vi.fn(function(this: any) {
            this.stopFlag = false;
            this.entries = null;
        }) as any;

        const job = new MockJob();
        expect(execute(job, 0)).toBe(-1);
    });
});