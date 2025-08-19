import { describe, expect, it, vi, beforeEach } from "vitest";
import { ShaderManager } from "./ShaderManager";

// Mock WebGPU constants
Object.defineProperty(global, "GPUBufferUsage", {
    value: {
        UNIFORM: 1,
        COPY_DST: 2
    },
    writable: true
});

Object.defineProperty(global, "GPUShaderStage", {
    value: {
        VERTEX: 1,
        FRAGMENT: 2,
        COMPUTE: 4
    },
    writable: true
});

// Mock WebGPUUtil
vi.mock("../WebGPUUtil", () => ({
    $device: {
        createBuffer: vi.fn(() => ({
            destroy: vi.fn()
        })),
        createBindGroupLayout: vi.fn(() => ({})),
        createShaderModule: vi.fn(() => ({})),
        createPipelineLayout: vi.fn(() => ({})),
        createRenderPipeline: vi.fn(() => ({})),
        createComputePipeline: vi.fn(() => ({})),
        createBindGroup: vi.fn(() => ({})),
        queue: {
            writeBuffer: vi.fn()
        }
    }
}));

describe("WebGPU ShaderManager test", () =>
{
    let mockDevice: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        const webgpuUtil = await import("../WebGPUUtil");
        mockDevice = webgpuUtil.$device;
    });

    it("should create render pipeline correctly", () =>
    {
        const vertexSource = "vertex shader source";
        const fragmentSource = "fragment shader source";
        
        const shaderManager = new ShaderManager(vertexSource, fragmentSource);
        
        expect(mockDevice.createBuffer).toHaveBeenCalledWith({
            "size": 256,
            "usage": 3 // GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST (1 | 2)
        });
        
        expect(mockDevice.createBindGroupLayout).toHaveBeenCalled();
        expect(mockDevice.createShaderModule).toHaveBeenCalledTimes(2); // vertex and fragment
        expect(mockDevice.createRenderPipeline).toHaveBeenCalled();
        expect(mockDevice.createBindGroup).toHaveBeenCalled();
        expect(shaderManager.renderPipelineObject).not.toBeNull();
        expect(shaderManager.computePipelineObject).toBeNull();
    });

    it("should create compute pipeline correctly", () =>
    {
        const computeSource = "compute shader source";
        
        const shaderManager = new ShaderManager("", "", computeSource);
        
        expect(mockDevice.createShaderModule).toHaveBeenCalledWith({
            "code": computeSource
        });
        expect(mockDevice.createComputePipeline).toHaveBeenCalled();
        expect(shaderManager.computePipelineObject).not.toBeNull();
        expect(shaderManager.renderPipelineObject).toBeNull();
    });

    it("should update uniforms correctly", () =>
    {
        const shaderManager = new ShaderManager("vertex", "fragment");
        const uniformData = new Float32Array([1.0, 2.0, 3.0, 4.0]);
        
        shaderManager.updateUniforms(uniformData, 0);
        
        expect(mockDevice.queue.writeBuffer).toHaveBeenCalledWith(
            expect.anything(),
            0,
            uniformData
        );
    });

    it("should destroy resources correctly", () =>
    {
        const mockBuffer = {
            destroy: vi.fn()
        };
        
        mockDevice.createBuffer.mockReturnValue(mockBuffer);
        
        const shaderManager = new ShaderManager("vertex", "fragment");
        shaderManager.destroy();
        
        expect(mockBuffer.destroy).toHaveBeenCalled();
    });

    it("should have correct uniform data accessor", () =>
    {
        const shaderManager = new ShaderManager("vertex", "fragment");
        
        expect(shaderManager.uniformData).toBeInstanceOf(Float32Array);
        expect(shaderManager.uniformData.length).toBe(64); // 256 bytes / 4 bytes per float
    });

    it("should handle render pass encoder correctly", () =>
    {
        const mockPassEncoder = {
            setPipeline: vi.fn(),
            setBindGroup: vi.fn()
        } as unknown as GPURenderPassEncoder;
        
        const shaderManager = new ShaderManager("vertex", "fragment");
        shaderManager.useRenderPipeline(mockPassEncoder);
        
        expect(mockPassEncoder.setPipeline).toHaveBeenCalled();
        expect(mockPassEncoder.setBindGroup).toHaveBeenCalledWith(0, expect.anything());
    });

    it("should handle compute pass encoder correctly", () =>
    {
        const mockPassEncoder = {
            setPipeline: vi.fn(),
            setBindGroup: vi.fn()
        } as unknown as GPUComputePassEncoder;
        
        const shaderManager = new ShaderManager("", "", "compute");
        shaderManager.useComputePipeline(mockPassEncoder);
        
        expect(mockPassEncoder.setPipeline).toHaveBeenCalled();
        expect(mockPassEncoder.setBindGroup).toHaveBeenCalledWith(0, expect.anything());
    });
});