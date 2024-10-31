import { execute } from "./TextFieldGetTextDataUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldGetTextDataUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();
        
        expect(textField.$textData).toBe(null);
        
        const value = "test";
        textField.text = value;
        execute(textField);

        const textTable = textField.$textData?.textTable;
        if (!textTable) {
            throw new Error("textTable is null");
        }

        for (let idx = 0; idx < 4; ++idx) {
            expect(textTable[idx + 1].text).toBe(value[idx]);
        }
    });
});