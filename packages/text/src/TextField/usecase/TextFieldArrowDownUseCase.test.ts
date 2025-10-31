import { execute } from "./TextFieldArrowDownUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldArrowDownUseCase.js test", () =>
{
    it("execute test case1 - returns early when focusIndex is -1", () =>
    {
        const textField = new TextField();
        textField.focusIndex = -1;
        
        expect(() => {
            execute(textField, false);
        }).not.toThrow();
    });

    it("execute test case2 - handles single line text", () =>
    {
        const textField = new TextField();
        textField.text = "Hello";
        textField.focusIndex = 1;
        
        expect(() => {
            execute(textField, false);
        }).not.toThrow();
    });

    it("execute test case3 - handles multiline text without shift key", () =>
    {
        const textField = new TextField();
        textField.multiline = true;
        textField.text = "Line1\nLine2\nLine3";
        textField.focusIndex = 1;
        
        expect(() => {
            execute(textField, false);
        }).not.toThrow();
    });

    it("execute test case4 - handles multiline text with shift key", () =>
    {
        const textField = new TextField();
        textField.multiline = true;
        textField.text = "Line1\nLine2\nLine3";
        textField.focusIndex = 1;
        
        expect(() => {
            execute(textField, true);
        }).not.toThrow();
    });

    it("execute test case5 - validates parameter count", () =>
    {
        expect(execute.length).toBe(2);
    });

    it("execute test case6 - verifies function type", () =>
    {
        expect(typeof execute).toBe("function");
    });

    it("execute test case7 - handles empty text", () =>
    {
        const textField = new TextField();
        textField.text = "";
        textField.focusIndex = 1;
        
        expect(() => {
            execute(textField, false);
        }).not.toThrow();
    });

    it("execute test case8 - returns undefined", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.focusIndex = 1;
        
        const result = execute(textField, false);
        
        expect(result).toBeUndefined();
    });

    it("execute test case9 - handles focusIndex at 0", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.focusIndex = 0;
        
        expect(() => {
            execute(textField, false);
        }).not.toThrow();
    });

    it("execute test case10 - handles long multiline text", () =>
    {
        const textField = new TextField();
        textField.multiline = true;
        textField.text = "Line1\nLine2\nLine3\nLine4\nLine5";
        textField.focusIndex = 1;
        
        expect(() => {
            execute(textField, false);
        }).not.toThrow();
    });
});
