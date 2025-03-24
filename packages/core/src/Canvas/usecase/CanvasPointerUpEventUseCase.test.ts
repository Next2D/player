import { execute } from "./CanvasPointerUpEventUseCase";
import { describe, expect, it, vi } from "vitest";

describe("CanvasPointerUpEventUseCase.js test", () =>
{
    it("execute test case1", () =>
    {

        const canvas = document.createElement("canvas");

        let pointerId = 0;
        canvas.releasePointerCapture = vi.fn((pointer_id) => pointerId = pointer_id);
        
        const mockEvent = {
            "target": canvas,
            "pointerId": 100
        } as unknown as PointerEvent;
        
        expect(pointerId).toBe(0);
        execute(mockEvent);
        expect(pointerId).toBe(100);
    });
});