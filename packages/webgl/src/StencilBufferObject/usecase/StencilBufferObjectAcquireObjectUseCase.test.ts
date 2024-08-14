import { execute } from "./StencilBufferObjectAcquireObjectUseCase";
import { describe, expect, it, vi } from "vitest";
import { $objectPool } from "../../StencilBufferObject";

describe("StencilBufferObjectAcquireObjectUseCase.js method test", () =>
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
        $objectPool.length = 0;
        const newStencilBufferObject = execute(320, 240);
        expect(newStencilBufferObject.width).toBe(0);
        expect(newStencilBufferObject.height).toBe(0);
        expect(newStencilBufferObject.area).toBe(0);

        $objectPool.push(
            {
                "resource": {} as unknown as WebGLRenderbuffer,
                "width": 256,
                "height": 256,
                "area": 256 * 256,
                "dirty": false,
            },
            {
                "resource": {} as unknown as WebGLRenderbuffer,
                "width": 512,
                "height": 512,
                "area": 512 * 512,
                "dirty": false,
            },
            {
                "resource": {} as unknown as WebGLRenderbuffer,
                "width": 1024,
                "height": 1024,
                "area": 1024 * 1024,
                "dirty": false,
            },
            {
                "resource": {} as unknown as WebGLRenderbuffer,
                "width": 2048,
                "height": 2048,
                "area": 2048 * 2048,
                "dirty": false,
            },
        );

        // hit
        const poolColorBufferObject = execute(512, 512)
        expect(poolColorBufferObject.width).toBe(512);
        expect(poolColorBufferObject.area).toBe(512 * 512);
        expect(poolColorBufferObject.height).toBe(512);

        // not hit
        const oldColorBufferObject = execute(100, 100)
        expect(oldColorBufferObject.width).toBe(256);
        expect(oldColorBufferObject.area).toBe(256 * 256);
        expect(oldColorBufferObject.height).toBe(256);
    });
});