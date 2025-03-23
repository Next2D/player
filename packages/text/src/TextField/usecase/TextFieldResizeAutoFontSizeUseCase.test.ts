import { execute } from "./TextFieldResizeAutoFontSizeUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldResizeAutoFontSizeUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();

        expect(textField.defaultTextFormat.size).toBe(12);

        textField.text = "かきくけこ";
        textField.changed = false;

        textField.xMax = 5;
        textField.yMax = 5;

        expect(textField.changed).toBe(false);
        
        execute(textField);

        const textFormat = textField.$textData?.textTable[1].textFormat;
        if (!textFormat) {
            throw new Error("textFormat is null");
        }

        expect(textFormat.size).toBe(1);
        expect(textField.changed).toBe(true);
    });
});