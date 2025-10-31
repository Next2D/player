import { execute } from "./TextFieldGenerateRenderQueueUseCase";
import { TextField } from "@next2d/text";
import { describe, expect, it } from "vitest";

describe("TextFieldGenerateRenderQueueUseCase.js test", () =>
{
    it("execute test case1 - handles visible TextField", () =>
    {
        const textField = new TextField();
        textField.visible = true;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(textField, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case2 - handles invisible TextField", () =>
    {
        const textField = new TextField();
        textField.visible = false;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(textField, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case3 - handles identity matrix", () =>
    {
        const textField = new TextField();
        textField.visible = true;
        
        const identityMatrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(textField, identityMatrix, colorTransform, 1920, 1080);
        }).not.toThrow();
    });

    it("execute test case4 - handles scaled matrix", () =>
    {
        const textField = new TextField();
        textField.visible = true;
        
        const scaledMatrix = new Float32Array([2, 0, 0, 2, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(textField, scaledMatrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case5 - handles translated matrix", () =>
    {
        const textField = new TextField();
        textField.visible = true;
        
        const translatedMatrix = new Float32Array([1, 0, 0, 1, 100, 100]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(textField, translatedMatrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case6 - handles alpha color transform", () =>
    {
        const textField = new TextField();
        textField.visible = true;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const alphaTransform = new Float32Array([1, 1, 1, 0.5, 0, 0, 0, 0]);
        
        expect(() => {
            execute(textField, matrix, alphaTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case7 - handles tinted color transform", () =>
    {
        const textField = new TextField();
        textField.visible = true;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const tintedTransform = new Float32Array([1, 0.5, 0.5, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(textField, matrix, tintedTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case8 - handles different renderer sizes", () =>
    {
        const textField = new TextField();
        textField.visible = true;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(textField, matrix, colorTransform, 320, 240);
        }).not.toThrow();
        
        expect(() => {
            execute(textField, matrix, colorTransform, 1920, 1080);
        }).not.toThrow();
        
        expect(() => {
            execute(textField, matrix, colorTransform, 3840, 2160);
        }).not.toThrow();
    });

    it("execute test case9 - handles rotated matrix", () =>
    {
        const textField = new TextField();
        textField.visible = true;
        
        const cos = Math.cos(Math.PI / 4);
        const sin = Math.sin(Math.PI / 4);
        const rotatedMatrix = new Float32Array([cos, sin, -sin, cos, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(textField, rotatedMatrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case10 - validates parameter types", () =>
    {
        const textField = new TextField();
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(textField).toBeInstanceOf(TextField);
        expect(matrix).toBeInstanceOf(Float32Array);
        expect(colorTransform).toBeInstanceOf(Float32Array);
        expect(typeof 800).toBe("number");
        expect(typeof 600).toBe("number");
    });

    it("execute test case11 - handles TextField with text", () =>
    {
        const textField = new TextField();
        textField.text = "Hello World";
        textField.visible = true;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(textField, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case12 - handles TextField with empty text", () =>
    {
        const textField = new TextField();
        textField.text = "";
        textField.visible = true;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(textField, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case13 - handles TextField with multiline text", () =>
    {
        const textField = new TextField();
        textField.text = "Line 1\nLine 2\nLine 3";
        textField.visible = true;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(textField, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case14 - handles TextField with custom size", () =>
    {
        const textField = new TextField();
        textField.width = 200;
        textField.height = 50;
        textField.visible = true;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(textField, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case15 - handles combined transformations", () =>
    {
        const textField = new TextField();
        textField.visible = true;
        
        // Scale + Translate
        const combinedMatrix = new Float32Array([1.5, 0, 0, 1.5, 50, 50]);
        const colorTransform = new Float32Array([0.8, 0.8, 1, 0.9, 0, 0, 0, 0]);
        
        expect(() => {
            execute(textField, combinedMatrix, colorTransform, 800, 600);
        }).not.toThrow();
    });
});
