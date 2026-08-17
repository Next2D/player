import { execute } from "./TextFieldGetMaxCharsTextsService";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldGetMaxCharsTextsService.js test", () =>
{
    it("execute test case1 - no restriction when maxChars is 0", () =>
    {
        const textField = new TextField();
        textField.maxChars = 0;

        expect(execute(textField, "Hello", 100)).toBe("Hello");
    });

    it("execute test case2 - allows input within maxChars", () =>
    {
        const textField = new TextField();
        textField.maxChars = 10;

        expect(execute(textField, "Hello", 0)).toBe("Hello");
        expect(execute(textField, "Hello", 5)).toBe("Hello");
    });

    it("execute test case3 - truncates input over maxChars", () =>
    {
        const textField = new TextField();
        textField.maxChars = 5;

        expect(execute(textField, "Hello World", 0)).toBe("Hello");
        expect(execute(textField, "Hello", 3)).toBe("He");
    });

    it("execute test case4 - returns empty string when already at limit", () =>
    {
        const textField = new TextField();
        textField.maxChars = 5;

        expect(execute(textField, "Hello", 5)).toBe("");
        expect(execute(textField, "Hello", 10)).toBe("");
    });

    it("execute test case5 - returns empty string as is", () =>
    {
        const textField = new TextField();
        textField.maxChars = 5;

        expect(execute(textField, "", 0)).toBe("");
    });

    it("execute test case6 - validates parameter count", () =>
    {
        expect(execute.length).toBe(3);
    });
});
