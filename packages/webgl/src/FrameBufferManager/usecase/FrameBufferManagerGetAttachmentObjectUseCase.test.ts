import { execute } from "./FrameBufferManagerGetAttachmentObjectUseCase";
import { describe, expect, it, vi } from "vitest";

describe("FrameBufferManagerGetAttachmentObjectUseCase.js method test", () =>
{
    it("test case1", () =>
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
                }
            }
        });

        const attachmentObject = execute(100, 100, false);
        expect(attachmentObject.width).toBe(100);
        expect(attachmentObject.height).toBe(100);
        expect(attachmentObject.clipLevel).toBe(0);
        expect(attachmentObject.msaa).toBe(false);
        expect(attachmentObject.mask).toBe(false);
        expect(attachmentObject.color).toBe(null);
        expect(attachmentObject.texture?.resource).toBe("createTexture");
        expect(attachmentObject.texture?.width).toBe(100);
        expect(attachmentObject.texture?.height).toBe(100);
        expect(attachmentObject.texture?.area).toBe(100 * 100);
        expect(attachmentObject.stencil?.resource).toBe("createRenderbuffer");
        expect(attachmentObject.stencil?.width).toBe(100);
        expect(attachmentObject.stencil?.height).toBe(100);
        expect(attachmentObject.stencil?.area).toBe(100 * 100);
    });

    it("test case2", () =>
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
                    "renderbufferStorageMultisample": vi.fn(() => { return "renderbufferStorageMultisample" }),
                }
            }
        });
    
        const attachmentObject = execute(100, 100, true);
        expect(attachmentObject.width).toBe(100);
        expect(attachmentObject.height).toBe(100);
        expect(attachmentObject.clipLevel).toBe(0);
        expect(attachmentObject.msaa).toBe(true);
        expect(attachmentObject.mask).toBe(false);
        expect(attachmentObject.color?.resource).toBe("createRenderbuffer");
        expect(attachmentObject.color?.width).toBe(256);
        expect(attachmentObject.color?.height).toBe(256);
        expect(attachmentObject.color?.area).toBe(256 * 256);
        expect(attachmentObject.texture?.resource).toBe("createTexture");
        expect(attachmentObject.texture?.width).toBe(100);
        expect(attachmentObject.texture?.height).toBe(100);
        expect(attachmentObject.texture?.area).toBe(100 * 100);
        expect(attachmentObject.stencil?.resource).toBe("createRenderbuffer");
        expect(attachmentObject.stencil?.width).toBe(0);
        expect(attachmentObject.stencil?.height).toBe(0);
        expect(attachmentObject.stencil?.area).toBe(0);

    });
});