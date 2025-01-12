import { execute } from "./CanvasBootOffscreenCanvasService";
import { describe, expect, it, vi } from "vitest";

describe("CanvasBootOffscreenCanvasService.js test", () =>
{
    it("execute test case1", () =>
    {
        let state = "";
        const MockCanvas = vi.fn().mockImplementation(() =>
        {
            return {
                "transferControlToOffscreen": vi.fn(() => { state = "ok" })
            } as unknown as HTMLCanvasElement;
        });

        expect(state).toBe("");
        execute(new MockCanvas());
        expect(state).toBe("ok");
    });
});