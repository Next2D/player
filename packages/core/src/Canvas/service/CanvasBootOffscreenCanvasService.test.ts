import { execute } from "./CanvasBootOffscreenCanvasService";
import { describe, expect, it, vi } from "vitest";

describe("CanvasBootOffscreenCanvasService.js test", () =>
{
    it("execute test case1", () =>
    {
        let state = "";
        const MockCanvas = vi.fn(function(this: any) {
            this.transferControlToOffscreen = vi.fn(() => { state = "ok" });
        }) as any;

        expect(state).toBe("");
        execute(new MockCanvas());
        expect(state).toBe("ok");
    });
});