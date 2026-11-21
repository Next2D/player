import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import {
    $setCurrentAttachment,
    $currentAttachment,
    $setFramebufferBound,
    $isFramebufferBound
} from "../../FrameBufferManager";
import {
    $activeTextureUnit,
    $setActiveTextureUnit,
} from "../../TextureManager";
import { execute } from "./FrameBufferManagerBindAttachmentObjectService";
import { describe, expect, it, vi } from "vitest";

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
            "texParameteri": vi.fn(() => { return "texParameteri" }),
        }
    }
});

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

describe("FrameBufferManagerBindAttachmentObjectService.js method test", () =>
{
    it("test case1", () =>
    {

        const attachmentObject: IAttachmentObject = {
            "id": 0,
            "width": 100,
            "height": 120,
            "msaa": false,
            "mask": false,
            "clipLevel": 0,
            "color": null,
            "texture": {
                "id": 0,
                "resource": {} as WebGLTexture,
                "width": 100,
                "height": 120,
                "area": 100 * 120,
                "smooth": false,
            },
            "stencil": {
                "id": 0,
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
        expect($currentAttachment).toBe(null);
        $setActiveTextureUnit(-1);
        expect($activeTextureUnit).toBe(-1);

        execute(attachmentObject);

        expect($currentAttachment).toBe(attachmentObject);
        expect($isFramebufferBound).toBe(true);
        expect($activeTextureUnit).toBe(0);
    });

    it("test case2", () =>
    {

        const colorBufferObject: IColorBufferObject = {
            "resource": {} as WebGLRenderbuffer,
            "stencil": {
                "id": 0,
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
            "id": 0,
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
        expect($currentAttachment).toBe(null);
        $setActiveTextureUnit(-1);
        expect($activeTextureUnit).toBe(-1);

        execute(attachmentObject);

        expect($currentAttachment).toBe(attachmentObject);
        expect($isFramebufferBound).toBe(true);
        expect($activeTextureUnit).toBe(-1);
    });
});
describe("FrameBufferManagerBindAttachmentObjectService attach calls", () =>
{
    it("attaches without binding renderbuffers and skips resources that are already attached", async () =>
    {
        const { $gl } = await import("../../WebGLUtil");
        const {
            $setAttachedColor,
            $setAttachedStencil
        } = await import("../../FrameBufferManager");

        const stencil = {
            "id": 1,
            "resource": {} as WebGLRenderbuffer,
            "width": 0,
            "height": 0,
            "area": 0,
            "dirty": false
        };

        const create = (color: WebGLRenderbuffer): IAttachmentObject =>
        {
            return {
                "id": 0,
                "width": 100,
                "height": 120,
                "msaa": true,
                "mask": false,
                "clipLevel": 0,
                "color": {
                    "resource": color,
                    "stencil": stencil,
                    "width": 256,
                    "height": 256,
                    "area": 256 * 256,
                    "dirty": false
                },
                "texture": null,
                "stencil": stencil
            };
        };

        const colorA = {} as WebGLRenderbuffer;
        const colorB = {} as WebGLRenderbuffer;

        $setAttachedColor(null);
        $setAttachedStencil(null);

        const attach = $gl.framebufferRenderbuffer as ReturnType<typeof vi.fn>;
        const bind   = $gl.bindRenderbuffer as ReturnType<typeof vi.fn>;
        attach.mockClear();
        bind.mockClear();

        // 1 回目: 色とステンシルの 2 つをアタッチする
        execute(create(colorA));
        expect(attach).toHaveBeenCalledTimes(2);

        // 同じリソース: 付け直さない
        execute(create(colorA));
        expect(attach).toHaveBeenCalledTimes(2);

        // 色だけ違う: 色だけ付け直す (ステンシルは同じ)
        execute(create(colorB));
        expect(attach).toHaveBeenCalledTimes(3);
        expect(attach.mock.calls[2][3]).toBe(colorB);

        // bindRenderbuffer は呼ばない
        expect(bind).not.toHaveBeenCalled();

        $setAttachedColor(null);
        $setAttachedStencil(null);
    });
});
