import { FrameLabel } from "./FrameLabel";
import { describe, expect, it } from "vitest";

describe("FrameLabel.js namespace test", function()
{
    it("namespace test public", function()
    {
        expect(new FrameLabel("", 1).namespace).toBe("next2d.display.FrameLabel");
    });

    it("namespace test static", function()
    {
        expect(FrameLabel.namespace).toBe("next2d.display.FrameLabel");
    });
});

describe("FrameLabel.js property test", function()
{
    it("property test", function()
    {
        const frameLabel = new FrameLabel("test", 10);
        expect(frameLabel.name).toBe("test");
        expect(frameLabel.frame).toBe(10);
    });
});
