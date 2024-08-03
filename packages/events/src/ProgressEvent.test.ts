import { ProgressEvent } from "./ProgressEvent";
import { describe, expect, it } from "vitest";

describe("ProgressEvent.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new ProgressEvent("test").namespace).toBe("next2d.events.ProgressEvent");
    });

    it("namespace test static", () =>
    {
        expect(ProgressEvent.namespace).toBe("next2d.events.ProgressEvent");
    });
});

describe("ProgressEvent.js property test", () =>
{
    it("PROGRESS test", () => {
        expect(ProgressEvent.PROGRESS).toBe("progress");
    });
});