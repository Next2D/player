import { execute } from "./TextParserParsePlainTextUseCase";
import type { ITextObject } from "../../interface/ITextObject";
import { TextData } from "../../TextData";
import { TextFormat } from "../../TextFormat";
import { describe, expect, it } from "vitest";

describe("TextParserParsePlainTextUseCase.js length test", () =>
{
    it("test case1", () =>
    {
        const textFormat = new TextFormat();
        textFormat.size = 24;
        textFormat.font = "Arial";

        const texts = "あいうえお順";
        const textData = execute(texts, textFormat, {
            "width": 200,
            "multiline": true,
            "wordWrap": true,
            "subFontSize": 0,
            "textFormats": null
        });

        expect(textData.textTable.length).toBe(7);

        for (let idx = 1; idx < textData.textTable.length; ++idx) {
            const object = textData.textTable[idx];
            expect(object.text).toBe(texts[idx - 1]);
            expect(object.textFormat.size).toBe(24);
            expect(object.textFormat.font).toBe("Arial");
        }
    });
});