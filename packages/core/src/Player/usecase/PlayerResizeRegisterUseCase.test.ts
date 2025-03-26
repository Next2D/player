import { execute } from "./PlayerResizeRegisterUseCase";
import { describe, expect, it, vi } from "vitest";

describe("PlayerResizeRegisterUseCase.js test", () =>
{
    it("execute test case", () =>
    {
        let resizeEvent = false;
        window.addEventListener = vi.fn((type) =>
        {
            if ("resize" === type) {
                resizeEvent = true;
            }
        });
        
        expect(resizeEvent).toBe(false);
        execute();
        expect(resizeEvent).toBe(true);
    });
});