import { execute } from "./PlayerGamepadConnectService";
import { $gamepadButtonStates, $gamepadAxisStates } from "../../GamepadState";
import { stage } from "@next2d/display";
import { GamepadEvent } from "@next2d/events";
import { describe, expect, it, vi, beforeEach } from "vitest";

describe("PlayerGamepadConnectService.js test", () =>
{
    beforeEach(() =>
    {
        $gamepadButtonStates.clear();
        $gamepadAxisStates.clear();
    });

    it("execute test case: gamepad is null", () =>
    {
        const mockEvent = { "gamepad": null } as unknown as GamepadEvent;

        stage.hasEventListener = vi.fn().mockReturnValue(true);
        stage.dispatchEvent = vi.fn();

        execute(mockEvent);
        expect(stage.dispatchEvent).not.toHaveBeenCalled();
    });

    it("execute test case: no stage listener", () =>
    {
        const mockEvent = {
            "gamepad": { "index": 0, "buttons": [{}], "axes": [0] }
        } as unknown as GamepadEvent;

        let result = "";
        stage.hasEventListener = vi.fn().mockReturnValue(false);
        stage.dispatchEvent = vi.fn((event) =>
        {
            result = event.type;
        });

        execute(mockEvent);
        expect($gamepadButtonStates.has(0)).toBe(true);
        expect($gamepadAxisStates.has(0)).toBe(true);
        expect(result).toBe("");
    });

    it("execute test case: dispatches GAMEPAD_CONNECTED", () =>
    {
        const mockEvent = {
            "gamepad": { "index": 1, "buttons": [{}, {}, {}], "axes": [0, 0] }
        } as unknown as GamepadEvent;

        let result = "";
        let gamepadIndex = -1;
        stage.hasEventListener = vi.fn().mockReturnValue(true);
        stage.dispatchEvent = vi.fn((event: GamepadEvent) =>
        {
            result = event.type;
            gamepadIndex = event.gamepadIndex;
        });

        execute(mockEvent);
        expect($gamepadButtonStates.get(1)).toEqual([false, false, false]);
        expect($gamepadAxisStates.get(1)).toEqual([0, 0]);
        expect(result).toBe("gamepadconnected");
        expect(gamepadIndex).toBe(1);
    });
});
