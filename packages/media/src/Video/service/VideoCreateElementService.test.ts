import { execute } from "./VideoCreateElementService";
import { describe, expect, it } from "vitest";

describe("VideoCreateElementService.js test", () =>
{
    it("execute test case1", () =>
    {
        const element = execute();

        expect(element.autoplay).toBe(false);
        expect(element.crossOrigin).toBe("anonymous");
        expect(element.getAttribute("playsinline")).toBe("");
    });
});