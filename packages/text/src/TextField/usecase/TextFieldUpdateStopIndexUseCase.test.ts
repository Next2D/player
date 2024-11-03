import { execute } from "./TextFieldUpdateStopIndexUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldUpdateStopIndexUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();
        textField.changed = false;

        expect(textField.changed).toBe(false);
        
        execute(textField, 10);

        expect(textField.scrollX).toBe(0);
        expect(textField.scrollY).toBe(0);

        expect(textField.changed).toBe(false);
    });

    it("execute test case2", () =>
    {
        const textField = new TextField();
        textField.text = "testtesttesttesttesttesttesttesttest";
        textField.xMax = 5;
        
        textField.changed = false;
        expect(textField.changed).toBe(false);

        execute(textField, 10);

        expect(textField.scrollX).toBe(1.2903225806451613);
        expect(textField.scrollY).toBe(0);
        expect(textField.changed).toBe(true);
    });
});