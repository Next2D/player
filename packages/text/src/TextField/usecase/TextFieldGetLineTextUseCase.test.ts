import { execute } from "./TextFieldGetLineTextUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldGetLineTextUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();
        textField.multiline = true;

        textField.htmlText = `
<p>line1</p>
<p>line2</p>
<p>line3</p>
`;
        expect(execute(textField, 2)).toBe("line2");
    });
});