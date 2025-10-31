import { execute } from "./TextFieldCompositionEndUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it, afterEach } from "vitest";

describe("TextFieldCompositionEndUseCase.js test", () =>
{
    afterEach(() =>
    {
        // Cleanup if needed
    });

    it("execute test case1 - handles when compositionEndIndex is -1", () =>
    {
        const textField = new TextField();
        textField.compositionEndIndex = -1;
        textField.text = "Test";
        
        expect(() => {
            execute(textField);
        }).not.toThrow();
    });

    it("execute test case2 - handles when compositionEndIndex is greater than -1", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.compositionStartIndex = 1;
        textField.compositionEndIndex = 3;
        
        expect(() => {
            execute(textField);
        }).not.toThrow();
    });

    it("execute test case3 - resets composition indices", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.compositionStartIndex = 1;
        textField.compositionEndIndex = 3;
        
        execute(textField);
        
        expect(textField.compositionStartIndex).toBe(-1);
        expect(textField.compositionEndIndex).toBe(-1);
    });

    it("execute test case4 - resets selectIndex", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.selectIndex = 2;
        textField.compositionStartIndex = 1;
        textField.compositionEndIndex = 3;
        
        execute(textField);
        
        expect(textField.selectIndex).toBe(-1);
    });

    it("execute test case5 - validates parameter count", () =>
    {
        expect(execute.length).toBe(1);
    });

    it("execute test case6 - verifies function type", () =>
    {
        expect(typeof execute).toBe("function");
    });

    it("execute test case7 - returns undefined", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.compositionStartIndex = 1;
        textField.compositionEndIndex = 3;
        
        const result = execute(textField);
        
        expect(result).toBeUndefined();
    });

    it("execute test case8 - handles empty text", () =>
    {
        const textField = new TextField();
        textField.text = "";
        textField.compositionStartIndex = -1;
        textField.compositionEndIndex = -1;
        
        expect(() => {
            execute(textField);
        }).not.toThrow();
    });

    it("execute test case9 - handles multiline text", () =>
    {
        const textField = new TextField();
        textField.multiline = true;
        textField.text = "Line1\nLine2";
        textField.compositionStartIndex = 1;
        textField.compositionEndIndex = 5;
        
        expect(() => {
            execute(textField);
        }).not.toThrow();
    });

    it("execute test case10 - can be called multiple times", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.compositionStartIndex = 1;
        textField.compositionEndIndex = 3;
        
        expect(() => {
            execute(textField);
            execute(textField);
        }).not.toThrow();
    });
});
