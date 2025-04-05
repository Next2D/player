import { execute } from "./TextFormatGetWidthMarginService";
import { TextFormat } from "../../TextFormat";
import { describe, expect, it } from "vitest";

describe("TextFormatGetWidthMarginService.js test", () =>
{
    it("test case1", () =>
    {
        const textFormat  = new TextFormat();
        expect(execute(textFormat)).toBe(0);
    });

    it("test case2", () =>
    {
        const textFormat  = new TextFormat();
        textFormat.leftMargin = 10;
        expect(execute(textFormat)).toBe(10);
    });

    it("test case3", () =>
    {
        const textFormat  = new TextFormat();
        textFormat.rightMargin = 20;
        expect(execute(textFormat)).toBe(20);
    });

    it("test case4", () =>
    {
        const textFormat  = new TextFormat();
        textFormat.leftMargin = 10;
        textFormat.rightMargin = 20;
        expect(execute(textFormat)).toBe(30);
    });
});