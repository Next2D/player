import { execute } from "./TextFieldGenerateFontStyleService";
import { describe, expect, it } from "vitest";
import type { ITextFormat } from "../../interface/ITextFormat";

describe("TextFieldGenerateFontStyleService.js test", () =>
{
    it("execute test", () =>
    {
        const mockTextFormat = {
            italic: true,
            bold: true,
            size: 12,
            font: "Arial",
        } as ITextFormat;
        expect(execute(mockTextFormat)).toBe("italic bold 12px 'Arial','sans-serif'");
    });
});