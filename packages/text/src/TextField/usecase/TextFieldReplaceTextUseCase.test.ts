import { execute } from "./TextFieldReplaceTextUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldReplaceTextUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();
        textField.text = "abc";

        execute(textField, "xyz", 0, 0)
        expect(textField.text).toBe("xyzabc");
    });

    it("execute test case2", () =>
    {
        const textField = new TextField();
        textField.text = "abc";

        execute(textField, "xyz", 2, 3)
        expect(textField.text).toBe("abxyz");
    });
});