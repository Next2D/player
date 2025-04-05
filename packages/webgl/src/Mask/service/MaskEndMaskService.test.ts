import { execute } from "./MaskEndMaskService";
import { describe, expect, it, vi } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject.ts";
import {
    $setCurrentAttachment,
    $getCurrentAttachment
} from "../../FrameBufferManager.ts";

describe("MaskEndMaskService.js method test", () =>
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
                    "disable": vi.fn((cap) => {
                        switch (cap) {
                            case "SCISSOR_TEST":
                            case "SAMPLE_ALPHA_TO_COVERAGE":
                                return ;

                            default:
                                throw new Error("Unknown capability: " + cap);
                            
                        }
                    }),
                    "stencilFunc": vi.fn((func, ref, mask) => {
                        expect(func).toBe("EQUAL");
                        expect(ref).toBe(1);
                        expect(mask).toBe(1);
                    }),
                    "stencilOp": vi.fn((fail, zfail, zpass) =>
                    { 
                        expect(fail).toBe("KEEP");
                        expect(zfail).toBe("KEEP");
                        expect(zpass).toBe("KEEP");
                    }),
                    "colorMask": vi.fn((red, green, blue, alpha) =>
                    {
                        expect(red).toBe(true);
                        expect(green).toBe(true);
                        expect(blue).toBe(true);
                        expect(alpha).toBe(true);
                    }),
                    "stencilMask": vi.fn((mask) =>
                    {
                        expect(mask).toBe(0xff);
                    }),
                    "STENCIL_TEST": "STENCIL_TEST",
                    "SAMPLE_ALPHA_TO_COVERAGE": "SAMPLE_ALPHA_TO_COVERAGE",
                    "ALWAYS": "ALWAYS",
                    "ZERO": "ZERO",
                    "INVERT": "INVERT",
                    "EQUAL": "EQUAL",
                    "KEEP": "KEEP",
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
        execute();
    });
});