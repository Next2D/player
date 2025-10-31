import { execute } from "./TextFieldInsertTextUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldInsertTextUseCase.js test", () =>
{
    it("execute test case1 - returns early when focusIndex is -1", () =>
    {
        const textField = new TextField();
        textField.focusIndex = -1;
        
        expect(() => {
            execute(textField, "test");
        }).not.toThrow();
    });

    it("execute test case2 - returns early when compositionStartIndex is active", () =>
    {
        const textField = new TextField();
        textField.focusIndex = 1;
        textField.compositionStartIndex = 1;
        
        expect(() => {
            execute(textField, "test");
        }).not.toThrow();
    });

    it("execute test case3 - inserts single character", () =>
    {
        const textField = new TextField();
        textField.text = "";
        textField.focusIndex = 1;
        
        expect(() => {
            execute(textField, "a");
        }).not.toThrow();
    });

    it("execute test case4 - inserts multiple characters", () =>
    {
        const textField = new TextField();
        textField.text = "";
        textField.focusIndex = 1;
        
        expect(() => {
            execute(textField, "Hello");
        }).not.toThrow();
    });

    it("execute test case5 - handles text with existing content", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.focusIndex = 3;
        
        expect(() => {
            execute(textField, "X");
        }).not.toThrow();
    });

    it("execute test case6 - validates parameter count", () =>
    {
        expect(execute.length).toBe(2);
    });

    it("execute test case7 - verifies function type", () =>
    {
        expect(typeof execute).toBe("function");
    });

    it("execute test case8 - returns undefined", () =>
    {
        const textField = new TextField();
        textField.text = "";
        textField.focusIndex = 1;
        
        const result = execute(textField, "test");
        
        expect(result).toBeUndefined();
    });

    it("execute test case9 - handles Japanese text", () =>
    {
        const textField = new TextField();
        textField.text = "";
        textField.focusIndex = 1;
        
        expect(() => {
            execute(textField, "あいうえお");
        }).not.toThrow();
    });

    it("execute test case10 - resets selectIndex", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.focusIndex = 2;
        textField.selectIndex = 4;
        
        execute(textField, "X");
        
        expect(textField.selectIndex).toBe(-1);
    });
});
