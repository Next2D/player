import { execute } from "./TextFieldCompositionStartService";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldCompositionStartService.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();
        textField.focusIndex = 1;
        expect(textField.focusIndex).toBe(1);
        expect(textField.compositionStartIndex).toBe(-1);

        execute(textField);

        expect(textField.focusIndex).toBe(1);
        expect(textField.compositionStartIndex).toBe(1);
    });
});