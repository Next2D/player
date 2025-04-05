import { execute } from "./ColorBufferObjectGetColorBufferObjectUseCase";
import { describe, expect, it, vi } from "vitest";
import { $objectPool } from "../../ColorBufferObject";

describe("ColorBufferObjectGetColorBufferObjectUseCase.js method test", () =>
{
    it("test case", () =>
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
                "resource": {} as unknown as WebGLRenderbuffer,
                "stencil": {
                    "id": 0,
                    "resource": {} as unknown as WebGLRenderbuffer,
                    "width": 0,
                    "height": 0,
                    "area": 0,
                    "dirty": false,
                },
                "width": 256,
                "height": 256,
                "area": 256 * 256,
                "dirty": false,
            },
            {
                "resource": {} as unknown as WebGLRenderbuffer,
                "stencil": {
                    "id": 1,
                    "resource": {} as unknown as WebGLRenderbuffer,
                    "width": 0,
                    "height": 0,
                    "area": 0,
                    "dirty": false,
                },
                "width": 512,
                "height": 512,
                "area": 512 * 512,
                "dirty": false,
            },
            {
                "resource": {} as unknown as WebGLRenderbuffer,
                "stencil": {
                    "id": 2,
                    "resource": {} as unknown as WebGLRenderbuffer,
                    "width": 0,
                    "height": 0,
                    "area": 0,
                    "dirty": false,
                },
                "width": 1024,
                "height": 1024,
                "area": 1024 * 1024,
                "dirty": false,
            },
            {
                "resource": {} as unknown as WebGLRenderbuffer,
                "stencil": {
                    "id": 3,
                    "resource": {} as unknown as WebGLRenderbuffer,
                    "width": 0,
                    "height": 0,
                    "area": 0,
                    "dirty": false,
                },
                "width": 2048,
                "height": 2048,
                "area": 2048 * 2048,
                "dirty": false,
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