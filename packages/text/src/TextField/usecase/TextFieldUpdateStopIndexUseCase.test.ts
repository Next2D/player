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

        expect(execute(textField, 10)).toBe(null);

        expect(textField.changed).toBe(false);
    });

    it("execute test case2", () =>
    {
        const textField = new TextField();
        textField.text = "testtesttesttesttesttesttesttesttest";
        textField.xMax = 5;
        
        textField.changed = false;
        expect(textField.changed).toBe(false);

        const point = execute(textField, 10);
        if (!point) {
            throw new Error("point is null");
        }

        expect(point.x).toBe(1.2903225806451613);
        expect(point.y).toBe(0);
        expect(textField.changed).toBe(true);
    });
});