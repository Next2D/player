import { execute } from "./ContextCreateImageBitmapService";
import { describe, expect, it, vi, beforeEach } from "vitest";

describe("ContextCreateImageBitmapService.js method test", () =>
{
    beforeEach(() =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $context: {
                    $mainAttachmentObject: {
                        width: 100,
                        height: 100
                    }
                },
                $gl: {
                    "FRAMEBUFFER": 36160,
                    "COLOR_ATTACHMENT0": 36064,
                    "TEXTURE_2D": 3553,
                    "RGBA": 6408,
                    "UNSIGNED_BYTE": 5121,
                    "PIXEL_PACK_BUFFER": 35051,
                    "STREAM_READ": 35041,
                    "SYNC_GPU_COMMANDS_COMPLETE": 37143,
                    "SYNC_FLUSH_COMMANDS_BIT": 1,
                    "TIMEOUT_EXPIRED": 37147,
                    "ALREADY_SIGNALED": 37146,
                    "CONDITION_SATISFIED": 37148,
                    "bindFramebuffer": vi.fn(),
                    "framebufferTexture2D": vi.fn(),
                    "bufferData": vi.fn(),
                    "readPixels": vi.fn(),
                    "fenceSync": vi.fn(() => ({} as WebGLSync)),
                    "clientWaitSync": vi.fn(() => 37146),
                    "deleteSync": vi.fn(),
                    "getBufferSubData": vi.fn()
                },
                $upperPowerOfTwo: (n: number) => {
                    let result = 1;
                    while (result < n) result *= 2;
                    return result;
                }
            }
        });

        vi.mock("../../TextureManager/usecase/TextureManagerBind0UseCase", () => ({
            execute: vi.fn()
        }));

        vi.mock("../../TextureManager/usecase/TextureManagerGetMainTextureFromBoundsUseCase", () => ({
            execute: vi.fn(() => ({
                resource: {},
                width: 100,
                height: 100
            }))
        }));

        vi.mock("../../FrameBufferManager", () => ({
            $readFrameBuffer: {},
            $getPixelFrameBuffer: vi.fn(() => ({}))
        }));

        global.createImageBitmap = vi.fn(async () => ({}) as any);
        (global as any).ImageData = class ImageData {
            data: Uint8ClampedArray;
            width: number;
            height: number;
            constructor(data: Uint8ClampedArray, width: number, height: number) {
                this.data = data;
                this.width = width;
                this.height = height;
            }
        };
    });

    it("test case - create image bitmap with valid dimensions", async () =>
    {
        const result = await execute(100, 100);
        expect(result).toBeDefined();
    });

    it("test case - create image bitmap with small dimensions", async () =>
    {
        const result = await execute(10, 10);
        expect(result).toBeDefined();
    });

    it("test case - create image bitmap with different dimensions", async () =>
    {
        const result = await execute(50, 75);
        expect(result).toBeDefined();
    });
});
