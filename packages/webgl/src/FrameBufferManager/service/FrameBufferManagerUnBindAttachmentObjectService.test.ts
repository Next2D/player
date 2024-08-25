import type { IAttachmentObject } from "../../interface/IAttachmentObject.ts";
import { execute } from "./FrameBufferManagerUnBindAttachmentObjectService.ts";
import { describe, expect, it, vi } from "vitest";
import {
    $setCurrentAttachment,
    $getCurrentAttachment,
    $useFramebufferBound,
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
        expect($useFramebufferBound()).toBe(true);

        execute();
        expect($useFramebufferBound()).toBe(false);
        expect($getCurrentAttachment()).toBe(null);
    });
});