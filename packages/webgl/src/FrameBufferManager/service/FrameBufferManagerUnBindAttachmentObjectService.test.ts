import type { IAttachmentObject } from "../../interface/IAttachmentObject.ts";
import { execute } from "./FrameBufferManagerUnBindAttachmentObjectService.ts";
import { describe, expect, it, vi } from "vitest";
import {
    $setCurrentAttachment,
    $currentAttachment,
    $isFramebufferBound,
    $setFramebufferBound
} from "../../FrameBufferManager.ts";

describe("FrameBufferManagerUnBindAttachmentObjectService.js method test", () =>
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

        const attachmentObject = {
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
        } as unknown as IAttachmentObject;

        $setCurrentAttachment(attachmentObject);
        expect($currentAttachment).toBe(attachmentObject);

        $setFramebufferBound(true);
        expect($isFramebufferBound).toBe(true);

        execute();
        expect($isFramebufferBound).toBe(false);
        expect($currentAttachment).toBe(null);
    });
});