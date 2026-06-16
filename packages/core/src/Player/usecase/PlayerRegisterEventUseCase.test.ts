import { execute } from "./PlayerRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { KeyboardEvent, GamepadEvent } from "@next2d/events";

describe("PlayerRegisterEventUseCase.js test", () =>
{
    it("execute test case", () =>
    {
        let keyDown = false;
        let keyUp = false;
        let gamepadConnected = false;
        let gamepadDisconnected = false;
        window.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case KeyboardEvent.KEY_DOWN:
                    keyDown = true;
                    break;

                case KeyboardEvent.KEY_UP:
                    keyUp = true;
                    break;

                case GamepadEvent.GAMEPAD_CONNECTED:
                    gamepadConnected = true;
                    break;

                case GamepadEvent.GAMEPAD_DISCONNECTED:
                    gamepadDisconnected = true;
                    break;

                default:
                    break;

            }
        });

        expect(keyDown).toBe(false);
        expect(keyUp).toBe(false);
        expect(gamepadConnected).toBe(false);
        expect(gamepadDisconnected).toBe(false);
        execute();
        expect(keyDown).toBe(true);
        expect(keyUp).toBe(true);
        expect(gamepadConnected).toBe(true);
        expect(gamepadDisconnected).toBe(true);
    });
});