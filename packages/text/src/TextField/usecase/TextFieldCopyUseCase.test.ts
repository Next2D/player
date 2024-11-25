import { execute } from "./TextFieldCopyUseCase";
import { TextField } from "../../TextField";
import { describe, expect, it, beforeEach, afterAll } from "vitest";

describe("TextFieldCopyUseCase.js test", () =>
{
    beforeEach(() => {
        Object.assign(navigator, {
            "clipboard": {
                "text": "",
                readText () 
                {
                    return Promise.resolve(this.text);
                },
                writeText (data: string) 
                {
                    this.text = data;
                    return Promise.resolve();
                }
            }
        });
    });

    afterAll(() => {
        Object.assign(navigator, { "clipboard": undefined });
    });

    it("execute test case1", async () =>
    {
        const textField = new TextField();
        textField.focusIndex  = 11;
        textField.selectIndex = 15;

        textField.htmlText = `
<p>line1</p>
<p>line2</p>
<p>line3</p>
`;

        await execute(textField);

        navigator
            .clipboard
            .readText().then((text) =>
            {
                expect(text).toBe("line3");
            });
    });

    it("execute test case2", async () =>
    {
        const textField = new TextField();
        textField.focusIndex  = 6;
        textField.selectIndex = 10;

        textField.text = `あいうえお
かきくけこ
さしすせそ`;

        await execute(textField);

        navigator
            .clipboard
            .readText().then((text) =>
            {
                expect(text).toBe("かきくけこ");
            });
    });

    it("execute test case3", async () =>
    {
        const textField = new TextField();
        textField.multiline = true;
        textField.focusIndex  = 1;
        textField.selectIndex = 99;

        textField.text = `あいうえお
かきくけこ
さしすせそ`;

        await execute(textField);

        navigator
            .clipboard
            .readText().then((text) =>
            {
                expect(text).toBe("あいうえお\nかきくけこ\nさしすせそ");
            });
    });
});