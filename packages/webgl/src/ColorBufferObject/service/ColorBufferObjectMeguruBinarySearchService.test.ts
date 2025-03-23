import { execute } from "./ColorBufferObjectMeguruBinarySearchService";
import { describe, expect, it, vi } from "vitest";
import { $objectPool } from "../../ColorBufferObject";

describe("ColorBufferObjectMeguruBinarySearchService.js method test", () =>
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
        
        expect(execute(255 * 255)).toBe(0);
        expect(execute(257 * 257)).toBe(1);
        expect(execute(511 * 511)).toBe(1);
        expect(execute(513 * 513)).toBe(2);
        expect(execute(1200 * 1200)).toBe(3);
        expect(execute(2200 * 2200)).toBe(4);
    });
});