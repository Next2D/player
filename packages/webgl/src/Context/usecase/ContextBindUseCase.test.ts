import { Context } from "../../Context";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute } from "./ContextBindUseCase";
import { describe, expect, it, vi } from "vitest";
import {
    $setCurrentAttachment,
    $getCurrentAttachment
} from "../../FrameBufferManager";

describe("ContextBindUseCase.js method test", () =>
{
    it("test case", () =>
    {
        const mockGL = {
            "activeTexture": vi.fn(() => "activeTexture"),
            "bindTexture": vi.fn(() => "bindTexture"),
            "framebufferTexture2D": vi.fn(() => "framebufferTexture2D"),
            "getParameter": vi.fn(() => "getParameter"),
            "pixelStorei": vi.fn(() => "pixelStorei"),
            "createFramebuffer": vi.fn(() => "createFramebuffer"),
            "bindFramebuffer": vi.fn(() => "bindFramebuffer"),
            "clearColor": vi.fn(() => "clearColor"),
            "createRenderbuffer": vi.fn(() => "createRenderbuffer"),
            "bindRenderbuffer": vi.fn(() => "bindRenderbuffer"),
            "renderbufferStorageMultisample": vi.fn(() => "renderbufferStorageMultisample"),
            "framebufferRenderbuffer": vi.fn(() => "framebufferRenderbuffer"),
            "viewport": vi.fn((x, y, w, h) =>
            {
                expect(x).toBe(0);
                expect(y).toBe(0);
                expect(w).toBe(100);
                expect(h).toBe(200);
            }),
        } as unknown as WebGL2RenderingContext;

        $setCurrentAttachment(null);
        expect($getCurrentAttachment()).toBe(null);

        const context = new Context(mockGL, 4);
        const attachment_object: IAttachmentObject = {
            "width": 100,
            "height": 200,
            "clipLevel": 0,
            "msaa": false,
            "mask": false,
            "texture": {
                "resource": "createRenderbuffer",
                "width": 0,
                "height": 0,
                "area": 0
            },
            "color": null,
            "stencil": {
                "resource": "createRenderbuffer",
                "width": 0,
                "height": 0,
                "area": 0,
                "dirty": false,
            }
        };

        execute(context, attachment_object);

        expect($getCurrentAttachment()).toBe(attachment_object);
    });
});