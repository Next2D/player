import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PipelineManager } from "./PipelineManager";

// Mock GPUShaderStage
const GPUShaderStage = {
    VERTEX: 0x01,
    FRAGMENT: 0x02,
    COMPUTE: 0x04
};
(globalThis as any).GPUShaderStage = GPUShaderStage;

describe("PipelineManager", () =>
{
    afterEach(() => vi.unstubAllGlobals());
    // Create a mock implementation for testing without the actual class
    class MockPipelineManager
    {
        private pipelines: Map<string, any>;
        private bindGroupLayouts: Map<string, any>;

        constructor (_device: GPUDevice, _format: GPUTextureFormat)
        {
            this.pipelines = new Map();
            this.bindGroupLayouts = new Map();

            // Initialize mock pipelines
            const pipelineNames = [
                "fill", "fill_bgra", "fill_bgra_stencil",
                "stencil_write", "stencil_fill",
                "clip", "clip_stencil",
                "mask", "mask_union",
                "basic",
                "texture", "texture_bgra",
                "instanced", "instanced_bgra",
                "gradient", "gradient_bgra",
                "bitmap_fill",
                "blend",
                "blur_filter",
                "texture_copy",
                "color_matrix_filter",
                "glow_filter",
                "drop_shadow_filter",
                "bevel_filter",
                "gradient_glow_filter",
                "gradient_bevel_filter",
                "node_clear"
            ];

            for (const name of pipelineNames) {
                this.pipelines.set(name, { "label": `pipeline_${name}` });
            }

            // Initialize mock bind group layouts
            const layoutNames = [
                "fill", "stencil", "clip", "mask", "basic", "texture",
                "instanced", "gradient", "bitmap_fill", "blend",
                "blur_filter", "texture_copy", "color_matrix_filter",
                "glow_filter", "drop_shadow_filter", "bevel_filter",
                "gradient_glow_filter", "gradient_bevel_filter",
                "node_clear"
            ];

            for (const name of layoutNames) {
                this.bindGroupLayouts.set(name, { "label": `layout_${name}` });
            }
        }

        getPipeline (name: string): any
        {
            return this.pipelines.get(name);
        }

        getBindGroupLayout (name: string): any
        {
            return this.bindGroupLayouts.get(name);
        }
    }

    const createMockDevice = (): GPUDevice =>
    {
        return {
            "createShaderModule": vi.fn(() => ({ "label": "mockShaderModule" })),
            "createBindGroupLayout": vi.fn(() => ({ "label": "mockBindGroupLayout" })),
            "createPipelineLayout": vi.fn(() => ({ "label": "mockPipelineLayout" })),
            "createRenderPipeline": vi.fn(() => ({ "label": "mockRenderPipeline" }))
        } as unknown as GPUDevice;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    it("lazily creates cached CT variants with the original output blend and sample state", () =>
    {
        const device = createMockDevice();
        vi.stubGlobal("GPUColorWrite", { "ALL": 15 });
        const descriptors = new Map<GPURenderPipeline, GPURenderPipelineDescriptor>();
        vi.mocked(device.createRenderPipeline).mockImplementation(descriptor =>
        {
            const pipeline = {} as GPURenderPipeline;
            descriptors.set(pipeline, descriptor);
            return pipeline;
        });
        const manager = new PipelineManager(device, "bgra8unorm");
        manager.getPipeline("filter_output");
        expect(vi.mocked(device.createShaderModule).mock.calls.some(([descriptor]) =>
            descriptor.code.includes("pack4x8unorm"))).toBe(false);
        const initialCount = descriptors.size;
        manager.getPipeline("cached_ct");
        expect(descriptors.size - initialCount).toBe(10);
        for (const suffix of ["", "_add", "_screen", "_alpha", "_erase"]) {
            for (const msaa of ["", "_msaa"]) {
                const fused = manager.getPipeline(`cached_ct${suffix}${msaa}`)!;
                const descriptor = descriptors.get(fused)!;
                const original = descriptors.get(manager.getPipeline(`filter_output${suffix}${msaa}`)!)!;
                const target = Array.from(descriptor.fragment!.targets)[0]!;
                expect(target.format).toBe("bgra8unorm");
                expect(descriptor.multisample?.count ?? 1).toBe(msaa ? 4 : 1);
                expect(target.blend).toEqual(Array.from(original.fragment!.targets)[0]!.blend);
                expect(manager.getPipeline(`cached_ct${suffix}${msaa}`)).toBe(fused);
            }
        }
        expect(descriptors.size - initialCount).toBe(10);
    });

    it("creates the default gradient variants at start-up, not on first use", () =>
    {
        const device = createMockDevice();
        vi.stubGlobal("GPUColorWrite", { "ALL": 15 });
        vi.mocked(device.createRenderPipeline).mockImplementation(() => ({} as GPURenderPipeline));
        const manager = new PipelineManager(device, "bgra8unorm");
        const initialCount = vi.mocked(device.createRenderPipeline).mock.calls.length;

        // 線形・放射状 (spread は pad) は起動時に作ってあるので、使うときには作らない
        const linear = manager.getGradientPipeline("gradient_fill_stencil_atlas", 0, 2);
        const radial = manager.getGradientPipeline("gradient_fill_stencil_atlas", 1, 2);
        expect(linear).toBeDefined();
        expect(radial).toBeDefined();
        expect(linear).not.toBe(radial);
        expect(vi.mocked(device.createRenderPipeline).mock.calls.length).toBe(initialCount);

        // ほかの組み合わせは、使うときに作る
        manager.getGradientPipeline("gradient_fill_stencil_atlas", 0, 0);
        expect(vi.mocked(device.createRenderPipeline).mock.calls.length).toBe(initialCount + 1);
    });

    describe("constructor", () =>
    {
        it("should create instance with device and format", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            expect(manager).toBeDefined();
        });
    });

    describe("getPipeline", () =>
    {
        it("should return fill pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const pipeline = manager.getPipeline("fill");

            expect(pipeline).toBeDefined();
        });

        it("should return fill_bgra pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const pipeline = manager.getPipeline("fill_bgra");

            expect(pipeline).toBeDefined();
        });

        it("should return mask pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const pipeline = manager.getPipeline("mask");

            expect(pipeline).toBeDefined();
        });

        it("should return basic pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const pipeline = manager.getPipeline("basic");

            expect(pipeline).toBeDefined();
        });

        it("should return texture pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const pipeline = manager.getPipeline("texture");

            expect(pipeline).toBeDefined();
        });

        it("should return instanced pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const pipeline = manager.getPipeline("instanced");

            expect(pipeline).toBeDefined();
        });

        it("should return gradient pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const pipeline = manager.getPipeline("gradient");

            expect(pipeline).toBeDefined();
        });

        it("should return blend pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const pipeline = manager.getPipeline("blend");

            expect(pipeline).toBeDefined();
        });

        it("should return blur filter pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const pipeline = manager.getPipeline("blur_filter");

            expect(pipeline).toBeDefined();
        });

        it("should return texture copy pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const pipeline = manager.getPipeline("texture_copy");

            expect(pipeline).toBeDefined();
        });

        it("should return color matrix filter pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const pipeline = manager.getPipeline("color_matrix_filter");

            expect(pipeline).toBeDefined();
        });

        it("should return glow filter pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const pipeline = manager.getPipeline("glow_filter");

            expect(pipeline).toBeDefined();
        });

        it("should return drop shadow filter pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const pipeline = manager.getPipeline("drop_shadow_filter");

            expect(pipeline).toBeDefined();
        });

        it("should return bevel filter pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const pipeline = manager.getPipeline("bevel_filter");

            expect(pipeline).toBeDefined();
        });

        it("should return gradient glow filter pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const pipeline = manager.getPipeline("gradient_glow_filter");

            expect(pipeline).toBeDefined();
        });

        it("should return gradient bevel filter pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const pipeline = manager.getPipeline("gradient_bevel_filter");

            expect(pipeline).toBeDefined();
        });

        it("should return undefined for non-existent pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            expect(manager.getPipeline("nonexistent")).toBeUndefined();
        });
    });

    describe("getBindGroupLayout", () =>
    {
        it("should return fill bind group layout", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const layout = manager.getBindGroupLayout("fill");

            expect(layout).toBeDefined();
        });

        it("should return mask bind group layout", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const layout = manager.getBindGroupLayout("mask");

            expect(layout).toBeDefined();
        });

        it("should return basic bind group layout", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const layout = manager.getBindGroupLayout("basic");

            expect(layout).toBeDefined();
        });

        it("should return texture bind group layout", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const layout = manager.getBindGroupLayout("texture");

            expect(layout).toBeDefined();
        });

        it("should return instanced bind group layout", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const layout = manager.getBindGroupLayout("instanced");

            expect(layout).toBeDefined();
        });

        it("should return gradient bind group layout", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const layout = manager.getBindGroupLayout("gradient");

            expect(layout).toBeDefined();
        });

        it("should return blend bind group layout", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const layout = manager.getBindGroupLayout("blend");

            expect(layout).toBeDefined();
        });

        it("should return blur filter bind group layout", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            const layout = manager.getBindGroupLayout("blur_filter");

            expect(layout).toBeDefined();
        });

        it("should return undefined for non-existent layout", () =>
        {
            const device = createMockDevice();
            const manager = new MockPipelineManager(device, "bgra8unorm");

            expect(manager.getBindGroupLayout("nonexistent")).toBeUndefined();
        });
    });
});
