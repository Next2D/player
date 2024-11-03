import { execute } from "./TextFieldSetScrollXUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldSetScrollXUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();

        textField.scrollEnabled = false;
        expect(execute(textField, 10)).toBe(0);

        textField.scrollEnabled = true;
        textField.autoSize = "center";
        expect(execute(textField, 10)).toBe(0);

        textField.scrollEnabled = true;
        textField.autoSize = "none";
        expect(execute(textField, 10)).toBe(10);
    });
});