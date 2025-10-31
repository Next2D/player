import { execute } from "./TextAreaCompositionUpdateUseCase";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { $setSelectedTextField } from "../../TextUtil";
import { TextField } from "../../TextField";

describe("TextAreaCompositionUpdateUseCase.js test", () =>
{
    afterEach(() =>
    {
        $setSelectedTextField(null);
    });

    it("execute test case1 - handles when no text field is selected", () =>
    {
        $setSelectedTextField(null);
        
        const event = new CompositionEvent("compositionupdate", { data: "test" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case2 - handles when text field is selected", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new CompositionEvent("compositionupdate", { data: "test" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case3 - returns undefined", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new CompositionEvent("compositionupdate", { data: "test" });
        const result = execute(event);
        
        expect(result).toBeUndefined();
    });

    it("execute test case4 - handles different data values", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event1 = new CompositionEvent("compositionupdate", { data: "a" });
        const event2 = new CompositionEvent("compositionupdate", { data: "あ" });
        const event3 = new CompositionEvent("compositionupdate", { data: "abc" });
        
        expect(() => {
            execute(event1);
            execute(event2);
            execute(event3);
        }).not.toThrow();
    });

    it("execute test case5 - handles empty data", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new CompositionEvent("compositionupdate", { data: "" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case6 - handles Japanese characters", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new CompositionEvent("compositionupdate", { data: "にほんご" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case7 - handles Chinese characters", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new CompositionEvent("compositionupdate", { data: "中文" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case8 - handles Korean characters", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new CompositionEvent("compositionupdate", { data: "한글" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case9 - validates parameter count", () =>
    {
        expect(execute.length).toBe(1);
    });

    it("execute test case10 - verifies function type", () =>
    {
        expect(typeof execute).toBe("function");
    });

    it("execute test case11 - handles multiple sequential updates", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        expect(() => {
            execute(new CompositionEvent("compositionupdate", { data: "t" }));
            execute(new CompositionEvent("compositionupdate", { data: "te" }));
            execute(new CompositionEvent("compositionupdate", { data: "tes" }));
            execute(new CompositionEvent("compositionupdate", { data: "test" }));
        }).not.toThrow();
    });

    it("execute test case12 - handles special characters", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new CompositionEvent("compositionupdate", { data: "!@#$%^&*()" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case13 - handles numbers", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new CompositionEvent("compositionupdate", { data: "1234567890" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case14 - handles spaces", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new CompositionEvent("compositionupdate", { data: "   " });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });

    it("execute test case15 - handles mixed content", () =>
    {
        const textField = new TextField();
        $setSelectedTextField(textField);
        
        const event = new CompositionEvent("compositionupdate", { data: "Test123 あいう" });
        
        expect(() => {
            execute(event);
        }).not.toThrow();
    });
});
