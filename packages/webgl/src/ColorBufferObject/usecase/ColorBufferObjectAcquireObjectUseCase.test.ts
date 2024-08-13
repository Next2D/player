import { IColorBufferObject } from "../../interface/IColorBufferObject";
import { execute } from "./ColorBufferObjectAcquireObjectUseCase";
import { describe, expect, it, vi } from "vitest";

describe("ColorBufferObjectAcquireObjectUseCase.js method test", () =>
{
    it("test case", async () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "createRenderbuffer": vi.fn(() => { return  "createRenderbuffer" })
                }
            }
        });

        // new
        const newColorBufferObject = execute([], 255 * 255)
        expect(newColorBufferObject.width).toBe(0);
        expect(newColorBufferObject.area).toBe(0);
        expect(newColorBufferObject.height).toBe(0);

        const objectPool: IColorBufferObject[] = [
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
        ];

        // hit
        const poolColorBufferObject = execute(objectPool, 500 * 500)
        expect(poolColorBufferObject.width).toBe(512);
        expect(poolColorBufferObject.area).toBe(512 * 512);
        expect(poolColorBufferObject.height).toBe(512);

        // array shift
        const oldColorBufferObject = execute(objectPool, 2500 * 2500)
        expect(oldColorBufferObject.width).toBe(256);
        expect(oldColorBufferObject.area).toBe(256 * 256);
        expect(oldColorBufferObject.height).toBe(256);
    });
});