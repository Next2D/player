import { HTTPStatusEvent } from "./HTTPStatusEvent";
import { describe, expect, it } from "vitest";

describe("HTTPStatusEvent.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new HTTPStatusEvent("test").namespace).toBe("next2d.events.HTTPStatusEvent");
    });

    it("namespace test static", () =>
    {
        expect(HTTPStatusEvent.namespace).toBe("next2d.events.HTTPStatusEvent");
    });
});

describe("HTTPStatusEvent.js property test", () =>
{
    it("HTTP_STATUS test", () =>
    {
        expect(HTTPStatusEvent.HTTP_STATUS).toBe("httpStatus");
    });
});