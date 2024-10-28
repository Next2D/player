import { execute } from "./TextParserParseTextUseCase";
import { execute as textParserCreateNewLineUseCase } from "./TextParserCreateNewLineUseCase";
import { TextData } from "../../TextData";
import { TextFormat } from "../../TextFormat";
import { describe, expect, it } from "vitest";

describe("TextParserParseTextUseCase.js length test", () =>
{
    it("test case1", () =>
    {
        const textData = new TextData();
        const textFormat = new TextFormat();

        textFormat.size = 24;
        textFormat.font = "Arial";

        textParserCreateNewLineUseCase(textData, textFormat);

        const texts = "あいうえお順";
        execute(texts, textFormat, textData, {
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