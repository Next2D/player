import { execute } from "./DisplayObjectBlendToNumberService";
import { describe, expect, it } from "vitest";

describe("DisplayObjectBlendToNumberService.js test", () =>
{
    it("execute test case", () =>
    {
        expect(execute("copy")).toBe(0);
        expect(execute("add")).toBe(1);
        expect(execute("alpha")).toBe(2);
        expect(execute("darken")).toBe(3);
        expect(execute("difference")).toBe(4);
        expect(execute("erase")).toBe(5);
        expect(execute("hardlight")).toBe(6);
        expect(execute("invert")).toBe(7);
        expect(execute("layer")).toBe(8);
        expect(execute("lighten")).toBe(9);
        expect(execute("multiply")).toBe(10);
        expect(execute("normal")).toBe(11);
        expect(execute("overlay")).toBe(12);
        expect(execute("screen")).toBe(13);
        expect(execute("subtract")).toBe(14);
    });
});