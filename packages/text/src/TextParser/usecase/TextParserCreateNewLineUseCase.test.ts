import { execute } from "./TextParserCreateNewLineUseCase";
import { TextData } from "../../TextData";
import { TextFormat } from "../../TextFormat";
import { describe, expect, it } from "vitest";

describe("TextParserCreateNewLineUseCase.js length test", () =>
{
    it("test case1", () =>
    {
        const textData = new TextData();
        const textFormat = new TextFormat();

        textFormat.size = 12;
        textFormat.font = "Arial";

        expect(textData.heightTable.length).toBe(0);
        expect(textData.ascentTable.length).toBe(0);
        expect(textData.widthTable.length).toBe(0);
        expect(textData.lineTable.length).toBe(0);
        expect(textData.textTable.length).toBe(0);

        execute(textData, textFormat);

        expect(textData.heightTable.length).toBe(1);
        expect(textData.ascentTable.length).toBe(1);
        expect(textData.widthTable.length).toBe(1);
        expect(textData.lineTable.length).toBe(1);
        expect(textData.textTable.length).toBe(1);

        const object = textData.textTable[0];
        expect(object.mode).toBe("break");
        expect(object.text).toBe("");
    });
});