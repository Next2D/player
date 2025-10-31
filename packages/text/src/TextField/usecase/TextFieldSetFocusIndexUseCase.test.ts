import { execute } from "./TextFieldSetFocusIndexUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldSetFocusIndexUseCase.js test", () =>
{
    it("execute test case1 - returns early when type is not input", () =>
    {
        const textField = new TextField();
        textField.type = "dynamic";
        
        expect(() => {
            execute(textField, 100, 100);
        }).not.toThrow();
    });

    it("execute test case2 - handles input type text field", () =>
    {
        const textField = new TextField();
        textField.type = "input";
        textField.text = "Hello";
        
        expect(() => {
            execute(textField, 10, 10);
        }).not.toThrow();
    });

    it("execute test case3 - handles empty text field", () =>
    {
        const textField = new TextField();
        textField.type = "input";
        textField.text = "";
        
        expect(() => {
            execute(textField, 10, 10);
        }).not.toThrow();
        
        expect(textField.focusIndex).toBe(1);
        expect(textField.selectIndex).toBe(-1);
    });

    it("execute test case4 - handles without selection", () =>
    {
        const textField = new TextField();
        textField.type = "input";
        textField.text = "Test";
        
        execute(textField, 10, 10, false);
        
        expect(textField.selectIndex).toBe(-1);
    });

    it("execute test case5 - handles with selection", () =>
    {
        const textField = new TextField();
        textField.type = "input";
        textField.text = "Test";
        textField.focusIndex = 2;
        
        expect(() => {
            execute(textField, 10, 10, true);
        }).not.toThrow();
    });

    it("execute test case6 - validates parameter count", () =>
    {
        expect(execute.length).toBe(3);
    });

    it("execute test case7 - verifies function type", () =>
    {
        expect(typeof execute).toBe("function");
    });

    it("execute test case8 - handles multiline text", () =>
    {
        const textField = new TextField();
        textField.type = "input";
        textField.multiline = true;
        textField.text = "Line1\nLine2\nLine3";
        
        expect(() => {
            execute(textField, 10, 10);
        }).not.toThrow();
    });

    it("execute test case9 - handles different stage coordinates", () =>
    {
        const textField = new TextField();
        textField.type = "input";
        textField.text = "Test";
        
        expect(() => {
            execute(textField, 50, 50);
            execute(textField, 100, 100);
            execute(textField, 0, 0);
        }).not.toThrow();
    });

    it("execute test case10 - default selected parameter is false", () =>
    {
        const textField = new TextField();
        textField.type = "input";
        textField.text = "Test";
        
        execute(textField, 10, 10);
        
        expect(textField.selectIndex).toBe(-1);
    });

    it("execute test case11 - handles text with scrolling", () =>
    {
        const textField = new TextField();
        textField.type = "input";
        textField.text = "This is a long text";
        textField.scrollX = 10;
        textField.scrollY = 5;
        
        expect(() => {
            execute(textField, 10, 10);
        }).not.toThrow();
    });

    it("execute test case12 - handles negative coordinates", () =>
    {
        const textField = new TextField();
        textField.type = "input";
        textField.text = "Test";
        
        expect(() => {
            execute(textField, -10, -10);
        }).not.toThrow();
    });

    it("execute test case13 - handles large coordinates", () =>
    {
        const textField = new TextField();
        textField.type = "input";
        textField.text = "Test";
        
        expect(() => {
            execute(textField, 1000, 1000);
        }).not.toThrow();
    });

    it("execute test case14 - handles Japanese text", () =>
    {
        const textField = new TextField();
        textField.type = "input";
        textField.text = "日本語テキスト";
        
        expect(() => {
            execute(textField, 10, 10);
        }).not.toThrow();
    });
});
