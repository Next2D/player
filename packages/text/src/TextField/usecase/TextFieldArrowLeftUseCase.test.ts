import { execute } from "./TextFieldArrowLeftUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldArrowLeftUseCase.js test", () =>
{
    it("execute test case1 - returns early when focusIndex is 0", () =>
    {
        const textField = new TextField();
        textField.focusIndex = 0;
        
        expect(() => {
            execute(textField, false);
        }).not.toThrow();
    });

    it("execute test case2 - handles single character text", () =>
    {
        const textField = new TextField();
        textField.text = "A";
        textField.focusIndex = 2;
        
        expect(() => {
            execute(textField, false);
        }).not.toThrow();
        
        expect(textField.focusIndex).toBe(1);
    });

    it("execute test case3 - handles text without shift key", () =>
    {
        const textField = new TextField();
        textField.text = "Hello";
        textField.focusIndex = 3;
        
        execute(textField, false);
        
        expect(textField.focusIndex).toBe(2);
        expect(textField.selectIndex).toBe(-1);
    });

    it("execute test case4 - handles text with shift key", () =>
    {
        const textField = new TextField();
        textField.text = "Hello";
        textField.focusIndex = 3;
        textField.selectIndex = -1;
        
        execute(textField, true);
        
        expect(textField.focusIndex).toBe(2);
    });

    it("execute test case5 - validates parameter count", () =>
    {
        expect(execute.length).toBe(2);
    });

    it("execute test case6 - verifies function type", () =>
    {
        expect(typeof execute).toBe("function");
    });

    it("execute test case7 - handles multiline text", () =>
    {
        const textField = new TextField();
        textField.multiline = true;
        textField.text = "Line1\nLine2";
        textField.focusIndex = 8;
        
        expect(() => {
            execute(textField, false);
        }).not.toThrow();
    });

    it("execute test case8 - returns undefined", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.focusIndex = 2;
        
        const result = execute(textField, false);
        
        expect(result).toBeUndefined();
    });

    it("execute test case9 - handles focusIndex at 1", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.focusIndex = 1;
        
        expect(() => {
            execute(textField, false);
        }).not.toThrow();
        
        expect(textField.focusIndex).toBe(1);
    });

    it("execute test case10 - handles empty text", () =>
    {
        const textField = new TextField();
        textField.text = "";
        textField.focusIndex = 1;
        
        expect(() => {
            execute(textField, false);
        }).not.toThrow();
    });
});
