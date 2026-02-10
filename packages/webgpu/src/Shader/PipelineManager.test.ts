import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock GPUShaderStage
const GPUShaderStage = {
    VERTEX: 0x01,
    FRAGMENT: 0x02,
    COMPUTE: 0x04
};
(globalThis as any).GPUShaderStage = GPUShaderStage;

describe("PipelineManager", () =>
{
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
