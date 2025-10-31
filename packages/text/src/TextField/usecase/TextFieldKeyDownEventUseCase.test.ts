import { execute } from "./TextFieldKeyDownEventUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it, vi } from "vitest";

describe("TextFieldKeyDownEventUseCase.js test", () =>
{
    it("execute test case1 - returns early when focusIndex is -1", () =>
    {
        const textField = new TextField();
        textField.focusIndex = -1;
        
        const event = new KeyboardEvent("keydown", { key: "a" });
        
        expect(() => {
            execute(textField, event);
        }).not.toThrow();
    });

    it("execute test case2 - handles Backspace key", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.focusIndex = 2;
        textField.deleteText = vi.fn();
        
        const event = new KeyboardEvent("keydown", { key: "Backspace" });
        
        execute(textField, event);
        
        expect(textField.deleteText).toHaveBeenCalled();
    });

    it("execute test case3 - handles Delete key", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.focusIndex = 2;
        textField.deleteText = vi.fn();
        
        const event = new KeyboardEvent("keydown", { key: "Delete" });
        
        execute(textField, event);
        
        expect(textField.deleteText).toHaveBeenCalled();
    });

    it("execute test case4 - handles Enter key", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.focusIndex = 2;
        textField.insertText = vi.fn();
        
        const event = new KeyboardEvent("keydown", { key: "Enter" });
        
        execute(textField, event);
        
        expect(textField.insertText).toHaveBeenCalledWith("\n");
    });

    it("execute test case5 - handles ArrowLeft key", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.focusIndex = 2;
        
        const event = new KeyboardEvent("keydown", { key: "ArrowLeft" });
        
        expect(() => {
            execute(textField, event);
        }).not.toThrow();
    });

    it("execute test case6 - handles ArrowRight key", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.focusIndex = 2;
        
        const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
        
        expect(() => {
            execute(textField, event);
        }).not.toThrow();
    });

    it("execute test case7 - handles ArrowUp key", () =>
    {
        const textField = new TextField();
        textField.multiline = true;
        textField.text = "Line1\nLine2";
        textField.focusIndex = 8;
        
        const event = new KeyboardEvent("keydown", { key: "ArrowUp" });
        
        expect(() => {
            execute(textField, event);
        }).not.toThrow();
    });

    it("execute test case8 - handles ArrowDown key", () =>
    {
        const textField = new TextField();
        textField.multiline = true;
        textField.text = "Line1\nLine2";
        textField.focusIndex = 2;
        
        const event = new KeyboardEvent("keydown", { key: "ArrowDown" });
        
        expect(() => {
            execute(textField, event);
        }).not.toThrow();
    });

    it("execute test case9 - handles Ctrl+A (select all)", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.focusIndex = 2;
        textField.selectAll = vi.fn();
        
        const event = new KeyboardEvent("keydown", { key: "a", ctrlKey: true });
        
        execute(textField, event);
        
        expect(textField.selectAll).toHaveBeenCalled();
    });

    it("execute test case10 - handles Ctrl+C (copy)", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.focusIndex = 2;
        textField.copy = vi.fn();
        
        const event = new KeyboardEvent("keydown", { key: "c", ctrlKey: true });
        
        execute(textField, event);
        
        expect(textField.copy).toHaveBeenCalled();
    });

    it("execute test case11 - handles Ctrl+V (paste)", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.focusIndex = 2;
        textField.paste = vi.fn();
        
        const event = new KeyboardEvent("keydown", { key: "v", ctrlKey: true });
        
        execute(textField, event);
        
        expect(textField.paste).toHaveBeenCalled();
    });

    it("execute test case12 - handles regular key press", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.focusIndex = 2;
        
        const event = new KeyboardEvent("keydown", { key: "x" });
        
        expect(() => {
            execute(textField, event);
        }).not.toThrow();
    });

    it("execute test case13 - validates parameter count", () =>
    {
        expect(execute.length).toBe(2);
    });

    it("execute test case14 - verifies function type", () =>
    {
        expect(typeof execute).toBe("function");
    });

    it("execute test case15 - returns undefined", () =>
    {
        const textField = new TextField();
        textField.text = "Test";
        textField.focusIndex = 2;
        
        const event = new KeyboardEvent("keydown", { key: "a" });
        const result = execute(textField, event);
        
        expect(result).toBeUndefined();
    });
});
