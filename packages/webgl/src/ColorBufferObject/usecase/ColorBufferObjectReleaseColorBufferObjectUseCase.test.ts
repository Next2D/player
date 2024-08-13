import { execute } from "./ColorBufferObjectReleaseColorBufferObjectUseCase";
import { describe, expect, it, vi } from "vitest";
import { $objectPool } from "../../ColorBufferObject";

describe("ColorBufferObjectReleaseColorBufferObjectUseCase.js method test", () =>
{
    it("test case", async () =>
    {
        $objectPool.length = 0;
        $objectPool.push(
            {
                "colorRenderbuffer": null,
                "stencilRenderbuffer": null,
                "width": 256,
                "height": 256,
                "area": 256 * 256,
            },
            {
                "colorRenderbuffer": null,
                "stencilRenderbuffer": null,
                "width": 512,
                "height": 512,
                "area": 512 * 512,
            },
            {
                "colorRenderbuffer": null,
                "stencilRenderbuffer": null,
                "width": 1024,
                "height": 1024,
                "area": 1024 * 1024,
            },
            {
                "colorRenderbuffer": null,
                "stencilRenderbuffer": null,
                "width": 2048,
                "height": 2048,
                "area": 2048 * 2048,
            },
        );
        expect($objectPool.length).toBe(4);

        const colorBufferObject = {
            "colorRenderbuffer": null,
            "stencilRenderbuffer": null,
            "width": 620,
            "height": 480,
            "area": 620 * 480,
        };
        execute(colorBufferObject);
        expect($objectPool.length).toBe(5);
        expect($objectPool[2]).toBe(colorBufferObject);
    });
});