import { execute } from "./TextFieldPasteService";
import { TextField } from "../../TextField";
import { describe, expect, it, beforeEach, afterAll } from "vitest";

describe("TextFieldPasteService.js test", () =>
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
        await navigator
            .clipboard
            .writeText("あいうえお\nかきくけこ\nさしすせそ");
        
        

        const textField = new TextField();
        textField.multiline = true;
        textField.focusIndex  = 1;
        textField.selectIndex = 99;

        textField.text = "xyz";
        expect(textField.text).toBe("xyz");

        await execute(textField);
        expect(textField.text).toBe("あいうえお\nかきくけこ\nさしすせそ");
    });
});