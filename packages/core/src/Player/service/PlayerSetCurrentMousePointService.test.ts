import { execute } from "./PlayerSetCurrentMousePointService";
import { $player } from "../../Player";
import { stage } from "@next2d/display";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../Player", () => ({
    $player: {
        rendererWidth: 800,
        rendererHeight: 600,
        rendererScale: 1
    }
}));

vi.mock("@next2d/display", () => ({
    stage: {
        stageWidth: 800,
        stageHeight: 600,
        pointer: {
            x: 0,
            y: 0
        }
    }
}));

vi.mock("../../CoreUtil", () => ({
    $getMainElement: vi.fn(() => null),
    $devicePixelRatio: 1
}));

describe("PlayerSetCurrentMousePointService.js test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        stage.pointer.x = 0;
        stage.pointer.y = 0;
        $player.rendererWidth = 800;
        $player.rendererHeight = 600;
        $player.rendererScale = 1;
        stage.stageWidth = 800;
        stage.stageHeight = 600;
    });

    it("execute test case1 - basic pointer position", () =>
    {
        const mockEvent = {
            pageX: 100,
            pageY: 100,
            target: {
                getBoundingClientRect: vi.fn(() => ({
                    left: 0,
                    top: 0
                }))
            }
        } as unknown as PointerEvent;

        execute(mockEvent);

        expect(stage.pointer.x).toBeGreaterThanOrEqual(0);
        expect(stage.pointer.y).toBeGreaterThanOrEqual(0);
    });

    it("execute test case2 - pointer with offset", () =>
    {
        const mockEvent = {
            pageX: 200,
            pageY: 150,
            target: {
                getBoundingClientRect: vi.fn(() => ({
                    left: 50,
                    top: 50
                }))
            }
        } as unknown as PointerEvent;

        execute(mockEvent);

        expect(stage.pointer.x).toBeDefined();
        expect(stage.pointer.y).toBeDefined();
    });

    it("execute test case3 - scaled renderer", () =>
    {
        $player.rendererScale = 2;
        stage.stageWidth = 400;
        stage.stageHeight = 300;

        const mockEvent = {
            pageX: 400,
            pageY: 300,
            target: {
                getBoundingClientRect: vi.fn(() => ({
                    left: 0,
                    top: 0
                }))
            }
        } as unknown as PointerEvent;

        execute(mockEvent);

        expect(stage.pointer.x).toBeDefined();
        expect(stage.pointer.y).toBeDefined();
    });

    it("execute test case4 - with scroll", () =>
    {
        Object.defineProperty(window, 'scrollX', { value: 100, writable: true });
        Object.defineProperty(window, 'scrollY', { value: 50, writable: true });

        const mockEvent = {
            pageX: 200,
            pageY: 200,
            target: {
                getBoundingClientRect: vi.fn(() => ({
                    left: 0,
                    top: 0
                }))
            }
        } as unknown as PointerEvent;

        execute(mockEvent);

        expect(stage.pointer.x).toBeDefined();
        expect(stage.pointer.y).toBeDefined();

        Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    });
});
