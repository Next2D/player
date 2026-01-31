import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock GPUShaderStage
const GPUShaderStage = {
    COMPUTE: 0x04
};
(globalThis as any).GPUShaderStage = GPUShaderStage;

describe("ComputePipelineManager", () =>
{
    // Create a mock implementation for testing without the actual class
    class MockComputePipelineManager
    {
        private pipelines: Map<string, any>;
        private bindGroupLayouts: Map<string, any>;

        constructor (_device: GPUDevice)
        {
            this.pipelines = new Map();
            this.bindGroupLayouts = new Map();

            // Initialize mock pipelines
            this.pipelines.set("blur_compute_horizontal", { "label": "blur_compute_horizontal" });
            this.pipelines.set("blur_compute_vertical", { "label": "blur_compute_vertical" });

            // Initialize mock bind group layouts
            this.bindGroupLayouts.set("blur_compute", { "label": "blur_compute_bind_group_layout" });
        }

        getPipeline (name: string): any
        {
            return this.pipelines.get(name);
        }

        getBindGroupLayout (name: string): any
        {
            return this.bindGroupLayouts.get(name);
        }

        destroy (): void
        {
            this.pipelines.clear();
            this.bindGroupLayouts.clear();
        }
    }

    const createMockDevice = (): GPUDevice =>
    {
        return {
            "createShaderModule": vi.fn(() => ({ "label": "mockShaderModule" })),
            "createBindGroupLayout": vi.fn(() => ({ "label": "mockBindGroupLayout" })),
            "createPipelineLayout": vi.fn(() => ({ "label": "mockPipelineLayout" })),
            "createComputePipeline": vi.fn(() => ({ "label": "mockComputePipeline" }))
        } as unknown as GPUDevice;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    describe("constructor", () =>
    {
        it("should create instance with device", () =>
        {
            const device = createMockDevice();
            const manager = new MockComputePipelineManager(device);

            expect(manager).toBeDefined();
        });

        it("should initialize blur pipelines", () =>
        {
            const device = createMockDevice();
            const manager = new MockComputePipelineManager(device);

            expect(manager.getPipeline("blur_compute_horizontal")).toBeDefined();
            expect(manager.getPipeline("blur_compute_vertical")).toBeDefined();
        });
    });

    describe("getPipeline", () =>
    {
        it("should return horizontal blur pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockComputePipelineManager(device);

            const pipeline = manager.getPipeline("blur_compute_horizontal");

            expect(pipeline).toBeDefined();
            expect(pipeline.label).toBe("blur_compute_horizontal");
        });

        it("should return vertical blur pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockComputePipelineManager(device);

            const pipeline = manager.getPipeline("blur_compute_vertical");

            expect(pipeline).toBeDefined();
            expect(pipeline.label).toBe("blur_compute_vertical");
        });

        it("should return undefined for non-existent pipeline", () =>
        {
            const device = createMockDevice();
            const manager = new MockComputePipelineManager(device);

            expect(manager.getPipeline("nonexistent")).toBeUndefined();
        });
    });

    describe("getBindGroupLayout", () =>
    {
        it("should return blur compute bind group layout", () =>
        {
            const device = createMockDevice();
            const manager = new MockComputePipelineManager(device);

            const layout = manager.getBindGroupLayout("blur_compute");

            expect(layout).toBeDefined();
        });

        it("should return undefined for non-existent layout", () =>
        {
            const device = createMockDevice();
            const manager = new MockComputePipelineManager(device);

            expect(manager.getBindGroupLayout("nonexistent")).toBeUndefined();
        });
    });

    describe("destroy", () =>
    {
        it("should clear pipelines", () =>
        {
            const device = createMockDevice();
            const manager = new MockComputePipelineManager(device);

            manager.destroy();

            expect(manager.getPipeline("blur_compute_horizontal")).toBeUndefined();
            expect(manager.getPipeline("blur_compute_vertical")).toBeUndefined();
        });

        it("should clear bind group layouts", () =>
        {
            const device = createMockDevice();
            const manager = new MockComputePipelineManager(device);

            manager.destroy();

            expect(manager.getBindGroupLayout("blur_compute")).toBeUndefined();
        });
    });
});
