import { execute } from "./TextFormatGenerateFontStyleService";
import { TextFormat } from "../../TextFormat";
import { describe, expect, it } from "vitest";

describe("TextFormatGenerateFontStyleService.js length test", () =>
{
    it("test case1", () =>
    {
        const textFormat  = new TextFormat();
        textFormat.italic = true;
        textFormat.bold   = true;
        textFormat.size   = 12;
        textFormat.font   = "Arial";
        expect(execute(textFormat)).toBe("italic bold 12px 'Arial',sans-serif");
    });

    it("test case2", () =>
    {
        const textFormat  = new TextFormat();
        textFormat.italic = false;
        textFormat.bold   = true;
        textFormat.size   = 12;
        textFormat.font   = "Arial";
        expect(execute(textFormat)).toBe("bold 12px 'Arial',sans-serif");
    });

    it("test case3", () =>
    {
        const textFormat  = new TextFormat();
        textFormat.italic = true;
        textFormat.bold   = false;
        textFormat.size   = 12;
        textFormat.font   = "Arial";
        expect(execute(textFormat)).toBe("italic 12px 'Arial',sans-serif");
    });

    it("test case4", () =>
    {
        const textFormat  = new TextFormat();
        textFormat.italic = false;
        textFormat.bold   = false;
        textFormat.size   = 12;
        textFormat.font   = "Arial";
        expect(execute(textFormat)).toBe("12px 'Arial',sans-serif");
    });
});