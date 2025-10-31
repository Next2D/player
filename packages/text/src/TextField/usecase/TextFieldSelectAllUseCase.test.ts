import { execute } from "./TextFieldSelectAllUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldSelectAllUseCase.js test", () =>
{
    it("execute test case1 - selects all text in text field", () =>
    {
        const textField = new TextField();
        textField.text = "Hello World";
        
        expect(() => {
            execute(textField);
        }).not.toThrow();
    });

    it("execute test case2 - returns early when text table is too short", () =>
    {
        const textField = new TextField();
        textField.text = "";
        
        expect(() => {
            execute(textField);
        }).not.toThrow();
    });

    it("execute test case3 - sets selectIndex to 1", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        
        execute(textField);
        
        expect(textField.selectIndex).toBe(1);
    });

    it("execute test case4 - handles multiline text", () =>
    {
        const textField = new TextField();
        textField.multiline = true;
        textField.text = "Line1\nLine2\nLine3";
        
        expect(() => {
            execute(textField);
        }).not.toThrow();
        
        expect(textField.selectIndex).toBe(1);
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
        
        const result = execute(textField);
        
        expect(result).toBeUndefined();
    });

    it("execute test case8 - handles long text", () =>
    {
        const textField = new TextField();
        textField.text = "This is a very long text that should be selected entirely";
        
        expect(() => {
            execute(textField);
        }).not.toThrow();
        
        expect(textField.selectIndex).toBe(1);
    });

    it("execute test case9 - handles Japanese text", () =>
    {
        const textField = new TextField();
        textField.text = "日本語のテキスト";
        
        expect(() => {
            execute(textField);
        }).not.toThrow();
        
        expect(textField.selectIndex).toBe(1);
    });

    it("execute test case10 - can be called multiple times", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        
        expect(() => {
            execute(textField);
            execute(textField);
        }).not.toThrow();
    });
});
