import { KeyboardEvent } from "./KeyboardEvent";
import { describe, expect, it } from "vitest";

describe("KeyboardEvent.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new KeyboardEvent("test").namespace).toBe("next2d.events.KeyboardEvent");
    });

    it("namespace test static", () =>
    {
        expect(KeyboardEvent.namespace).toBe("next2d.events.KeyboardEvent");
    });
});

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