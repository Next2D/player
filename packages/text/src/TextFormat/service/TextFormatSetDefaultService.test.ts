import { execute } from "./TextFormatSetDefaultService";
import { TextFormat } from "../../TextFormat";
import { describe, expect, it } from "vitest";

describe("TextFormatSetDefaultService.js length test", () =>
{
    it("default test case1", () =>
    {
        const textFormat = new TextFormat();

        expect(textFormat.align).toBeNull();
        expect(textFormat.bold).toBeNull();
        expect(textFormat.color).toBeNull();
        expect(textFormat.font).toBeNull();
        expect(textFormat.italic).toBeNull();
        expect(textFormat.leading).toBeNull();
        expect(textFormat.leftMargin).toBeNull();
        expect(textFormat.letterSpacing).toBeNull();
        expect(textFormat.rightMargin).toBeNull();
        expect(textFormat.size).toBeNull();
        expect(textFormat.underline).toBeNull();

        execute(textFormat);

        expect(textFormat.align).toBe("left");
        expect(textFormat.bold).toBe(false);
        expect(textFormat.color).toBe(0);
        expect(textFormat.font).toBe("Times New Roman");
        expect(textFormat.italic).toBe(false);
        expect(textFormat.leading).toBe(0);
        expect(textFormat.leftMargin).toBe(0);
        expect(textFormat.letterSpacing).toBe(0);
        expect(textFormat.rightMargin).toBe(0);
        expect(textFormat.size).toBe(12);
        expect(textFormat.underline).toBe(false);
    });
});