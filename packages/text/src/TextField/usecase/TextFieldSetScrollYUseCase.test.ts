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
        expect(execute(textField, 10)).toBe(0);

        textField.scrollEnabled = true;
        textField.autoSize = "center";
        expect(execute(textField, 10)).toBe(0);

        textField.scrollEnabled = true;
        textField.autoSize = "none";

        expect(execute(textField, 10)).toBe(10);

        textField.multiline = false;
        textField.wordWrap = false;
        expect(execute(textField, 10)).toBe(0);
    });
});