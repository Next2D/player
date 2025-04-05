import { execute } from "./TextAreaRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";

describe("TextAreaRegisterEventUseCase Test", () =>
{
    it("test case", () =>
    {
        const textArea = document.createElement("textarea");

        let compositionstart = false;
        let compositionupdate = false;
        let compositionend = false;
        let input = false;
        textArea.addEventListener = vi.fn((type) =>
        {
            switch (type) {
                case "compositionstart":
                    compositionstart = true;
                    break;

                case "compositionupdate":
                    compositionupdate = true;
                    break;

                case "compositionend":
                    compositionend = true;
                    break;

                case "input":
                    input = true;
                    break;

                default:
                    break;
            }
        });

        expect(compositionstart).toBe(false);
        expect(compositionupdate).toBe(false);
        expect(compositionend).toBe(false);
        expect(input).toBe(false);

        execute(textArea);

        expect(compositionstart).toBe(true);
        expect(compositionupdate).toBe(true);
        expect(compositionend).toBe(true);
        expect(input).toBe(true);
    });
});