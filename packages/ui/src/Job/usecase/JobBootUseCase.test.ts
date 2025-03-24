import { execute } from "./JobBootUseCase";
import { describe, expect, it } from "vitest";
import type { Job } from "../../Job";

describe("JobBootUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const job = {
            "hasEventListener": () => false,
            "startTime": 0,
            "$timerId": 0,
            "target": {
                "test": 0
            },
            "from": {
                "test": 100
            },
            "to": {
                "test": 0
            },
            "entries": null,
            "stopFlag": false,
        } as unknown as Job;
        
        expect(job.startTime).toBe(0);
        expect(job.$timerId).toBe(0);
        expect(job.entries).toBe(null);
        
        execute(job);

        expect(job.entries).not.toBeNull();
        expect(job.$timerId).not.toBe(0);
        expect(job.startTime).not.toBe(0);
    });
});