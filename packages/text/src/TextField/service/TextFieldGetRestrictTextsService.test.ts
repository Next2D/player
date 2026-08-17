import { execute } from "./TextFieldGetRestrictTextsService";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldGetRestrictTextsService.js test", () =>
{
    it("execute test case1 - no restriction when restrict is empty", () =>
    {
        const textField = new TextField();
        textField.restrict = "";

        expect(execute(textField, "Hello World!")).toBe("Hello World!");
    });

    it("execute test case2 - allows only listed characters", () =>
    {
        const textField = new TextField();
        textField.restrict = "abc";

        expect(execute(textField, "abcdef")).toBe("abc");
        expect(execute(textField, "cabbage")).toBe("cabba");
        expect(execute(textField, "xyz")).toBe("");
    });

    it("execute test case3 - allows range a-z", () =>
    {
        const textField = new TextField();
        textField.restrict = "a-z";

        expect(execute(textField, "Hello World 123")).toBe("elloorld");
        expect(execute(textField, "abcxyz")).toBe("abcxyz");
    });

    it("execute test case4 - allows multiple ranges a-z0-9", () =>
    {
        const textField = new TextField();
        textField.restrict = "a-z0-9";

        expect(execute(textField, "Abc123!@#")).toBe("bc123");
    });

    it("execute test case5 - denies single character with ^A", () =>
    {
        const textField = new TextField();
        textField.restrict = "^A";

        expect(execute(textField, "ABCabc")).toBe("BCabc");
    });

    it("execute test case6 - denies range with ^A-Z", () =>
    {
        const textField = new TextField();
        textField.restrict = "^A-Z";

        expect(execute(textField, "Hello World 123")).toBe("ello orld 123");
    });

    it("execute test case7 - escaped hyphen allows literal -", () =>
    {
        const textField = new TextField();
        textField.restrict = "\\-";

        expect(execute(textField, "a-b-c")).toBe("--");
    });

    it("execute test case8 - escaped caret allows literal ^", () =>
    {
        const textField = new TextField();
        textField.restrict = "\\^";

        expect(execute(textField, "a^b^c")).toBe("^^");
    });

    it("execute test case9 - unicode range \\u3041-\\u3093", () =>
    {
        const textField = new TextField();
        textField.restrict = "ぁ-ん";

        expect(execute(textField, "あいうえお")).toBe("あいうえお");
        expect(execute(textField, "アイウあエオん")).toBe("あん");
        expect(execute(textField, "abcあ123")).toBe("あ");
    });

    it("execute test case10 - allow and deny combination", () =>
    {
        const textField = new TextField();
        textField.restrict = "a-z^bc";

        expect(execute(textField, "abcdef")).toBe("adef");
    });

    it("execute test case11 - returns empty string as is", () =>
    {
        const textField = new TextField();
        textField.restrict = "a-z";

        expect(execute(textField, "")).toBe("");
    });

    it("execute test case12 - validates parameter count", () =>
    {
        expect(execute.length).toBe(2);
    });
});
