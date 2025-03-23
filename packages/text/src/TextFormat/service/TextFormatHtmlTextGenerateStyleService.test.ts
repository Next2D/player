import { execute } from "./TextFormatHtmlTextGenerateStyleService";
import { execute as textFormatSetDefaultService } from "./TextFormatSetDefaultService";
import { TextFormat } from "../../TextFormat";
import { describe, expect, it } from "vitest";

describe("TextFormatHtmlTextGenerateStyleService.js length test", () =>
{
    it("test case1", () =>
    {
        expect(execute(new TextFormat())).toBe("");
    });

    it("test case2", () =>
    {
        const textFormat = new TextFormat();
        textFormatSetDefaultService(textFormat);
        expect(execute(textFormat)).toBe("font-family: Times New Roman;font-size: 12px;text-align: left;");
    });

    it("test case3", () =>
    {
        const textFormat = new TextFormat();
        
        textFormat.font = "Arial";
        textFormat.size = 20;
        textFormat.color = 0xFF0000;
        textFormat.bold = true;
        textFormat.italic = true;
        textFormat.underline = true;
        textFormat.align = "center";
        textFormat.leftMargin = 10;
        textFormat.rightMargin = 15;
        textFormat.leading = 5;
        textFormat.letterSpacing = 2;
        
        expect(execute(textFormat)).toBe("font-family: Arial;font-size: 20px;color: #ff0000;font-weight: bold;font-style: italic;text-decoration: underline;text-align: center;margin-left: 10px;margin-right: 15px;margin-bottom: 5px;letter-spacing: 2px;");
    });
});