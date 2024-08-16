import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import {
    $setCurrentAttachment,
    $getCurrentAttachment,
    $setFramebufferBound,
    $isFramebufferBound
} from "../../FrameBufferManager";
import {
    $activeTextureUnit,
    $setActiveTextureUnit,
} from "../../TextureManager";
import { execute } from "./FrameBufferManagerBindAttachmentObjectService";
import { describe, expect, it, vi } from "vitest";

describe("FrameBufferManagerBindAttachmentObjectService.js method test", () =>
{
    it("test case1", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "TEXTURE0": 0,
                    "TEXTURE1": 1,
                    "TEXTURE2": 2,
                    "bindTexture": vi.fn(() => { return "bindTexture" }),
                    "activeTexture": vi.fn(() => { return "activeTexture" }),
                    "bindFramebuffer": vi.fn(() => { return "bindFramebuffer" }),
                    "bindRenderbuffer": vi.fn(() => { return "bindRenderbuffer" }),
                    "framebufferTexture2D": vi.fn(() => { return "framebufferTexture2D" }),
                    "framebufferRenderbuffer": vi.fn(() => { return "framebufferRenderbuffer" }),
                }
            }
        });

        const attachmentObject: IAttachmentObject = {
            "width": 100,
            "height": 120,
            "msaa": false,
            "mask": false,
            "clipLevel": 0,
            "color": null,
            "texture": {
                "resource": {} as WebGLTexture,
                "width": 100,
                "height": 120,
                "area": 100 * 120
            },
            "stencil": {
                "resource": {} as WebGLRenderbuffer,
                "width": 100,
                "height": 120,
                "area": 100 * 120,
                "dirty": false
            }
        };

        $setFramebufferBound(false);
        expect($isFramebufferBound).toBe(false);
        $setCurrentAttachment(null);
        expect($getCurrentAttachment()).toBe(null);
        $setActiveTextureUnit(-1);
        expect($activeTextureUnit).toBe(-1);

        execute(attachmentObject);

        expect($getCurrentAttachment()).toBe(attachmentObject);
        expect($isFramebufferBound).toBe(true);
        expect($activeTextureUnit).toBe(0);
    });

    it("test case2", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "TEXTURE0": 0,
                    "TEXTURE1": 1,
                    "TEXTURE2": 2,
                    "bindTexture": vi.fn(() => { return "bindTexture" }),
                    "activeTexture": vi.fn(() => { return "activeTexture" }),
                    "bindFramebuffer": vi.fn(() => { return "bindFramebuffer" }),
                    "bindRenderbuffer": vi.fn(() => { return "bindRenderbuffer" }),
                    "framebufferTexture2D": vi.fn(() => { return "framebufferTexture2D" }),
                    "framebufferRenderbuffer": vi.fn(() => { return "framebufferRenderbuffer" }),
                }
            }
        });
    
        const colorBufferObject: IColorBufferObject = {
            "resource": {} as WebGLRenderbuffer,
            "stencil": {
                "resource": {} as WebGLRenderbuffer,
                "width": 0,
                "height": 0,
                "area": 0 * 0,
                "dirty": false
            },
            "width": 256,
            "height": 256,
            "area": 256 * 256,
            "dirty": false
        };

        const attachmentObject: IAttachmentObject = {
            "width": 100,
            "height": 120,
            "msaa": true,
            "mask": false,
            "clipLevel": 0,
            "color": colorBufferObject,
            "texture": null,
            "stencil": colorBufferObject.stencil
        };
    
        $setFramebufferBound(false);
        expect($isFramebufferBound).toBe(false);
        $setCurrentAttachment(null);
        expect($getCurrentAttachment()).toBe(null);
        $setActiveTextureUnit(-1);
        expect($activeTextureUnit).toBe(-1);

        execute(attachmentObject);

        expect($getCurrentAttachment()).toBe(attachmentObject);
        expect($isFramebufferBound).toBe(true);
        expect($activeTextureUnit).toBe(-1);
    });
});