import { execute } from "./ColorBufferObjectReleaseColorBufferObjectUseCase";
import { describe, expect, it } from "vitest";
import { $objectPool } from "../../ColorBufferObject";

describe("ColorBufferObjectReleaseColorBufferObjectUseCase.js method test", () =>
{
    it("test case", () =>
    {
        $objectPool.length = 0;
        $objectPool.push(
            {
                "resource": {} as unknown as WebGLRenderbuffer,
                "stencil": {
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

        const colorBufferObject = {
            "resource": {} as unknown as WebGLRenderbuffer,
            "stencil": {
                "resource": {} as unknown as WebGLRenderbuffer,
                "width": 0,
                "height": 0,
                "area": 0,
                "dirty": false,
            },
            "width": 620,
            "height": 480,
            "area": 620 * 480,
            "dirty": false,
        };
        execute(colorBufferObject);
        expect($objectPool.length).toBe(5);
        expect($objectPool[2]).toBe(colorBufferObject);

        // 重複チェック
        execute(colorBufferObject);
        expect($objectPool.length).toBe(5);
    });
});