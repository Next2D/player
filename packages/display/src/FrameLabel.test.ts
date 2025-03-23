import { FrameLabel } from "./FrameLabel";
import { describe, expect, it } from "vitest";

describe("FrameLabel.js property test", function()
{
    it("property test", function()
    {
        const frameLabel = new FrameLabel("test", 10);
        expect(frameLabel.name).toBe("test");
        expect(frameLabel.frame).toBe(10);
    });
});
