import { IOErrorEvent } from "./IOErrorEvent";
import { describe, expect, it } from "vitest";

describe("IOErrorEvent.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new IOErrorEvent("test").namespace).toBe("next2d.events.IOErrorEvent");
    });

    it("namespace test static", () =>
    {
        expect(IOErrorEvent.namespace).toBe("next2d.events.IOErrorEvent");
    });
});

describe("IOErrorEvent.js property test", () =>
{
    it("IO_ERROR test", () =>
    {
        expect(IOErrorEvent.IO_ERROR).toBe("ioError");
    });
});