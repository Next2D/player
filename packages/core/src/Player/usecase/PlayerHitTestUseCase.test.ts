import { execute } from "./PlayerHitTestUseCase";
import { $player } from "../../Player";
import { stage } from "@next2d/display";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../Player", () => ({
    $player: {
        stopFlag: false,
        mouseState: "up"
    }
}));

vi.mock("@next2d/display", () => ({
    stage: {
        pointer: {
            x: 0,
            y: 0
        },
        $mouseHit: vi.fn()
    }
}));

vi.mock("../../CoreUtil", () => ({
    $hitContext: {
        beginPath: vi.fn(),
        setTransform: vi.fn()
    },
    $hitObject: {
        x: 0,
        y: 0,
        pointer: "auto",
        hit: null
    },
    $hitMatrix: new Float32Array([1, 0, 0, 1, 0, 0]),
    $getCanvas: vi.fn(() => ({
        style: {
            cursor: "auto"
        }
    }))
}));

describe("PlayerHitTestUseCase.js test", () =>
{
    beforeEach(async () => {
        vi.clearAllMocks();
        $player.stopFlag = false;
        $player.mouseState = "up";
        
        const { $hitObject } = await import("../../CoreUtil");
        $hitObject.pointer = "auto";
        $hitObject.hit = null;
        
        // Reset stage.$mouseHit mock to not modify $hitObject by default
        vi.mocked(stage.$mouseHit).mockImplementation(() => {
            // Do nothing by default
        });
    });

    it("execute test case1 - return early when stopped", async () =>
    {
        $player.stopFlag = true;

        const { $hitContext } = await import("../../CoreUtil");

        execute();

        expect($hitContext.beginPath).not.toHaveBeenCalled();
    });

    it("execute test case2 - perform hit test when running", async () =>
    {
        $player.stopFlag = false;
        stage.pointer.x = 100;
        stage.pointer.y = 50;

        const { $hitContext, $hitObject } = await import("../../CoreUtil");

        execute();

        expect($hitContext.beginPath).toHaveBeenCalled();
        expect($hitContext.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
        expect(stage.$mouseHit).toHaveBeenCalled();
        expect($hitObject.x).toBe(100);
        expect($hitObject.y).toBe(50);
    });

    it("execute test case3 - update cursor when mouse state is up", async () =>
    {
        $player.stopFlag = false;
        $player.mouseState = "up";

        const { $hitObject, $getCanvas } = await import("../../CoreUtil");

        // Mock stage.$mouseHit to change the pointer
        vi.mocked(stage.$mouseHit).mockImplementation(() => {
            $hitObject.pointer = "pointer";
        });

        const mockCanvas = {
            style: {
                cursor: "auto"
            }
        };
        vi.mocked($getCanvas).mockReturnValue(mockCanvas as any);

        execute();

        expect(mockCanvas.style.cursor).toBe("pointer");
    });

    it("execute test case4 - do not update cursor when mouse state is down", async () =>
    {
        $player.stopFlag = false;
        $player.mouseState = "down";

        const { $hitObject, $getCanvas } = await import("../../CoreUtil");
        $hitObject.pointer = "pointer";

        const mockCanvas = {
            style: {
                cursor: "auto"
            }
        };
        vi.mocked($getCanvas).mockReturnValue(mockCanvas as any);

        execute();

        // Cursor should not change when mouse is down
        expect($getCanvas).not.toHaveBeenCalled();
    });

    it("execute test case5 - reset hit object properties", async () =>
    {
        $player.stopFlag = false;

        const { $hitObject } = await import("../../CoreUtil");

        execute();

        expect($hitObject.pointer).toBe("auto");
        expect($hitObject.hit).toBe(null);
    });
});
