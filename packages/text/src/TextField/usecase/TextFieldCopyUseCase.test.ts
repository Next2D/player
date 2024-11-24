import { execute } from "./TextFieldCopyUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldCopyUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();
        textField.focusIndex  = 11;
        textField.selectIndex = 15;

        textField.htmlText = `
<p>line1</p>
<p>line2</p>
<p>line3</p>
`;
        expect(execute(textField)).toBe("line3");
    });

    it("execute test case2", () =>
    {
        const textField = new TextField();
        textField.focusIndex  = 6;
        textField.selectIndex = 10;

        textField.text = `あいうえお
かきくけこ
さしすせそ`;

        expect(execute(textField)).toBe("かきくけこ");
    });

    it("execute test case2", () =>
    {
        const textField = new TextField();
        textField.multiline = true;
        textField.focusIndex  = 1;
        textField.selectIndex = 99;

        textField.text = `あいうえお
かきくけこ
さしすせそ`;

        expect(execute(textField)).toBe("あいうえお\nかきくけこ\nさしすせそ");
    });
});