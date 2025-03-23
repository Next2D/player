import { execute } from "./StencilBufferObjectReleaseColorBufferObjectService";
import { describe, expect, it } from "vitest";
import { $objectPool } from "../../StencilBufferObject";

describe("StencilBufferObjectReleaseColorBufferObjectService.js method test", () =>
{
    it("test case", async () =>
    {
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

        const stencilBufferObject = {
            "resource": {} as unknown as WebGLRenderbuffer,
            "width": 620,
            "height": 480,
            "area": 620 * 480,
            "dirty": false,
        };

        execute(stencilBufferObject);
        expect($objectPool.length).toBe(5);
        expect($objectPool[$objectPool.length - 1]).toBe(stencilBufferObject);

        // 重複チェック
        execute(stencilBufferObject);
        expect($objectPool.length).toBe(5);
    });
});