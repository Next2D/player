import { execute } from "./BitmapDataImageToBufferService";
import { describe, expect, it } from "vitest";

describe("BitmapDataImageToBufferService.js test", () =>
{
    it("execute test", () =>
    {
        const iamge = new Image(100, 100);
        const buffer = execute(iamge);
        expect(buffer.length).toBe(40000);
    });
});