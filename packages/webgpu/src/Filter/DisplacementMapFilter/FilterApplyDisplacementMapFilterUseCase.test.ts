import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { execute } from "./FilterApplyDisplacementMapFilterUseCase";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    UNIFORM: 0x40,
    COPY_DST: 0x08
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

// Mock GPUTextureUsage
const GPUTextureUsage = {
    TEXTURE_BINDING: 0x04,
    COPY_DST: 0x02
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

// Mock GPUShaderStage
const GPUShaderStage = {
    VERTEX: 0x1,
    FRAGMENT: 0x2
};
(globalThis as any).GPUShaderStage = GPUShaderStage;

// Mock ShaderSource
vi.mock("../../Shader/ShaderSource", () => ({
    "ShaderSource": {
        "getDisplacementMapFilterFragmentShader": vi.fn(() => "/* mock fragment shader */"),
        "getBlurFilterVertexShader": vi.fn(() => "/* mock vertex shader */")
    }
}));

describe("FilterApplyDisplacementMapFilterUseCase", () =>
{
    const createMockAttachment = (width: number = 100, height: number = 100): IAttachmentObject =>
    {
        return {
            "id": 1,
            "width": width,
            "height": height,
            "clipLevel": 0,
            "texture": {
                "resource": { "label": "mockTexture" } as unknown as GPUTexture,
                "view": { "label": "mockTextureView" } as unknown as GPUTextureView
            }
        } as IAttachmentObject;
    };

    const createMockConfig = (): IFilterConfig =>
    {
        const mockPassEncoder = {
            "setPipeline": vi.fn(),
            "setBindGroup": vi.fn(),
            "draw": vi.fn(),
            "end": vi.fn()
        };

        const mockTexture = {
            "createView": vi.fn(() => ({ "label": "mockMapTextureView" }))
        };

        return {
            "device": {
                "createBuffer": vi.fn(() => ({ "label": "mockBuffer" })),
                "createTexture": vi.fn(() => mockTexture),
                "queue": {
                    "writeBuffer": vi.fn(),
                    "writeTexture": vi.fn()
                },
                "createBindGroup": vi.fn(() => ({ "label": "mockBindGroup" })),
                "createBindGroupLayout": vi.fn(() => ({ "label": "mockBindGroupLayout" })),
                "createPipelineLayout": vi.fn(() => ({ "label": "mockPipelineLayout" })),
                "createRenderPipeline": vi.fn(() => ({ "label": "mockPipeline" })),
                "createShaderModule": vi.fn(() => ({ "label": "mockShaderModule" }))
            } as unknown as GPUDevice,
            "commandEncoder": {
                "beginRenderPass": vi.fn(() => mockPassEncoder)
            } as unknown as GPUCommandEncoder,
            "frameBufferManager": {
                "createTemporaryAttachment": vi.fn((w: number, h: number) => createMockAttachment(w, h)),
                "releaseTemporaryAttachment": vi.fn(),
                "createRenderPassDescriptor": vi.fn(() => ({
                    "colorAttachments": [{ "view": {}, "loadOp": "clear", "storeOp": "store" }]
                }))
            },
            "pipelineManager": {
                "getPipeline": vi.fn(() => ({ "label": "mockPipeline" })),
                "getBindGroupLayout": vi.fn(() => ({ "label": "mockLayout" }))
            },
            "textureManager": {
                "createSampler": vi.fn(() => ({ "label": "mockSampler" }))
            }
        } as unknown as IFilterConfig;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    describe("basic displacement map execution", () =>
    {
        it("should create output attachment with same dimensions", () =>
        {
            const sourceAttachment = createMockAttachment(200, 150);
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,     // bitmap dimensions
                0, 0,       // mapPoint
                1, 2,       // componentX (RED), componentY (GREEN)
                10, 10,     // scale
                0,          // mode (clamp)
                0x000000, 1.0,  // color, alpha
                1,          // devicePixelRatio
                config
            );

            expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalledWith(200, 150);
        });

        it("should create map texture from bitmap buffer", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                0, 0,
                1, 2,
                10, 10,
                0,
                0x000000, 1.0,
                1,
                config
            );

            expect(config.device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "size": { "width": 64, "height": 64 },
                    "format": "rgba8unorm"
                })
            );
            expect(config.device.queue.writeTexture).toHaveBeenCalled();
        });

        it("should create shader modules on first call (cached on subsequent)", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            // 異なるパラメータでキャッシュミスを発生させる
            execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                0, 0,
                4, 8,  // unique componentX, componentY
                10, 10,
                2,     // unique mode
                0x000000, 1.0,
                1,
                config
            );

            // 2 shader modules: vertex and fragment
            expect(config.device.createShaderModule).toHaveBeenCalledTimes(2);
        });

        it("should create render pipeline on first call (cached on subsequent)", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            // 異なるパラメータでキャッシュミスを発生させる
            execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                0, 0,
                2, 4,  // unique componentX, componentY
                10, 10,
                3,     // unique mode
                0x000000, 1.0,
                1,
                config
            );

            expect(config.device.createRenderPipeline).toHaveBeenCalled();
        });

        it("should return destination attachment", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                0, 0,
                1, 2,
                10, 10,
                0,
                0x000000, 1.0,
                1,
                config
            );

            expect(result).toBeDefined();
            expect(result.texture).toBeDefined();
        });
    });

    describe("component channels", () =>
    {
        it("should handle RED channel for X (componentX = 1)", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                0, 0,
                1, 0,  // RED for X, none for Y
                10, 10,
                0,
                0x000000, 1.0,
                1,
                config
            );

            expect(result).toBeDefined();
        });

        it("should handle GREEN channel for Y (componentY = 2)", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                0, 0,
                0, 2,  // none for X, GREEN for Y
                10, 10,
                0,
                0x000000, 1.0,
                1,
                config
            );

            expect(result).toBeDefined();
        });

        it("should handle BLUE channel (componentX = 4)", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                0, 0,
                4, 4,  // BLUE for both
                10, 10,
                0,
                0x000000, 1.0,
                1,
                config
            );

            expect(result).toBeDefined();
        });

        it("should handle ALPHA channel (componentX = 8)", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                0, 0,
                8, 8,  // ALPHA for both
                10, 10,
                0,
                0x000000, 1.0,
                1,
                config
            );

            expect(result).toBeDefined();
        });
    });

    describe("displacement modes", () =>
    {
        it("should handle clamp mode (mode = 0)", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                0, 0,
                1, 2,
                10, 10,
                0,  // clamp
                0x000000, 1.0,
                1,
                config
            );

            expect(result).toBeDefined();
        });

        it("should handle color mode (mode = 1)", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                0, 0,
                1, 2,
                10, 10,
                1,  // color
                0xFF0000, 0.5,  // red with 50% alpha
                1,
                config
            );

            expect(result).toBeDefined();
            expect(config.device.queue.writeBuffer).toHaveBeenCalled();
        });

        it("should handle wrap mode (mode = 2)", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                0, 0,
                1, 2,
                10, 10,
                2,  // wrap
                0x000000, 1.0,
                1,
                config
            );

            expect(result).toBeDefined();
        });

        it("should handle ignore mode (mode = 3)", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                0, 0,
                1, 2,
                10, 10,
                3,  // ignore
                0x000000, 1.0,
                1,
                config
            );

            expect(result).toBeDefined();
        });
    });

    describe("map point offset", () =>
    {
        it("should handle mapPoint X offset", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                20, 0,  // mapPoint X = 20
                1, 2,
                10, 10,
                0,
                0x000000, 1.0,
                1,
                config
            );

            expect(result).toBeDefined();
        });

        it("should handle mapPoint Y offset", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                0, 20,  // mapPoint Y = 20
                1, 2,
                10, 10,
                0,
                0x000000, 1.0,
                1,
                config
            );

            expect(result).toBeDefined();
        });
    });

    describe("scale parameters", () =>
    {
        it("should handle different scale values", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                0, 0,
                1, 2,
                50, 30,  // different X and Y scales
                0,
                0x000000, 1.0,
                1,
                config
            );

            expect(result).toBeDefined();
            expect(config.device.queue.writeBuffer).toHaveBeenCalled();
        });

        it("should handle negative scale values", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                0, 0,
                1, 2,
                -20, -20,  // negative scales
                0,
                0x000000, 1.0,
                1,
                config
            );

            expect(result).toBeDefined();
        });
    });

    describe("render pass execution", () =>
    {
        it("should draw 6 vertices", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const bitmapBuffer = new Uint8Array(64 * 64 * 4);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                bitmapBuffer,
                64, 64,
                0, 0,
                1, 2,
                10, 10,
                0,
                0x000000, 1.0,
                1,
                config
            );

            const mockPassEncoder = (config.commandEncoder.beginRenderPass as ReturnType<typeof vi.fn>).mock.results[0].value;
            expect(mockPassEncoder.draw).toHaveBeenCalledWith(6, 1, 0, 0);
        });
    });
});
