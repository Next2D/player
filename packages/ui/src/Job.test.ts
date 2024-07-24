import { Job } from "./Job";
import { describe, expect, it } from "vitest";

describe("Job.js toString test", function()
{
    it("toString test success", function()
    {
        expect(new Job({}, { "name": 0 }, { "name": 1 }).toString()).toBe("[object Job]");
    });
});

describe("Job.js static toString test", function()
{
    it("static toString test", function()
    {
        expect(Job.toString()).toBe("[class Job]");
    });
});

describe("Job.js namespace test", function()
{
    it("namespace test public", function()
    {
        expect(new Job({}, { "name": 0 }, { "name": 1 }).namespace).toBe("next2d.ui.Job");
    });

    it("namespace test static", function()
    {
        expect(Job.namespace).toBe("next2d.ui.Job");
    });
});