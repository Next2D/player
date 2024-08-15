import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute } from "./FrameBufferManagerUnBindAttachmentObjectUseCase";
import { describe, expect, it, vi } from "vitest";
import {
    $setCurrentAttachment,
    $getCurrentAttachment,
    $isFramebufferBound,
    $setFramebufferBound
} from "../../FrameBufferManager";

describe("FrameBufferManagerUnBindAttachmentObjectUseCase.js method test", () =>
{
    it("test case1", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "bindFramebuffer": vi.fn(() => { return "bindFramebuffer" }),
                }
            }
        });

        const attachmentObject: IAttachmentObject = {
            "width": 100,
            "height": 100,
            "clipLevel": 0,
            "msaa": false,
            "mask": false,
            "color": null,
            "texture": {
                "resource": "createTexture",
                "width": 100,
                "height": 100,
                "area": 100 * 100,
            },
            "stencil": {
                "resource": "createRenderbuffer",
                "width": 100,
                "height": 100,
                "area": 100 * 100,
                "dirty": false,
            }
        }

        $setCurrentAttachment(attachmentObject)
        expect($getCurrentAttachment()).toBe(attachmentObject);

        $setFramebufferBound(true);
        expect($isFramebufferBound).toBe(true);

        execute();
        expect($isFramebufferBound).toBe(false);
        expect($getCurrentAttachment()).toBe(null);
    });
});