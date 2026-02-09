import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { ComputePipelineManager } from "../ComputePipelineManager";
import { execute } from "./ComputeExecuteBlurService";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    UNIFORM: 0x0040,
    COPY_DST: 0x0008
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

describe("ComputeExecuteBlurService", () =>
{
    const createMockDevice = () =>
    {
        const mockBuffer = { "label": "mockBuffer" };
        return {
            "createBuffer": vi.fn(() => mockBuffer),
            "createBindGroup": vi.fn(() => ({ "label": "mockBindGroup" })),
            "queue": {
                "writeBuffer": vi.fn()
            }
        } as unknown as GPUDevice;
    };

    const createMockCommandEncoder = () =>
    {
        const mockComputePass = {
            "setPipeline": vi.fn(),
            "setBindGroup": vi.fn(),
            "dispatchWorkgroups": vi.fn(),
            "end": vi.fn()
        };
        return {
            "beginComputePass": vi.fn(() => mockComputePass),
            "_mockComputePass": mockComputePass
        } as unknown as GPUCommandEncoder & { _mockComputePass: any };
    };

    const createMockComputePipelineManager = (hasPipeline: boolean = true) =>
    {
        return {
            "getPipeline": vi.fn(() => hasPipeline ? { "label": "mockPipeline" } : null),
            "getBindGroupLayout": vi.fn(() => hasPipeline ? { "label": "mockLayout" } : null)
        } as unknown as ComputePipelineManager;
    };

    const createMockAttachment = (width: number, height: number): IAttachmentObject =>
    {
        return {
            "id": 1,
            "width": width,
            "height": height,
            "clipLevel": 0,
            "msaa": false,
            "mask": false,
            "color": null,
            "texture": {
                "id": 1,
                "width": width,
                "height": height,
                "area": width * height,
                "smooth": true,
                "resource": {} as GPUTexture,
                "view": { "label": "mockView" } as unknown as GPUTextureView
            },
            "stencil": null,
            "msaaTexture": null,
            "msaaStencil": null
        };
    };

    beforeEach(() =>
    {
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    describe("pipeline selection", () =>
    {
        it("should use horizontal pipeline when isHorizontal is true", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const pipelineManager = createMockComputePipelineManager();
            const source = createMockAttachment(256, 256);
            const dest = createMockAttachment(256, 256);

            execute(device, commandEncoder, pipelineManager, source, dest, true, 8);

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("blur_compute_horizontal");
        });

        it("should use vertical pipeline when isHorizontal is false", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const pipelineManager = createMockComputePipelineManager();
            const source = createMockAttachment(256, 256);
            const dest = createMockAttachment(256, 256);

            execute(device, commandEncoder, pipelineManager, source, dest, false, 8);

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("blur_compute_vertical");
        });

        it("should return early when pipeline not found", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const pipelineManager = createMockComputePipelineManager(false);
            const source = createMockAttachment(256, 256);
            const dest = createMockAttachment(256, 256);

            execute(device, commandEncoder, pipelineManager, source, dest, true, 8);

            expect(commandEncoder.beginComputePass).not.toHaveBeenCalled();
        });
    });

    describe("parameter buffer", () =>
    {
        it("should create uniform buffer with correct usage", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const pipelineManager = createMockComputePipelineManager();
            const source = createMockAttachment(256, 256);
            const dest = createMockAttachment(256, 256);

            execute(device, commandEncoder, pipelineManager, source, dest, true, 8);

            expect(device.createBuffer).toHaveBeenCalledWith(
                expect.objectContaining({
                    "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                })
            );
        });

        it("should write parameter data to buffer", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const pipelineManager = createMockComputePipelineManager();
            const source = createMockAttachment(256, 256);
            const dest = createMockAttachment(256, 256);

            execute(device, commandEncoder, pipelineManager, source, dest, true, 8);

            expect(device.queue.writeBuffer).toHaveBeenCalled();
        });

        it("should set horizontal direction vector when isHorizontal is true", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const pipelineManager = createMockComputePipelineManager();
            const source = createMockAttachment(256, 256);
            const dest = createMockAttachment(256, 256);

            execute(device, commandEncoder, pipelineManager, source, dest, true, 8);

            // Check the params passed to writeBuffer
            const writeBufferCall = (device.queue.writeBuffer as ReturnType<typeof vi.fn>).mock.calls[0];
            const params = writeBufferCall[2] as Float32Array;
            expect(params[0]).toBe(1.0); // direction.x
            expect(params[1]).toBe(0.0); // direction.y
        });

        it("should set vertical direction vector when isHorizontal is false", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const pipelineManager = createMockComputePipelineManager();
            const source = createMockAttachment(256, 256);
            const dest = createMockAttachment(256, 256);

            execute(device, commandEncoder, pipelineManager, source, dest, false, 8);

            const writeBufferCall = (device.queue.writeBuffer as ReturnType<typeof vi.fn>).mock.calls[0];
            const params = writeBufferCall[2] as Float32Array;
            expect(params[0]).toBe(0.0); // direction.x
            expect(params[1]).toBe(1.0); // direction.y
        });
    });

    describe("bind group", () =>
    {
        it("should create bind group with correct layout", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const pipelineManager = createMockComputePipelineManager();
            const source = createMockAttachment(256, 256);
            const dest = createMockAttachment(256, 256);

            execute(device, commandEncoder, pipelineManager, source, dest, true, 8);

            expect(pipelineManager.getBindGroupLayout).toHaveBeenCalledWith("blur_compute");
        });

        it("should create bind group with source and dest textures", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const pipelineManager = createMockComputePipelineManager();
            const source = createMockAttachment(256, 256);
            const dest = createMockAttachment(256, 256);

            execute(device, commandEncoder, pipelineManager, source, dest, true, 8);

            expect(device.createBindGroup).toHaveBeenCalled();
        });
    });

    describe("compute pass", () =>
    {
        it("should begin compute pass with correct label for horizontal", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const pipelineManager = createMockComputePipelineManager();
            const source = createMockAttachment(256, 256);
            const dest = createMockAttachment(256, 256);

            execute(device, commandEncoder, pipelineManager, source, dest, true, 8);

            expect(commandEncoder.beginComputePass).toHaveBeenCalledWith({
                "label": "blur_compute_pass_h"
            });
        });

        it("should begin compute pass with correct label for vertical", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const pipelineManager = createMockComputePipelineManager();
            const source = createMockAttachment(256, 256);
            const dest = createMockAttachment(256, 256);

            execute(device, commandEncoder, pipelineManager, source, dest, false, 8);

            expect(commandEncoder.beginComputePass).toHaveBeenCalledWith({
                "label": "blur_compute_pass_v"
            });
        });

        it("should set pipeline", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const pipelineManager = createMockComputePipelineManager();
            const source = createMockAttachment(256, 256);
            const dest = createMockAttachment(256, 256);

            execute(device, commandEncoder, pipelineManager, source, dest, true, 8);

            expect(commandEncoder._mockComputePass.setPipeline).toHaveBeenCalled();
        });

        it("should set bind group", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const pipelineManager = createMockComputePipelineManager();
            const source = createMockAttachment(256, 256);
            const dest = createMockAttachment(256, 256);

            execute(device, commandEncoder, pipelineManager, source, dest, true, 8);

            expect(commandEncoder._mockComputePass.setBindGroup).toHaveBeenCalledWith(0, expect.anything());
        });

        it("should end compute pass", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const pipelineManager = createMockComputePipelineManager();
            const source = createMockAttachment(256, 256);
            const dest = createMockAttachment(256, 256);

            execute(device, commandEncoder, pipelineManager, source, dest, true, 8);

            expect(commandEncoder._mockComputePass.end).toHaveBeenCalled();
        });
    });

    describe("workgroup dispatch", () =>
    {
        it("should calculate correct workgroup count for 256x256", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const pipelineManager = createMockComputePipelineManager();
            const source = createMockAttachment(256, 256);
            const dest = createMockAttachment(256, 256);

            execute(device, commandEncoder, pipelineManager, source, dest, true, 8);

            // 256 / 16 = 16 workgroups in each dimension
            expect(commandEncoder._mockComputePass.dispatchWorkgroups).toHaveBeenCalledWith(16, 16, 1);
        });

        it("should round up workgroup count for non-aligned size", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const pipelineManager = createMockComputePipelineManager();
            const source = createMockAttachment(100, 100);
            const dest = createMockAttachment(100, 100);

            execute(device, commandEncoder, pipelineManager, source, dest, true, 8);

            // ceil(100 / 16) = 7 workgroups in each dimension
            expect(commandEncoder._mockComputePass.dispatchWorkgroups).toHaveBeenCalledWith(7, 7, 1);
        });
    });
});
