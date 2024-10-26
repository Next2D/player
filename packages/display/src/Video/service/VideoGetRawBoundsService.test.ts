import { execute } from "./VideoGetRawBoundsService";
import { Video } from "@next2d/media";
import { describe, expect, it } from "vitest";

describe("VideoGetRawBoundsService.js test", () =>
{
    it("execute test case", () =>
    {
        const video = new Video(100, 200);
        const bounds = execute(video);

        expect(bounds[0]).toBe(0);
        expect(bounds[1]).toBe(0);
        expect(bounds[2]).toBe(100);
        expect(bounds[3]).toBe(200);
    });
});