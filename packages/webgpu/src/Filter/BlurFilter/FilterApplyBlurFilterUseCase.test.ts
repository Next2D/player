import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { execute } from "./FilterApplyBlurFilterUseCase";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    UNIFORM: 0x40,
    COPY_DST: 0x08
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

// Mock offset
vi.mock("../index", () => ({
    "$offset": { "x": 0, "y": 0 }
}));

import { $offset } from "../FilterOffset";

// Mock BlurFilterUseCase
vi.mock("../BlurFilterUseCase", () => ({
    "calculateBlurParams": vi.fn(() => ({
        "baseBlurX": 10,
        "baseBlurY": 10,
        "offsetX": 20,
        "offsetY": 20,
        "bufferScaleX": 1,
        "bufferScaleY": 1
    })),
    "calculateDirectionalBlurParams": vi.fn(() => ({
        "offsetX": 0.01,
        "offsetY": 0,
        "fraction": 1,
        "samples": 11,
        "halfBlur": 5
    }))
}));

describe("FilterApplyBlurFilterUseCase", () =>
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
            "setViewport": vi.fn(),
            "setScissorRect": vi.fn(),
            "draw": vi.fn(),
            "end": vi.fn()
        };

        return {
            "device": {
                "createBuffer": vi.fn(() => ({ "label": "mockBuffer" })),
                "queue": { "writeBuffer": vi.fn() },
                "createBindGroup": vi.fn(() => ({ "label": "mockBindGroup" }))
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

    it("binds arena offsets and resets the binding for standalone fallback", () =>
    {
        const config = createMockConfig();
        const source = createMockAttachment();
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const run = () => execute(source, matrix, 10, 10, 1, 1, config);
        run(); // Warm the constant blur-copy uniform, which is intentionally not staged.
        vi.clearAllMocks();
        const shared = {} as GPUBuffer;
        let offset = 256;
        const allocate = vi.fn((data: Float32Array) =>
        {
            const binding = { "buffer": shared, offset, "size": data.byteLength };
            offset += 256;
            return binding;
        });
        config.bufferManager = { "allocateUniformBinding": allocate } as NonNullable<IFilterConfig["bufferManager"]>;
        const bindings: GPUBufferBinding[] = [];
        vi.mocked(config.device.createBindGroup).mockImplementation(descriptor =>
        {
            bindings.push({ ...Array.from(descriptor.entries)[0].resource as GPUBufferBinding });
            return {} as GPUBindGroup;
        });
        run();
        const staged = bindings.filter(binding => binding.buffer === shared);
        expect(staged.map(binding => [binding.offset, binding.size])).toEqual([[256, 16], [512, 16]]);
        expect(config.device.queue.writeBuffer).not.toHaveBeenCalled();
        config.bufferManager = undefined;
        bindings.length = 0;
        run();
        expect(config.device.queue.writeBuffer).toHaveBeenCalled();
        expect(bindings.at(-1)?.offset).toBe(0);
        expect(bindings.at(-1)?.size).toBe(16);
    });

    it("reuses static bindings but separates offsets and changed resources", () =>
    {
        const config = createMockConfig();
        const source = createMockAttachment();
        const temporary = createMockAttachment();
        vi.mocked(config.frameBufferManager.createTemporaryAttachment).mockReturnValue(temporary);
        let layout = {} as GPUBindGroupLayout;
        let sampler = {} as GPUSampler;
        let buffer = {} as GPUBuffer;
        let offset = 0;
        let size = 16;
        vi.mocked(config.pipelineManager.getBindGroupLayout).mockImplementation(() => layout);
        vi.mocked(config.textureManager.createSampler).mockImplementation(() => sampler);
        config.bufferManager = {
            "allocateUniformBinding": () => ({ buffer, offset, size })
        } as NonNullable<IFilterConfig["bufferManager"]>;
        const bindings: GPUBindGroup[] = [];
        const create = vi.mocked(config.device.createBindGroup).mockImplementation(() => {
            const group = {} as GPUBindGroup;
            bindings.push(group);
            return group;
        });
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const run = () => execute(source, matrix, 10, 0, 1, 1, config);
        run();
        const initial = create.mock.calls.length;
        run();
        expect(create).toHaveBeenCalledTimes(initial);
        offset = 256; run();
        expect(create).toHaveBeenCalledTimes(initial + 1);
        offset = 0; run();
        expect(create).toHaveBeenCalledTimes(initial + 1);
        const pass = vi.mocked(config.commandEncoder.beginRenderPass).mock.results.at(-1)!.value;
        expect(pass.setBindGroup).toHaveBeenLastCalledWith(0, bindings[initial - 1]);
        for (const change of [
            () => { buffer = {} as GPUBuffer; },
            () => { layout = {} as GPUBindGroupLayout; },
            () => { sampler = {} as GPUSampler; },
            () => { config.device = { ...config.device, "createBindGroup": create } as GPUDevice; },
            () => { size = 32; },
            () => { temporary.texture!.view = {} as GPUTextureView; }
        ]) {
            const before = create.mock.calls.length;
            change(); run();
            expect(create).toHaveBeenCalledTimes(before + 1);
            run();
            expect(create).toHaveBeenCalledTimes(before + 1);
        }
        // Churn is bounded: after the 65th distinct offset, offset zero must miss.
        for (let i = 1; i <= 64; i++) { offset = i * 256; run(); }
        const before = create.mock.calls.length;
        offset = 0; run();
        expect(create).toHaveBeenCalledTimes(before + 1);
        config.bufferManager = undefined;
        const fallback = create.mock.calls.length;
        run(); run();
        expect(create).toHaveBeenCalledTimes(fallback + 2);
        expect(new Set(bindings).size).toBe(bindings.length);
    });

   beforeEach(() =>
    {
        vi.clearAllMocks();
        $offset.x = 0;
        $offset.y = 0;
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    describe("basic blur execution", () =>
    {
        it("should create temporary attachments for ping-pong buffer", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(sourceAttachment, matrix, 10, 10, 1, 1, config);

            // Should create 2 temporary attachments for ping-pong
            expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalledTimes(2);
        });

        it("should create sampler with linear filtering", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(sourceAttachment, matrix, 10, 10, 1, 1, config);

            expect(config.textureManager.createSampler).toHaveBeenCalledWith("blur_sampler", true);
        });

        it("should update offset based on blur parameters", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(sourceAttachment, matrix, 10, 10, 1, 1, config);

            expect($offset.x).toBe(20);
            expect($offset.y).toBe(20);
        });

        it("should return result attachment", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            const result = execute(sourceAttachment, matrix, 10, 10, 1, 1, config);

            expect(result).toBeDefined();
            expect(result.texture).toBeDefined();
        });
    });

    describe("multi-pass blur", () =>
    {
        it("should perform blur passes based on quality", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(sourceAttachment, matrix, 10, 10, 3, 1, config);

            // Quality 3 = 3 iterations * 2 directions (H+V) + 1 initial copy = 7 render passes
            // Actually: 1 copy + (3 * 2 blur passes) = 7
            expect(config.commandEncoder.beginRenderPass).toHaveBeenCalled();
        });

        it("should skip horizontal pass when blurX is 0", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(sourceAttachment, matrix, 0, 10, 1, 1, config);

            // Should still work, just fewer passes
            expect(config.commandEncoder.beginRenderPass).toHaveBeenCalled();
        });

        it("should skip vertical pass when blurY is 0", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(sourceAttachment, matrix, 10, 0, 1, 1, config);

            // Should still work, just fewer passes
            expect(config.commandEncoder.beginRenderPass).toHaveBeenCalled();
        });
    });

    describe("buffer management", () =>
    {
        it("should release unused buffer after processing", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(sourceAttachment, matrix, 10, 10, 1, 1, config);

            // Should release at least one temporary attachment
            expect(config.frameBufferManager.releaseTemporaryAttachment).toHaveBeenCalled();
        });
    });

    describe("pipeline error handling", () =>
    {
        it("should log error when pipeline not found", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();
            (config.pipelineManager.getPipeline as ReturnType<typeof vi.fn>).mockReturnValue(null);

            execute(sourceAttachment, matrix, 10, 10, 1, 1, config);

            expect(console.error).toHaveBeenCalled();
        });

        it("should log error when bind group layout not found", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();
            (config.pipelineManager.getBindGroupLayout as ReturnType<typeof vi.fn>).mockReturnValue(null);

            execute(sourceAttachment, matrix, 10, 10, 1, 1, config);

            expect(console.error).toHaveBeenCalled();
        });
    });
});
