import { execute } from "./MaskSetMaskBoundsService";
import { describe, expect, it, vi } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject.ts";
import {
    $setCurrentAttachment,
    $getCurrentAttachment
} from "../../FrameBufferManager.ts";
import { $clipBounds } from "../../Mask";

describe("MaskSetMaskBoundsService.js method test", () =>
{
    it("test case", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "createTexture": vi.fn(() => { return "createTexture" }),
                    "activeTexture": vi.fn(() => { return "activeTexture" }),
                    "bindTexture": vi.fn(() => { return "bindTexture" }),
                    "texParameteri": vi.fn(() => { return "texParameteri" }),
                    "texStorage2D": vi.fn(() => { return "texStorage2D" }),
                    "createRenderbuffer": vi.fn(() => { return "createRenderbuffer" }),
                    "bindRenderbuffer": vi.fn(() => { return "bindRenderbuffer" }),
                    "renderbufferStorage": vi.fn(() => { return "renderbufferStorage" }),
                    "enable": vi.fn((cap) => {
                        expect(cap).toBe("SCISSOR_TEST");
                    }),
                    "scissor": vi.fn((x, y, width, height) =>
                    {
                        expect(x).toBe(10);
                        expect(y).toBe(60);
                        expect(width).toBe(20);
                        expect(height).toBe(20);
                    }),
                    "SCISSOR_TEST": "SCISSOR_TEST",
                },
                "$context": {
                    get currentAttachmentObject() {
                        return $getCurrentAttachment();
                    }
                }
            }
        });

        const attachmentObject = {
            "width": 100,
            "height": 100,
            "clipLevel": 1,
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

        $clipBounds.clear();
        expect($clipBounds.size).toBe(0);

        execute(10, 20, 30, 40);
        expect($clipBounds.size).toBe(1);
    });
});