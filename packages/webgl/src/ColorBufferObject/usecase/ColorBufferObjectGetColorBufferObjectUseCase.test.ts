import { execute } from "./ColorBufferObjectGetColorBufferObjectUseCase";
import { describe, expect, it, vi } from "vitest";
import { $objectPool } from "../../ColorBufferObject";

describe("ColorBufferObjectGetColorBufferObjectUseCase.js method test", () =>
{
    it("test case", async () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "bindRenderbuffer": vi.fn(() => { return  "bindRenderbuffer" }),
                    "renderbufferStorageMultisample": vi.fn(() => { return  "renderbufferStorageMultisample" }),
                }
            }
        });

        // new
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

        const colorBufferObject = execute(620, 480);
        expect($objectPool.length).toBe(3);
        expect(colorBufferObject.width).toBe(1024);
        expect(colorBufferObject.height).toBe(1024);
        expect(colorBufferObject.area).toBe(1024 * 1024);
    });
});