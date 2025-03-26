import { execute } from "./JobStopService";
import { describe, expect, it, vi } from "vitest";
import { JobEvent } from "@next2d/events";
import type { Job } from "../../Job";

describe("JobStopService.js test", () =>
{
    it("execute test case1", () =>
    {
        const job = {
            "hasEventListener": () => true,
            "dispatchEvent": vi.fn((event) => {
                expect(event.type).toBe(JobEvent.STOP);
            }),
            "entries": {},
            "stopFlag": false,
        } as unknown as Job;
        
        expect(job.stopFlag).toBe(false);
        expect(job.entries).not.toBeNull();
        
        execute(job);

        expect(job.stopFlag).toBe(true);
        expect(job.entries).toBe(null);
    });
});