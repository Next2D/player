import { execute } from "./MaskBeginMaskService";
import { describe, expect, it, vi } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject.ts";
import {
    $setCurrentAttachment,
    $getCurrentAttachment
} from "../../FrameBufferManager.ts";
import {
    $isMaskDrawing,
    $setMaskDrawing,
    $clipLevels
} from "../../Mask";

describe("MaskBeginMaskService.js method test", () =>
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
                        switch (cap) {
                            case "STENCIL_TEST":
                            case "SAMPLE_ALPHA_TO_COVERAGE":
                                return ;

                            default:
                                throw new Error("Unknown capability: " + cap);
                            
                        }
                    }),
                    "stencilFunc": vi.fn((func, ref, mask) => {
                        expect(func).toBe("ALWAYS");
                        expect(ref).toBe(0);
                        expect(mask).toBe(0xff);
                    }),
                    "stencilOp": vi.fn((fail, zfail, zpass) =>
                    { 
                        expect(fail).toBe("ZERO");
                        expect(zfail).toBe("INVERT");
                        expect(zpass).toBe("INVERT");
                    }),
                    "colorMask": vi.fn((red, green, blue, alpha) =>
                    {
                        expect(red).toBe(false);
                        expect(green).toBe(false);
                        expect(blue).toBe(false);
                        expect(alpha).toBe(false);
                    }),
                    "STENCIL_TEST": "STENCIL_TEST",
                    "SAMPLE_ALPHA_TO_COVERAGE": "SAMPLE_ALPHA_TO_COVERAGE",
                    "ALWAYS": "ALWAYS",
                    "ZERO": "ZERO",
                    "INVERT": "INVERT",
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

        $setMaskDrawing(false);
        expect($isMaskDrawing()).toBe(false);

        $clipLevels.clear();
        expect($clipLevels.size).toBe(0);

        execute();
        
        expect($clipLevels.size).toBe(1);
        expect($isMaskDrawing()).toBe(true);
        expect(attachmentObject.mask).toBe(true);
        expect(attachmentObject.clipLevel).toBe(1);
    });
});