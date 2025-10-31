import { execute } from "./FrameBufferManagerTransferAtlasTextureService";
import { describe, expect, it, vi } from "vitest";

describe("FrameBufferManagerTransferAtlasTextureService.ts test", () =>
{
    it("execute test case1", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "DRAW_FRAMEBUFFER": 0x8CA9,
                    "COLOR_BUFFER_BIT": 0x00004000,
                    "NEAREST": 0x2600,
                    "SCISSOR_TEST": 0x0C11,
                    "bindFramebuffer": vi.fn(() => {}),
                    "blitFramebuffer": vi.fn(() => {}),
                    "enable": vi.fn(() => {}),
                    "disable": vi.fn(() => {}),
                    "scissor": vi.fn(() => {}),
                },
                $context: {
                    "currentAttachmentObject": null,
                    "atlasAttachmentObject": {
                        "width": 2048,
                        "height": 2048,
                    },
                    "bind": vi.fn(() => {}),
                }
            }
        });

        vi.mock("../../AtlasManager", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../AtlasManager")>();
            return {
                ...mod,
                "$getActiveAtlasIndex": vi.fn(() => 0),
                "$getActiveTransferBounds": vi.fn(() => [0, 0, 100, 100]),
                "$getActiveAllTransferBounds": vi.fn(() => [0, 0, 200, 200]),
            }
        });

        expect(() => execute()).not.toThrow();
    });
});
