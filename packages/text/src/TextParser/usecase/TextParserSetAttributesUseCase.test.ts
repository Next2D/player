import { execute } from "./TextParserSetAttributesUseCase";
import { execute as textParserParseStyleService } from "../service/TextParserParseStyleService";
import { TextData } from "../../TextData";
import { TextFormat } from "../../TextFormat";
import { describe, expect, it } from "vitest";

describe("TextParserSetAttributesUseCase.js length test", () =>
{
    it("test case1", () =>
    {
        const value = "font-size: 12px; font-family: 'Arial'; letter-spacing: 1px; margin-bottom: 2px; margin-left: 3px; margin-right: 4px; color: #000000; align: center; text-decoration: underline; font-weight: bold; font-style: italic;";

        const attributes = textParserParseStyleService(value);
        const textFormat = new TextFormat();

        expect(textFormat.size).toBe(null);
        expect(textFormat.font).toBe(null);
        expect(textFormat.letterSpacing).toBe(null);
        expect(textFormat.leading).toBe(null);
        expect(textFormat.leftMargin).toBe(null);
        expect(textFormat.rightMargin).toBe(null);
        expect(textFormat.color).toBe(null);
        expect(textFormat.align).toBe(null);
        expect(textFormat.underline).toBe(null);
        expect(textFormat.bold).toBe(null);
        expect(textFormat.italic).toBe(null);

        execute(attributes, textFormat, {
            "width": 200,
            "multiline": true,
            "wordWrap": true,
            "subFontSize": 0,
            "textFormats": null
        });

        expect(textFormat.size).toBe(12);
        expect(textFormat.font).toBe("Arial");
        expect(textFormat.letterSpacing).toBe(1);
        expect(textFormat.leading).toBe(2);
        expect(textFormat.leftMargin).toBe(3);
        expect(textFormat.rightMargin).toBe(4);
        expect(textFormat.color).toBe(0x000000);
        expect(textFormat.align).toBe("center");
        expect(textFormat.underline).toBe(true);
        expect(textFormat.bold).toBe(true);
        expect(textFormat.italic).toBe(true);
    });
});