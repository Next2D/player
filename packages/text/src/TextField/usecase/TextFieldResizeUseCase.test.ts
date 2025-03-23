import { execute } from "./TextFieldResizeUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldResizeUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();

        textField.changed = false;
        expect(textField.changed).toBe(false);

        textField.xMax = 200;
        textField.yMax = 200;
        expect(textField.xMin).toBe(0);
        expect(textField.yMin).toBe(0);
        expect(textField.xMax).toBe(200);
        expect(textField.yMax).toBe(200);
        
        execute(textField);

        expect(textField.xMin).toBe(0);
        expect(textField.yMin).toBe(0);
        expect(textField.xMax).toBe(100);
        expect(textField.yMax).toBe(100);
        expect(textField.changed).toBe(true);
    });

    it("execute test case2", () =>
    {
        const textField = new TextField();
        textField.autoSize = "left";

        textField.xMax = 200;
        textField.yMax = 200;
        expect(textField.xMin).toBe(0);
        expect(textField.yMin).toBe(0);
        expect(textField.xMax).toBe(200);
        expect(textField.yMax).toBe(200);
        
        execute(textField);

        expect(textField.xMin).toBe(0);
        expect(textField.yMin).toBe(0);
        expect(textField.xMax).toBe(4);
        expect(textField.yMax).toBe(4);
    });
});