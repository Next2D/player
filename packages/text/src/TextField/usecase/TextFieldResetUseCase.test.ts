import { execute } from "./TextFieldResetUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";
import { TextData } from "../../TextData";

describe("TextFieldResetUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();

        textField.changed = false;
        expect(textField.changed).toBe(false);
        
        textField.$textData = new TextData();
        expect(textField.$textData !== null).toBe(true);

        execute(textField);
        expect(textField.$textData).toBe(null);
        expect(textField.changed).toBe(true);
    });
});