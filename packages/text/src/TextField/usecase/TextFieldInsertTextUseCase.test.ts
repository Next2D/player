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

    it("execute test case11 - restrict filters denied characters", () =>
    {
        const textField = new TextField();
        textField.restrict = "0-9";
        textField.text = "";
        textField.focusIndex = 1;

        execute(textField, "a1b2c3");

        expect(textField.text).toBe("123");
    });

    it("execute test case12 - restrict blocks all characters", () =>
    {
        const textField = new TextField();
        textField.restrict = "0-9";
        textField.text = "";
        textField.focusIndex = 1;

        execute(textField, "abc");

        expect(textField.text).toBe("");
    });

    it("execute test case13 - maxChars truncates input", () =>
    {
        const textField = new TextField();
        textField.maxChars = 3;
        textField.text = "";
        textField.focusIndex = 1;

        execute(textField, "abcdef");

        expect(textField.text).toBe("abc");
    });

    it("execute test case14 - maxChars blocks input at limit", () =>
    {
        const textField = new TextField();
        textField.maxChars = 4;
        textField.text = "Test";
        textField.focusIndex = 3;

        execute(textField, "X");

        expect(textField.text).toBe("Test");
    });
});
