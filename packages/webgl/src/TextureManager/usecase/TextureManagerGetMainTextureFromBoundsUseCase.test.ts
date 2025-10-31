import { execute } from "./TextureManagerGetMainTextureFromBoundsUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
{
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    const mockAttachment = {
        width: 800,
        height: 600,
        texture: { resource: "mockTexture", width: 800, height: 600, area: 480000 },
        frameBuffer: "mockFrameBuffer"
    };
    
    return {
        ...mod,
        $gl: {
            "bindFramebuffer": vi.fn(),
            "framebufferTexture2D": vi.fn(),
            "enable": vi.fn(),
            "scissor": vi.fn(),
            "blitFramebuffer": vi.fn(),
            "disable": vi.fn(),
            "FRAMEBUFFER": 36160,
            "READ_FRAMEBUFFER": 36008,
            "DRAW_FRAMEBUFFER": 36009,
            "COLOR_ATTACHMENT0": 36064,
            "TEXTURE_2D": 3553,
            "SCISSOR_TEST": 3089,
            "COLOR_BUFFER_BIT": 16384,
            "NEAREST": 9728,
        },
        $context: {
            currentAttachmentObject: mockAttachment,
            $mainAttachmentObject: mockAttachment,
            bind: vi.fn()
        }
    }
});

vi.mock("../../FrameBufferManager.ts", () => ({
    $getDrawBitmapFrameBuffer: vi.fn(() => "drawBitmapFrameBuffer"),
    $readFrameBuffer: "readFrameBuffer"
}));

vi.mock("./TextureManagerGetTextureUseCase.ts", () => ({
    execute: vi.fn((width: number, height: number) => ({
        width,
        height,
        area: width * height,
        resource: "mockTexture"
    }))
}));

vi.mock("./TextureManagerBind0UseCase.ts", () => ({
    execute: vi.fn()
}));

describe("TextureManagerGetMainTextureFromBoundsUseCase.js method test", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    it("test case with basic parameters", () =>
    {
        const textureObject = execute(0, 0, 100, 100);
        expect(textureObject.width).toBe(800);
        expect(textureObject.height).toBe(600);
    });

    it("test case with different bounds", () =>
    {
        const textureObject = execute(100, 200, 300, 400);
        expect(textureObject.width).toBe(800);
        expect(textureObject.height).toBe(600);
    });
});
