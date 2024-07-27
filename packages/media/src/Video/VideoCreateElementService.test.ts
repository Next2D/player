import type { Video } from "../Video";
import { execute } from "./VideoCreateElementService";
import { describe, expect, it, vi } from "vitest";

describe("VideoCreateElementService.js test", () =>
{
    it("execute test case1", () =>
    {
        const MockVideo = vi.fn().mockImplementation(() =>
        {
            return {} as unknown as Video;
        });

        const bounds = {
            "xMin": 0,
            "yMin": 0,
            "xMax": 0,
            "yMax": 0
        };
        const element = execute(new MockVideo(), bounds);

        expect(element.autoplay).toBe(false);
        expect(element.crossOrigin).toBe("anonymous");
        expect(element.getAttribute("playsinline")).toBe("");
    });
});