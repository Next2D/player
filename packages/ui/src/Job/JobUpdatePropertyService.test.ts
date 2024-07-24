import { execute } from "./JobUpdatePropertyService";
import { execute as jobEntriesService } from "./JobEntriesService";
import { Job } from "../Job";
import { describe, expect, it } from "vitest";

describe("JobUpdatePropertyService.js method test", () =>
{
    it("test case1", () =>
    {
        const target = { "a": 1, "b": 2 };
        const from = { "a": 0, "b": 0 };
        const to = { "a": 10, "b": 20 };
        const job = new Job(target, from, to);
        const entries = jobEntriesService(from);

        execute(job, target, from, to, entries);

        expect(target.a).toBe(0);
        expect(target.b).toBe(0);
    });

    it("test case2", () =>
    {
        const target = { "a": 1, "b": 2 };
        const from = { "a": 0, "b": 0 };
        const to = { "a": 10, "b": 20 };
        const job = new Job(target, from, to);
        const entries = jobEntriesService(from);

        job.duration = -1;

        execute(job, target, from, to, entries);
        expect(target.a).toBe(10);
        expect(target.b).toBe(20);
    });

    it("test case3", () =>
    {
        const target = {
            "a": 1,
            "b": 2,
            "color": {
                "red": 128
            }
        };
        const from = { "a": 0, "b": 0, "color": { "red": 0 } };
        const to = { "a": 10, "b": 20, "color": { "red": 255 }  };
        const job = new Job(target, from, to);
        const entries = jobEntriesService(from);

        execute(job, target, from, to, entries);

        expect(target.a).toBe(0);
        expect(target.b).toBe(0);
        expect(target.color.red).toBe(0);

        job.duration = -1;

        execute(job, target, from, to, entries);
        expect(target.a).toBe(10);
        expect(target.b).toBe(20);
        expect(target.color.red).toBe(255);
    });
});