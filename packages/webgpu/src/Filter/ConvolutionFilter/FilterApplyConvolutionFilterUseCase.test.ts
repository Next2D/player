import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { execute } from "./FilterApplyConvolutionFilterUseCase";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    UNIFORM: 0x40,
    COPY_DST: 0x08
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

// Mock GPUShaderStage
const GPUShaderStage = {
    VERTEX: 0x1,
    FRAGMENT: 0x2
};
(globalThis as any).GPUShaderStage = GPUShaderStage;

// Mock ShaderSource
vi.mock("../../Shader/ShaderSource", () => ({
    "ShaderSource": {
        "getConvolutionFilterFragmentShader": vi.fn(() => "/* mock fragment shader */"),
        "getBlurFilterVertexShader": vi.fn(() => "/* mock vertex shader */")
    }
}));

describe("FilterApplyConvolutionFilterUseCase", () =>
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

        const mockBindGroupLayout = { "label": "mockBindGroupLayout" };
        const mockPipelineLayout = { "label": "mockPipelineLayout" };
        const mockPipeline = { "label": "mockPipeline" };
        const mockShaderModule = { "label": "mockShaderModule" };

        return {
            "device": {
                "createBuffer": vi.fn(() => ({ "label": "mockBuffer" })),
                "queue": { "writeBuffer": vi.fn() },
                "createBindGroup": vi.fn(() => ({ "label": "mockBindGroup" })),
                "createBindGroupLayout": vi.fn(() => mockBindGroupLayout),
                "createPipelineLayout": vi.fn(() => mockPipelineLayout),
                "createRenderPipeline": vi.fn(() => mockPipeline),
                "createShaderModule": vi.fn(() => mockShaderModule)
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

    describe("basic convolution execution", () =>
    {
        it("should create output attachment with same dimensions", () =>
        {
            const sourceAttachment = createMockAttachment(200, 150);
            const matrix = new Float32Array([0, -1, 0, -1, 5, -1, 0, -1, 0]); // sharpen
            const config = createMockConfig();

            execute(
                sourceAttachment,
                3, 3,           // matrixX, matrixY
                matrix,
                1,              // divisor
                0,              // bias
                true,           // preserveAlpha
                true,           // clamp
                0x000000,       // color
                1.0,            // alpha
                config
            );

            expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalledWith(200, 150);
        });

        it("should create shader modules", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([0, -1, 0, -1, 5, -1, 0, -1, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                3, 3,
                matrix,
                1, 0,
                true, true,
                0x000000, 1.0,
                config
            );

            // 1 shader module: combined vertex and fragment
            expect(config.device.createShaderModule).toHaveBeenCalledTimes(1);
        });

        it("should create bind group layout", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([0, -1, 0, -1, 5, -1, 0, -1, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                3, 3,
                matrix,
                1, 0,
                true, true,
                0x000000, 1.0,
                config
            );

            expect(config.device.createBindGroupLayout).toHaveBeenCalledWith(
                expect.objectContaining({
                    "entries": expect.arrayContaining([
                        expect.objectContaining({ "binding": 0 }),
                        expect.objectContaining({ "binding": 1 }),
                        expect.objectContaining({ "binding": 2 })
                    ])
                })
            );
        });

        it("should create render pipeline", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([0, -1, 0, -1, 5, -1, 0, -1, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                3, 3,
                matrix,
                1, 0,
                true, true,
                0x000000, 1.0,
                config
            );

            expect(config.device.createRenderPipeline).toHaveBeenCalled();
        });

        it("should create sampler", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([0, -1, 0, -1, 5, -1, 0, -1, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                3, 3,
                matrix,
                1, 0,
                true, true,
                0x000000, 1.0,
                config
            );

            expect(config.textureManager.createSampler).toHaveBeenCalledWith("convolution_sampler", true);
        });

        it("should return destination attachment", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([0, -1, 0, -1, 5, -1, 0, -1, 0]);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                3, 3,
                matrix,
                1, 0,
                true, true,
                0x000000, 1.0,
                config
            );

            expect(result).toBeDefined();
            expect(result.texture).toBeDefined();
        });
    });

    describe("matrix size variations", () =>
    {
        it("should handle 3x3 matrix", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array(9).fill(1);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                3, 3,
                matrix,
                9, 0,
                true, true,
                0x000000, 1.0,
                config
            );

            expect(result).toBeDefined();
        });

        it("should handle 5x5 matrix", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array(25).fill(1);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                5, 5,
                matrix,
                25, 0,
                true, true,
                0x000000, 1.0,
                config
            );

            expect(result).toBeDefined();
        });

        it("should handle non-square matrix (3x5)", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array(15).fill(1);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                3, 5,
                matrix,
                15, 0,
                true, true,
                0x000000, 1.0,
                config
            );

            expect(result).toBeDefined();
        });
    });

    describe("filter parameters", () =>
    {
        it("should handle divisor of 0 (auto-calculate)", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([0, -1, 0, -1, 5, -1, 0, -1, 0]);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                3, 3,
                matrix,
                0, 0,  // divisor = 0
                true, true,
                0x000000, 1.0,
                config
            );

            expect(result).toBeDefined();
            expect(config.device.queue.writeBuffer).toHaveBeenCalled();
        });

        it("should handle bias value", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([0, -1, 0, -1, 5, -1, 0, -1, 0]);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                3, 3,
                matrix,
                1,
                128, // bias = 128
                true, true,
                0x000000, 1.0,
                config
            );

            expect(result).toBeDefined();
        });

        it("should handle preserveAlpha = false", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([0, -1, 0, -1, 5, -1, 0, -1, 0]);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                3, 3,
                matrix,
                1, 0,
                false, // preserveAlpha = false
                true,
                0x000000, 1.0,
                config
            );

            expect(result).toBeDefined();
        });

        it("should handle clamp = false", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([0, -1, 0, -1, 5, -1, 0, -1, 0]);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                3, 3,
                matrix,
                1, 0,
                true,
                false, // clamp = false
                0xFF0000, // substitute color
                0.5,      // substitute alpha
                config
            );

            expect(result).toBeDefined();
        });

        it("should handle substitute color", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([0, -1, 0, -1, 5, -1, 0, -1, 0]);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                3, 3,
                matrix,
                1, 0,
                true, false,
                0xFF00FF, // magenta
                0.75,
                config
            );

            expect(result).toBeDefined();
            expect(config.device.queue.writeBuffer).toHaveBeenCalled();
        });
    });

    describe("common convolution filters", () =>
    {
        it("should apply sharpen filter", () =>
        {
            const sourceAttachment = createMockAttachment();
            const sharpenMatrix = new Float32Array([
                0, -1, 0,
                -1, 5, -1,
                0, -1, 0
            ]);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                3, 3,
                sharpenMatrix,
                1, 0,
                true, true,
                0x000000, 1.0,
                config
            );

            expect(result).toBeDefined();
        });

        it("should apply blur filter", () =>
        {
            const sourceAttachment = createMockAttachment();
            const blurMatrix = new Float32Array([
                1, 1, 1,
                1, 1, 1,
                1, 1, 1
            ]);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                3, 3,
                blurMatrix,
                9, 0,  // divisor = 9
                true, true,
                0x000000, 1.0,
                config
            );

            expect(result).toBeDefined();
        });

        it("should apply edge detection filter", () =>
        {
            const sourceAttachment = createMockAttachment();
            const edgeMatrix = new Float32Array([
                -1, -1, -1,
                -1, 8, -1,
                -1, -1, -1
            ]);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                3, 3,
                edgeMatrix,
                1, 0,
                true, true,
                0x000000, 1.0,
                config
            );

            expect(result).toBeDefined();
        });

        it("should apply emboss filter", () =>
        {
            const sourceAttachment = createMockAttachment();
            const embossMatrix = new Float32Array([
                -2, -1, 0,
                -1, 1, 1,
                0, 1, 2
            ]);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                3, 3,
                embossMatrix,
                1, 128,  // bias = 128 for emboss
                true, true,
                0x000000, 1.0,
                config
            );

            expect(result).toBeDefined();
        });
    });

    describe("render pass execution", () =>
    {
        it("should begin render pass with correct descriptor", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([0, -1, 0, -1, 5, -1, 0, -1, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                3, 3,
                matrix,
                1, 0,
                true, true,
                0x000000, 1.0,
                config
            );

            expect(config.commandEncoder.beginRenderPass).toHaveBeenCalled();
        });

        it("should draw 6 vertices (2 triangles for fullscreen quad)", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([0, -1, 0, -1, 5, -1, 0, -1, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                3, 3,
                matrix,
                1, 0,
                true, true,
                0x000000, 1.0,
                config
            );

            const mockPassEncoder = (config.commandEncoder.beginRenderPass as ReturnType<typeof vi.fn>).mock.results[0].value;
            expect(mockPassEncoder.draw).toHaveBeenCalledWith(6, 1, 0, 0);
        });
    });
});
