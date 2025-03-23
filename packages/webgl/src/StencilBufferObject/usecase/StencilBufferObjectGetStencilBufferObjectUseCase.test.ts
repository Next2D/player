import { execute } from "./StencilBufferObjectGetStencilBufferObjectUseCase";
import { describe, expect, it, vi } from "vitest";
import { $objectPool } from "../../StencilBufferObject";

describe("StencilBufferObjectGetStencilBufferObjectUseCase.js method test", () =>
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
                    "renderbufferStorage": vi.fn(() => { return  "renderbufferStorage" }),
                }
            }
        });

        // new
        $objectPool.length = 0;
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
        expect($objectPool.length).toBe(4);

        // hit
        const cacheStencilBufferObject = execute(256, 256);
        expect($objectPool.length).toBe(3);
        expect(cacheStencilBufferObject.width).toBe(256);
        expect(cacheStencilBufferObject.height).toBe(256);
        expect(cacheStencilBufferObject.area).toBe(256 * 256);

        // no hit
        const newStencilBufferObject = execute(320, 240);
        expect($objectPool.length).toBe(2);
        expect(newStencilBufferObject.width).toBe(320);
        expect(newStencilBufferObject.height).toBe(240);
        expect(newStencilBufferObject.area).toBe(320 * 240);
    });
});