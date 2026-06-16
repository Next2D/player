import { execute } from "./PlayerGamepadTickerService";
import { $gamepadButtonStates, $gamepadAxisStates } from "../../GamepadState";
import { stage } from "@next2d/display";
import { GamepadEvent } from "@next2d/events";
import { describe, expect, it, vi, beforeEach } from "vitest";

const mockGetGamepads = vi.fn();
Object.defineProperty(navigator, "getGamepads", {
    "value": mockGetGamepads,
    "writable": true,
    "configurable": true
});

describe("PlayerGamepadTickerService.js test", () =>
{
    beforeEach(() =>
    {
        $gamepadButtonStates.clear();
        $gamepadAxisStates.clear();
    });

    it("execute test case: no connected gamepads", () =>
    {
        mockGetGamepads.mockReturnValue([]);
        stage.dispatchEvent = vi.fn();
        execute();
        expect(stage.dispatchEvent).not.toHaveBeenCalled();
    });

    it("execute test case: button pressed dispatches BUTTON_DOWN", () =>
    {
        $gamepadButtonStates.set(0, [false, false]);
        $gamepadAxisStates.set(0, [0, 0]);

        const mockGamepad = {
            "index": 0,
            "buttons": [
                { "pressed": true, "value": 1.0 },
                { "pressed": false, "value": 0.0 }
            ],
            "axes": [0, 0]
        } as unknown as Gamepad;

        mockGetGamepads.mockReturnValue([mockGamepad]);

        const events: GamepadEvent[] = [];
        stage.hasEventListener = vi.fn().mockReturnValue(true);
        stage.dispatchEvent = vi.fn((event: GamepadEvent) =>
        {
            events.push(event);
        });

        execute();

        expect(events.length).toBe(1);
        expect(events[0].type).toBe("gamepadbuttondown");
        expect(events[0].gamepadIndex).toBe(0);
        expect(events[0].buttonIndex).toBe(0);
        expect(events[0].buttonValue).toBe(1.0);
        expect($gamepadButtonStates.get(0)).toEqual([true, false]);
    });

    it("execute test case: button released dispatches BUTTON_UP", () =>
    {
        $gamepadButtonStates.set(0, [true, false]);
        $gamepadAxisStates.set(0, [0, 0]);

        const mockGamepad = {
            "index": 0,
            "buttons": [
                { "pressed": false, "value": 0.0 },
                { "pressed": false, "value": 0.0 }
            ],
            "axes": [0, 0]
        } as unknown as Gamepad;

        mockGetGamepads.mockReturnValue([mockGamepad]);

        const events: GamepadEvent[] = [];
        stage.hasEventListener = vi.fn().mockReturnValue(true);
        stage.dispatchEvent = vi.fn((event: GamepadEvent) =>
        {
            events.push(event);
        });

        execute();

        expect(events.length).toBe(1);
        expect(events[0].type).toBe("gamepadbuttonup");
        expect(events[0].gamepadIndex).toBe(0);
        expect(events[0].buttonIndex).toBe(0);
    });

    it("execute test case: axis motion within dead zone does not dispatch", () =>
    {
        $gamepadButtonStates.set(0, [false]);
        $gamepadAxisStates.set(0, [0, 0]);

        const mockGamepad = {
            "index": 0,
            "buttons": [{ "pressed": false, "value": 0.0 }],
            "axes": [0.05, 0.0]
        } as unknown as Gamepad;

        mockGetGamepads.mockReturnValue([mockGamepad]);

        stage.hasEventListener = vi.fn().mockReturnValue(true);
        stage.dispatchEvent = vi.fn();

        execute();
        expect(stage.dispatchEvent).not.toHaveBeenCalled();
    });

    it("execute test case: axis motion beyond dead zone dispatches AXES_MOTION", () =>
    {
        $gamepadButtonStates.set(0, [false]);
        $gamepadAxisStates.set(0, [0, 0]);

        const mockGamepad = {
            "index": 0,
            "buttons": [{ "pressed": false, "value": 0.0 }],
            "axes": [0.8, 0.0]
        } as unknown as Gamepad;

        mockGetGamepads.mockReturnValue([mockGamepad]);

        const events: GamepadEvent[] = [];
        stage.hasEventListener = vi.fn().mockReturnValue(true);
        stage.dispatchEvent = vi.fn((event: GamepadEvent) =>
        {
            events.push(event);
        });

        execute();

        expect(events.length).toBe(1);
        expect(events[0].type).toBe("gamepadaxesmotion");
        expect(events[0].gamepadIndex).toBe(0);
        expect(events[0].axisIndex).toBe(0);
        expect(events[0].axisValue).toBe(0.8);
        expect($gamepadAxisStates.get(0)).toEqual([0.8, 0]);
    });
});
