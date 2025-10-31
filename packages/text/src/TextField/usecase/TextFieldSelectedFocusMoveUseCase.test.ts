import { execute } from "./TextFieldSelectedFocusMoveUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldSelectedFocusMoveUseCase.js test", () =>
{
    it("execute test case1 - returns early when selectIndex is -1", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.selectIndex = -1;
        
        expect(() => {
            execute(textField);
        }).not.toThrow();
    });

    it("execute test case2 - handles single line text", () =>
    {
        const textField = new TextField();
        textField.text = "Hello World";
        textField.selectIndex = 5;
        
        expect(() => {
            execute(textField);
        }).not.toThrow();
    });

    it("execute test case3 - handles multiline text", () =>
    {
        const textField = new TextField();
        textField.multiline = true;
        textField.text = "Line1\nLine2\nLine3";
        textField.selectIndex = 8;
        
        expect(() => {
            execute(textField);
        }).not.toThrow();
    });

    it("execute test case4 - validates parameter count", () =>
    {
        expect(execute.length).toBe(1);
    });

    it("execute test case5 - verifies function type", () =>
    {
        expect(typeof execute).toBe("function");
    });

    it("execute test case6 - handles normal selectIndex", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.selectIndex = 2;
        
        expect(() => {
            execute(textField);
        }).not.toThrow();
    });

    it("execute test case7 - handles empty text", () =>
    {
        const textField = new TextField();
        textField.text = "";
        textField.selectIndex = 1;
        
        expect(() => {
            execute(textField);
        }).not.toThrow();
    });

    it("execute test case8 - handles text with scrolling", () =>
    {
        const textField = new TextField();
        textField.text = "This is a long text that requires scrolling";
        textField.selectIndex = 20;
        textField.scrollX = 10;
        textField.scrollY = 5;
        
        expect(() => {
            execute(textField);
        }).not.toThrow();
    });

    it("execute test case9 - can be called multiple times", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.selectIndex = 2;
        
        expect(() => {
            execute(textField);
            execute(textField);
        }).not.toThrow();
    });

    it("execute test case10 - handles selectIndex at start of text", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.selectIndex = 1;
        
        expect(() => {
            execute(textField);
        }).not.toThrow();
    });
});
