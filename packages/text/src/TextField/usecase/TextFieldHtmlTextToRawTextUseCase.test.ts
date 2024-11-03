import { execute } from "./TextFieldHtmlTextToRawTextUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldHtmlTextToRawTextUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();
        textField.htmlText = "<p><span>te</span><i>s</i><u>t</u></p>";
        expect(execute(textField)).toBe("test");
    });
});