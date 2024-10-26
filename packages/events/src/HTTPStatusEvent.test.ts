import { HTTPStatusEvent } from "./HTTPStatusEvent";
import { describe, expect, it } from "vitest";

describe("HTTPStatusEvent.js property test", () =>
{
    it("HTTP_STATUS test", () =>
    {
        expect(HTTPStatusEvent.HTTP_STATUS).toBe("httpStatus");
    });
});