import { execute } from "./JobStartUseCase";
import { describe, expect, it } from "vitest";
import type { Job } from "../../Job";

describe("JobStartUseCase.js test", () =>
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
            "stopFlag": true,
        } as unknown as Job;
        
        expect(job.stopFlag).toBe(true);
        
        execute(job);

        expect(job.stopFlag).toBe(false);
    });
});