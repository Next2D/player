import { ProgressEvent } from "./ProgressEvent";
import { describe, expect, it } from "vitest";

describe("ProgressEvent.js property test", () =>
{
    it("PROGRESS test", () => {
        expect(ProgressEvent.PROGRESS).toBe("progress");
    });
});