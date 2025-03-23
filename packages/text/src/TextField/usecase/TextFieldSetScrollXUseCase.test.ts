import { execute } from "./TextFieldSetScrollXUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldSetScrollXUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();

        textField.scrollEnabled = false;
        execute(textField, 10);

        expect(textField.$scrollX).toBe(0);

        textField.scrollEnabled = true;
        textField.autoSize = "center";
        execute(textField, 10);

        expect(textField.$scrollX).toBe(0);
    });
});