import { execute } from "./TextFieldBlinkingUseCase";
import { TextField } from "../../TextField";
import { $getBlinkingTimerId } from "../../TextUtil";
import { describe, expect, it } from "vitest";

describe("TextFieldBlinkingUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();
        textField.changed = false;
        textField.focusVisible = false;

        expect(textField.changed).toBe(false);
        expect(textField.focusVisible).toBe(false);
        expect($getBlinkingTimerId()).toBe(undefined);
        
        execute(textField);

        expect(textField.changed).toBe(true);
        expect(textField.focusVisible).toBe(true);

        clearTimeout($getBlinkingTimerId());

    });
});