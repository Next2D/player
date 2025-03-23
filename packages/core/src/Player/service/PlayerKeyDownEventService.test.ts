import { execute } from "./PlayerKeyDownEventService";
import { stage } from "@next2d/display";
import { describe, expect, it, vi } from "vitest";

describe("PlayerKeyDownEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        const mockKeyboardEvent = {
            "type": "keydown",
        } as unknown as KeyboardEvent;

        let result = "ok"
        stage.hasEventListener = vi.fn().mockReturnValue(false);
        stage.dispatchEvent = vi.fn((event) =>
        {
            result = event.type;
        });

        execute(mockKeyboardEvent);
        expect(result).toBe("ok");
    });

    it("execute test case2", () =>
    {
        const mockKeyboardEvent = {
            "type": "keydown",
        } as unknown as KeyboardEvent;

        let result = "ok"
        stage.hasEventListener = vi.fn().mockReturnValue(true);
        stage.dispatchEvent = vi.fn((event) =>
        {
            result = event.type;
        });

        execute(mockKeyboardEvent);
        expect(result).toBe("keydown");
    });
});