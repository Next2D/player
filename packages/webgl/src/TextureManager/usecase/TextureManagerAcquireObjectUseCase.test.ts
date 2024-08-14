import { execute } from "./TextureManagerAcquireObjectUseCase";
import { describe, expect, it, vi } from "vitest";
import { $objectPool } from "../../TextureManager";

describe("TextureManagerAcquireObjectUseCase.js method test", () =>
{
    it("test case", async () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "createTexture": vi.fn(() => { return  "createTexture" }),
                    "activeTexture": vi.fn(() => { return  "activeTexture" }),
                    "bindTexture": vi.fn(() => { return  "bindTexture" }),
                    "texParameteri": vi.fn(() => { return  "texParameteri" }),
                    "texStorage2D": vi.fn(() => { return  "texStorage2D" }),
                }
            }
        });

        // new
        $objectPool.length = 0;
        const newTextureObject = execute(320, 240);
        expect(newTextureObject.width).toBe(320);
        expect(newTextureObject.height).toBe(240);
        expect(newTextureObject.area).toBe(320 * 240);
        expect($objectPool.length).toBe(0);

        $objectPool.push(
            {
                "resource": {} as unknown as WebGLRenderbuffer,
                "width": 256,
                "height": 256,
                "area": 256 * 256
            },
            {
                "resource": {} as unknown as WebGLRenderbuffer,
                "width": 512,
                "height": 512,
                "area": 512 * 512
            },
            {
                "resource": {} as unknown as WebGLRenderbuffer,
                "width": 1024,
                "height": 1024,
                "area": 1024 * 1024
            },
            {
                "resource": {} as unknown as WebGLRenderbuffer,
                "width": 2048,
                "height": 2048,
                "area": 2048 * 2048
            },
        );

        // hit
        expect($objectPool.length).toBe(4);
        const poolColorBufferObject = execute(512, 512)
        expect(poolColorBufferObject.width).toBe(512);
        expect(poolColorBufferObject.width).toBe(512);
        expect(poolColorBufferObject.area).toBe(512 * 512);
        expect(poolColorBufferObject.height).toBe(512);
        expect($objectPool.length).toBe(3);

        // not hit
        const oldColorBufferObject = execute(100, 100)
        expect(oldColorBufferObject.width).toBe(100);
        expect(oldColorBufferObject.area).toBe(100 * 100);
        expect(oldColorBufferObject.height).toBe(100);
        expect($objectPool.length).toBe(3);
    });
});