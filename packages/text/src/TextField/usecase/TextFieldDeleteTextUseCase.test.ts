import { execute } from "./TextFieldDeleteTextUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it } from "vitest";

describe("TextFieldDeleteTextUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();

        textField.text = "あいうえおかきくけこさしすせそ";
        textField.focusIndex  = 6;
        textField.selectIndex = 10;

        execute(textField);

        expect(textField.text).toBe("あいうえおさしすせそ");
    });

    it("execute test case2", () =>
    {
        const textField = new TextField();

        textField.text = "あいうえおかきくけこさしすせそ";
        textField.focusIndex  = 0;
        textField.selectIndex = 15;

        execute(textField);

        expect(textField.text).toBe("");
    });
});