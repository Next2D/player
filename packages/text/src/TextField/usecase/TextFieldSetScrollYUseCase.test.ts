import { execute } from "./TextFieldSetScrollYUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldSetScrollYUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();
        textField.multiline = true;
        textField.wordWrap = true;

        textField.scrollEnabled = false;
        execute(textField, 10);
        expect(textField.scrollY).toBe(0);

        textField.scrollEnabled = true;
        textField.autoSize = "center";
        execute(textField, 10);

        expect(textField.scrollY).toBe(0);

        textField.scrollEnabled = true;
        textField.autoSize = "none";
        textField.multiline = false;
        textField.wordWrap  = false;

        execute(textField, 10);
        expect(textField.scrollY).toBe(0);
    });
});