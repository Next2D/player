import { KeyboardEvent } from "./KeyboardEvent";
import { describe, expect, it } from "vitest";

describe("KeyboardEvent.js property test", () =>
{
    it("KEY_DOWN test", () =>
    {
        expect(KeyboardEvent.KEY_DOWN).toBe("keydown");
    });

    it("KEY_UP test", () =>
    {
        expect(KeyboardEvent.KEY_UP).toBe("keyup");
    });
});