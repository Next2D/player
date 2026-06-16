import { GamepadEvent } from "./GamepadEvent";
import { describe, expect, it } from "vitest";

describe("GamepadEvent.js property test", () =>
{
    it("GAMEPAD_CONNECTED test", () =>
    {
        expect(GamepadEvent.GAMEPAD_CONNECTED).toBe("gamepadconnected");
    });

    it("GAMEPAD_DISCONNECTED test", () =>
    {
        expect(GamepadEvent.GAMEPAD_DISCONNECTED).toBe("gamepaddisconnected");
    });

    it("BUTTON_DOWN test", () =>
    {
        expect(GamepadEvent.BUTTON_DOWN).toBe("gamepadbuttondown");
    });

    it("BUTTON_UP test", () =>
    {
        expect(GamepadEvent.BUTTON_UP).toBe("gamepadbuttonup");
    });

    it("AXES_MOTION test", () =>
    {
        expect(GamepadEvent.AXES_MOTION).toBe("gamepadaxesmotion");
    });

    it("instance default properties test", () =>
    {
        const event = new GamepadEvent(GamepadEvent.BUTTON_DOWN);
        expect(event.type).toBe("gamepadbuttondown");
        expect(event.gamepadIndex).toBe(0);
        expect(event.buttonIndex).toBeUndefined();
        expect(event.buttonValue).toBeUndefined();
        expect(event.axisIndex).toBeUndefined();
        expect(event.axisValue).toBeUndefined();
    });

    it("instance property assignment test", () =>
    {
        const event = new GamepadEvent(GamepadEvent.BUTTON_DOWN);
        event.gamepadIndex = 1;
        event.buttonIndex  = 3;
        event.buttonValue  = 0.8;
        expect(event.gamepadIndex).toBe(1);
        expect(event.buttonIndex).toBe(3);
        expect(event.buttonValue).toBe(0.8);
    });
});
