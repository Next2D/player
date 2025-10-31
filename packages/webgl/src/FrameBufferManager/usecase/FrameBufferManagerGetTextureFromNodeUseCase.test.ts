import type { Node } from "@next2d/texture-packer";
import { execute } from "./FrameBufferManagerGetTextureFromNodeUseCase";
import { describe, expect, it, vi } from "vitest";

describe("FrameBufferManagerGetTextureFromNodeUseCase.js method test", () =>
{
    it("test case1", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "bindFramebuffer": vi.fn(),
                    "framebufferTexture2D": vi.fn(),
                    "blitFramebuffer": vi.fn(),
                    "FRAMEBUFFER": 0,
                    "READ_FRAMEBUFFER": 1,
                    "DRAW_FRAMEBUFFER": 2,
                    "COLOR_ATTACHMENT0": 0,
                    "TEXTURE_2D": 0,
                    "COLOR_BUFFER_BIT": 0,
                    "NEAREST": 0
                }
            }
        });

        vi.mock("../../FrameBufferManager", () => ({
            $getDrawBitmapFrameBuffer: vi.fn(() => "drawFrameBuffer"),
            $getReadBitmapFrameBuffer: vi.fn(() => "readFrameBuffer"),
            $readFrameBuffer: "readFrameBuffer"
        }));

        vi.mock("../../AtlasManager", () => ({
            $getActiveAtlasIndex: vi.fn(() => 0),
            $setActiveAtlasIndex: vi.fn(),
            $getAtlasTextureObject: vi.fn(() => ({
                resource: "atlasTexture"
            }))
        }));

        vi.mock("../../TextureManager/usecase/TextureManagerGetTextureUseCase", () => ({
            execute: vi.fn(() => ({
                id: 0,
                resource: "texture",
                width: 100,
                height: 100,
                area: 10000,
                smooth: false
            }))
        }));

        vi.mock("../../FrameBufferManager/service/FrameBufferManagerTransferAtlasTextureService", () => ({
            execute: vi.fn()
        }));

        const node: Node = {
            x: 10,
            y: 20,
            w: 100,
            h: 100,
            index: 0
        };

        const textureObject = execute(node);
        expect(textureObject).toBeDefined();
        expect(textureObject.width).toBe(100);
        expect(textureObject.height).toBe(100);
    });
});
