import { execute } from "./TextFieldSetFocusUseCase";
import { FocusEvent } from "@next2d/events";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldSetFocusUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();

        textField.changed = false;
        expect(textField.changed).toBe(false);
        
        execute(textField, FocusEvent.FOCUS_IN);
        expect(textField.changed).toBe(true);
    });
});