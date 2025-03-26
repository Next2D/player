import { execute } from "./PlayerRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { KeyboardEvent } from "@next2d/events";

describe("PlayerRegisterEventUseCase.js test", () =>
{
    it("execute test case", () =>
    {
        let keyDown = false;
        let keyUp = false;
        window.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case KeyboardEvent.KEY_DOWN:
                    keyDown = true;
                    break;

                case KeyboardEvent.KEY_UP:
                    keyUp = true;
                    break;

                default:
                    break;

            }
        });
        
        expect(keyDown).toBe(false);
        expect(keyUp).toBe(false);
        execute();
        expect(keyDown).toBe(true);
        expect(keyUp).toBe(true);
    });
});