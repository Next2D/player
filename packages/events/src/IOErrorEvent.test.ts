import { IOErrorEvent } from "./IOErrorEvent";
import { describe, expect, it } from "vitest";

describe("IOErrorEvent.js property test", () =>
{
    it("IO_ERROR test", () =>
    {
        expect(IOErrorEvent.IO_ERROR).toBe("ioError");
    });
});