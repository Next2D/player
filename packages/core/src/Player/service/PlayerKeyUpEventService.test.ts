import { execute } from "./PlayerKeyUpEventService";
import { $stage } from "@next2d/display";
import { describe, expect, it, vi } from "vitest";

describe("PlayerKeyUpEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        const mockKeyboardEvent = {
            "type": "keyup",
        } as unknown as KeyboardEvent;

        let result = "ok"
        $stage.hasEventListener = vi.fn().mockReturnValue(false);
        $stage.dispatchEvent = vi.fn((event) =>
        {
            result = event.type;
        });

        execute(mockKeyboardEvent);
        expect(result).toBe("ok");
    });

    it("execute test case2", () =>
    {
        const mockKeyboardEvent = {
            "type": "keyup",
        } as unknown as KeyboardEvent;

        let result = "ok"
        $stage.hasEventListener = vi.fn().mockReturnValue(true);
        $stage.dispatchEvent = vi.fn((event) =>
        {
            result = event.type;
        });

        execute(mockKeyboardEvent);
        expect(result).toBe("keyup");
    });
});