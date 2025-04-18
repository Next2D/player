import { execute } from "./CanvasRegisterEventUseCase";
import {
    PointerEvent,
    WheelEvent
} from "@next2d/events";
import { describe, expect, it, vi } from "vitest";

describe("CanvasRegisterEventUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        let results: string[] = [];
        const MockCanvas = {
            "addEventListener": vi.fn((event: string) => 
            {
                results.push(event);
            })
        } as unknown as HTMLCanvasElement;

        execute(MockCanvas);
        expect(results.length).toBe(7);

        expect(results[0]).toBe(PointerEvent.POINTER_UP);
        expect(results[1]).toBe(PointerEvent.POINTER_DOWN);
        expect(results[2]).toBe(PointerEvent.POINTER_UP);
        expect(results[3]).toBe(PointerEvent.POINTER_CANCEl);
        expect(results[4]).toBe(PointerEvent.POINTER_MOVE);
        expect(results[5]).toBe(PointerEvent.POINTER_LEAVE);
        expect(results[6]).toBe(WheelEvent.WHEEL);
    });
});