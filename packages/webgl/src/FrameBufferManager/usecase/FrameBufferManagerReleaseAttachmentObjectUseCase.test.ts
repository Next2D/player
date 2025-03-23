import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute } from "./FrameBufferManagerReleaseAttachmentObjectUseCase";
import { describe, expect, it, vi } from "vitest";
import { $objectPool } from "../../FrameBufferManager";
import { $objectPool as $stencilBufferObjectPool } from "../../StencilBufferObject";
import { $objectPool as $colorBufferObjectPool } from "../../ColorBufferObject";

describe("FrameBufferManagerReleaseAttachmentObjectUseCase.js method test", () =>
{
    it("test case1", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "deleteTexture": vi.fn(() => { return "deleteTexture" })
                }
            }
        });

        const attachmentObject: IAttachmentObject = {
            "id": 0,
            "width": 100,
            "height": 100,
            "clipLevel": 0,
            "msaa": false,
            "mask": false,
            "color": null,
            "texture": {
                "id": 0,
                "resource": "createTexture",
                "width": 100,
                "height": 100,
                "area": 100 * 100,
                "smooth": false
            },
            "stencil": {
                "id": 0,
                "resource": "createRenderbuffer",
                "width": 100,
                "height": 100,
                "area": 100 * 100,
                "dirty": false,
            }
        }

        $objectPool.length = 0;
        expect($objectPool.length).toBe(0);

        $stencilBufferObjectPool.length = 0;
        expect($stencilBufferObjectPool.length).toBe(0);

        $colorBufferObjectPool.length = 0;
        expect($colorBufferObjectPool.length).toBe(0);

        execute(attachmentObject);
        expect($objectPool.length).toBe(1);
        expect($stencilBufferObjectPool.length).toBe(1);
        expect($colorBufferObjectPool.length).toBe(0);
    });

    it("test case2", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "deleteTexture": vi.fn(() => { return "deleteTexture" }),
                }
            }
        });

        const colorBufferObject = {
            "resource": "createRenderbuffer",
            "width": 100,
            "height": 100,
            "area": 100 * 100,
            "dirty": false,
            "stencil": {
                "id": 0,
                "resource": "createRenderbuffer",
                "width": 0,
                "height": 0,
                "area": 0,
                "dirty": false
            }
        };

        const attachmentObject: IAttachmentObject = {
            "id": 0,
            "width": 100,
            "height": 100,
            "clipLevel": 0,
            "msaa": true,
            "mask": false,
            "color": colorBufferObject,
            "texture": {
                "id": 0,
                "resource": "createTexture",
                "width": 100,
                "height": 100,
                "area": 100 * 100,
                "smooth": false
            },
            "stencil": colorBufferObject.stencil
        }

        $objectPool.length = 0;
        expect($objectPool.length).toBe(0);

        $stencilBufferObjectPool.length = 0;
        expect($stencilBufferObjectPool.length).toBe(0);

        $colorBufferObjectPool.length = 0;
        expect($colorBufferObjectPool.length).toBe(0);

        execute(attachmentObject);
        expect($objectPool.length).toBe(1);
        expect($stencilBufferObjectPool.length).toBe(0);
        expect($colorBufferObjectPool.length).toBe(1);
    });
});