import { execute } from "./TextAreaInputUseCase";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { $setSelectedTextField } from "../../TextUtil";
import { TextField } from "../../TextField";
import { Event } from "@next2d/events";

describe("TextAreaInputUseCase.js test", () =>
{
    afterEach(() =>
    {
        $setSelectedTextField(null);
    });

    it("execute test case1 - handles when event data is null", () =>
    {
        const event = new InputEvent("input", { data: null });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case2 - handles when event data is empty", () =>
    {
        const event = new InputEvent("input", { data: "" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case3 - handles when no text field is selected", () =>
    {
        $setSelectedTextField(null);
        
        const event = new InputEvent("input", { data: "test" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case4 - handles when text field is selected", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new InputEvent("input", { data: "test" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case5 - returns undefined", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new InputEvent("input", { data: "test" });
        const result = execute(event);
        
        expect(result).toBeUndefined();
    });

    it("execute test case6 - handles single character input", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new InputEvent("input", { data: "a" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case7 - handles multiple character input", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new InputEvent("input", { data: "Hello World" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case8 - handles number input", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new InputEvent("input", { data: "123" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case9 - handles special characters", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new InputEvent("input", { data: "!@#$" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case10 - validates parameter count", () =>
    {
        expect(execute.length).toBe(1);
    });

    it("execute test case11 - verifies function type", () =>
    {
        expect(typeof execute).toBe("function");
    });

    it("execute test case12 - handles Japanese input", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new InputEvent("input", { data: "あいうえお" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case13 - handles space input", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new InputEvent("input", { data: " " });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case14 - handles sequential inputs", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        expect(() => {
            execute(new InputEvent("input", { data: "H" }));
            execute(new InputEvent("input", { data: "e" }));
            execute(new InputEvent("input", { data: "l" }));
            execute(new InputEvent("input", { data: "l" }));
            execute(new InputEvent("input", { data: "o" }));
        }).not.toThrow();
    });

    it("execute test case15 - handles mixed content input", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new InputEvent("input", { data: "Test123!あ" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });
});
