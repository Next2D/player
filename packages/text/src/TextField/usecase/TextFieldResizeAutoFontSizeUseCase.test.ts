import { execute } from "./TextFieldResizeAutoFontSizeUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";
import { TextData } from "../../TextData";

describe("TextFieldResizeAutoFontSizeUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();

        textField.text = "かきくけこ";
        textField.changed = false;
        expect(textField.changed).toBe(false);
        
        execute(textField);
        console.log(textField.$textData.textTable[1].textFormat);
        // expect(textField.$textData).toBe(null);
        // expect(textField.changed).toBe(true);
    });
});