import { execute } from "./TextFieldBuildFromCharacterUseCase";
import { TextField } from "../../TextField";
import type { ITextFieldCharacter } from "../../interface/ITextFieldCharacter";
import { describe, expect, it } from "vitest";

describe("TextFieldBuildFromCharacterUseCase.js test", () =>
{
    it("execute test case1 - builds text field from character", () =>
    {
        const textField = new TextField();
        
        const character: ITextFieldCharacter = {
            font: "Arial",
            size: 12,
            align: "left",
            color: 0x000000,
            leading: 2,
            letterSpacing: 0,
            leftMargin: 0,
            rightMargin: 0,
            fontType: 0,
            inputType: "dynamic",
            multiline: false,
            wordWrap: false,
            border: false,
            scroll: false,
            thickness: 0,
            thicknessColor: 0x000000,
            autoSize: 0,
            bounds: { xMin: 0, xMax: 100, yMin: 0, yMax: 20 },
            text: "Test"
        };
        
        expect(() => {
            execute(textField, character);
        }).not.toThrow();
        
        expect(textField.text).toBe("Test");
        expect(textField.defaultTextFormat.font).toBe("Arial");
        expect(textField.defaultTextFormat.size).toBe(12);
    });

    it("execute test case2 - handles bold font type", () =>
    {
        const textField = new TextField();
        
        const character: ITextFieldCharacter = {
            font: "Arial",
            size: 12,
            align: "left",
            color: 0x000000,
            leading: 0,
            letterSpacing: 0,
            leftMargin: 0,
            rightMargin: 0,
            fontType: 1,
            inputType: "dynamic",
            multiline: false,
            wordWrap: false,
            border: false,
            scroll: false,
            thickness: 0,
            thicknessColor: 0x000000,
            autoSize: 0,
            bounds: { xMin: 0, xMax: 100, yMin: 0, yMax: 20 },
            text: "Bold"
        };
        
        execute(textField, character);
        
        expect(textField.defaultTextFormat.bold).toBe(true);
        expect(textField.text).toBe("Bold");
    });

    it("execute test case3 - handles italic font type", () =>
    {
        const textField = new TextField();
        
        const character: ITextFieldCharacter = {
            font: "Arial",
            size: 12,
            align: "center",
            color: 0xFF0000,
            leading: 0,
            letterSpacing: 0,
            leftMargin: 0,
            rightMargin: 0,
            fontType: 2,
            inputType: "dynamic",
            multiline: false,
            wordWrap: false,
            border: false,
            scroll: false,
            thickness: 0,
            thicknessColor: 0x000000,
            autoSize: 0,
            bounds: { xMin: 0, xMax: 100, yMin: 0, yMax: 20 },
            text: "Italic"
        };
        
        execute(textField, character);
        
        expect(textField.defaultTextFormat.italic).toBe(true);
        expect(textField.text).toBe("Italic");
    });

    it("execute test case4 - handles bold and italic font type", () =>
    {
        const textField = new TextField();
        
        const character: ITextFieldCharacter = {
            font: "Arial",
            size: 12,
            align: "right",
            color: 0x0000FF,
            leading: 0,
            letterSpacing: 0,
            leftMargin: 0,
            rightMargin: 0,
            fontType: 3,
            inputType: "dynamic",
            multiline: false,
            wordWrap: false,
            border: false,
            scroll: false,
            thickness: 0,
            thicknessColor: 0x000000,
            autoSize: 0,
            bounds: { xMin: 0, xMax: 100, yMin: 0, yMax: 20 },
            text: "BoldItalic"
        };
        
        execute(textField, character);
        
        expect(textField.defaultTextFormat.bold).toBe(true);
        expect(textField.defaultTextFormat.italic).toBe(true);
        expect(textField.text).toBe("BoldItalic");
    });

    it("execute test case5 - handles multiline text", () =>
    {
        const textField = new TextField();
        
        const character: ITextFieldCharacter = {
            font: "Verdana",
            size: 14,
            align: "left",
            color: 0x000000,
            leading: 0,
            letterSpacing: 0,
            leftMargin: 0,
            rightMargin: 0,
            fontType: 0,
            inputType: "input",
            multiline: true,
            wordWrap: true,
            border: true,
            scroll: true,
            thickness: 1,
            thicknessColor: 0xFF0000,
            autoSize: 0,
            bounds: { xMin: 0, xMax: 200, yMin: 0, yMax: 100 },
            text: "Line1\nLine2"
        };
        
        execute(textField, character);
        
        expect(textField.multiline).toBe(true);
        expect(textField.wordWrap).toBe(true);
        expect(textField.border).toBe(true);
        expect(textField.text).toBe("Line1\nLine2");
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
        
        const character: ITextFieldCharacter = {
            font: "Arial",
            size: 12,
            align: "left",
            color: 0x000000,
            leading: 0,
            letterSpacing: 0,
            leftMargin: 0,
            rightMargin: 0,
            fontType: 0,
            inputType: "dynamic",
            multiline: false,
            wordWrap: false,
            border: false,
            scroll: false,
            thickness: 0,
            thicknessColor: 0x000000,
            autoSize: 0,
            bounds: { xMin: 0, xMax: 100, yMin: 0, yMax: 20 },
            text: "Test"
        };
        
        const result = execute(textField, character);
        
        expect(result).toBeUndefined();
    });

    it("execute test case9 - sets bounds correctly", () =>
    {
        const textField = new TextField();
        
        const character: ITextFieldCharacter = {
            font: "Arial",
            size: 12,
            align: "left",
            color: 0x000000,
            leading: 0,
            letterSpacing: 0,
            leftMargin: 0,
            rightMargin: 0,
            fontType: 0,
            inputType: "dynamic",
            multiline: false,
            wordWrap: false,
            border: false,
            scroll: false,
            thickness: 0,
            thicknessColor: 0x000000,
            autoSize: 0,
            bounds: { xMin: 10, xMax: 110, yMin: 5, yMax: 25 },
            text: "Test"
        };
        
        execute(textField, character);
        
        expect(textField.xMin).toBe(10);
        expect(textField.xMax).toBe(110);
        expect(textField.yMin).toBe(5);
        expect(textField.yMax).toBe(29);
    });

    it("execute test case10 - handles empty text", () =>
    {
        const textField = new TextField();
        
        const character: ITextFieldCharacter = {
            font: "Arial",
            size: 12,
            align: "left",
            color: 0x000000,
            leading: 0,
            letterSpacing: 0,
            leftMargin: 0,
            rightMargin: 0,
            fontType: 0,
            inputType: "dynamic",
            multiline: false,
            wordWrap: false,
            border: false,
            scroll: false,
            thickness: 0,
            thicknessColor: 0x000000,
            autoSize: 0,
            bounds: { xMin: 0, xMax: 100, yMin: 0, yMax: 20 },
            text: ""
        };
        
        expect(() => {
            execute(textField, character);
        }).not.toThrow();
        
        expect(textField.text).toBe("");
    });
});
