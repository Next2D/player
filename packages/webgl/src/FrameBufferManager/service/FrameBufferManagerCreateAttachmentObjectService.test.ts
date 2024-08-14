import { execute } from "./FrameBufferManagerCreateAttachmentObjectService";
import { describe, expect, it } from "vitest";

describe("FrameBufferManagerCreateAttachmentObjectService.js method test", () =>
{
    it("test case", () =>
    {
        const attachmentObject = execute();
        expect(attachmentObject.width).toBe(0);
        expect(attachmentObject.height).toBe(0);
        expect(attachmentObject.clipLevel).toBe(0);
        expect(attachmentObject.msaa).toBe(false);
        expect(attachmentObject.mask).toBe(false);
        expect(attachmentObject.color).toBe(null);
        expect(attachmentObject.texture).toBe(null);
        expect(attachmentObject.stencil).toBe(null);
    });
});