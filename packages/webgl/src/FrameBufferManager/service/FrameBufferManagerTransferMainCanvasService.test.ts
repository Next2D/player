import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute } from "./FrameBufferManagerTransferMainCanvasService";
import { describe, expect, it, vi } from "vitest";

describe("FrameBufferManagerTransferMainCanvasService.ts test", () =>
{
    it("execute test case1", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "READ_FRAMEBUFFER": 0x8CA8,
                    "DRAW_FRAMEBUFFER": 0x8CA9,
                    "FRAMEBUFFER": 0x8D40,
                    "COLOR_BUFFER_BIT": 0x00004000,
                    "NEAREST": 0x2600,
                    "bindFramebuffer": vi.fn(() => {}),
                    "blitFramebuffer": vi.fn(() => {}),
                },
                $context: {
                    "$mainAttachmentObject": {
                        "width": 800,
                        "height": 600,
                    } as IAttachmentObject,
                    "bind": vi.fn(() => {}),
                }
            }
        });

        expect(() => execute()).not.toThrow();
    });
});
