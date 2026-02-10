import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    VERTEX: 0x0020,
    INDEX: 0x0010,
    UNIFORM: 0x0040,
    STORAGE: 0x0080,
    INDIRECT: 0x0100,
    COPY_SRC: 0x0004,
    COPY_DST: 0x0008
};

// Set global
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

// Mock GPUDevice
const mockBuffer = {
    getMappedRange: vi.fn(() => new ArrayBuffer(16)),
    unmap: vi.fn()
};

const mockDevice = {
    createBuffer: vi.fn(() => mockBuffer),
    queue: {
        writeBuffer: vi.fn()
    }
};

// Import after mocking
import { execute } from "./BufferManagerCreateIndirectBufferService";
import { execute as update } from "./BufferManagerUpdateIndirectBufferService";

describe("BufferManagerCreateIndirectBufferService", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    describe("execute", () =>
    {
        it("should create buffer with correct size", () =>
        {
            execute(mockDevice as unknown as GPUDevice, 6, 100, 0, 0);

            expect(mockDevice.createBuffer).toHaveBeenCalledWith(
                expect.objectContaining({
                    "size": 16, // 4 Uint32 values = 16 bytes
                    "usage": GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST,
                    "mappedAtCreation": true,
                    "label": "indirect_buffer"
                })
            );
        });

        it("should unmap buffer after writing", () =>
        {
            execute(mockDevice as unknown as GPUDevice, 6, 50, 0, 0);

            expect(mockBuffer.unmap).toHaveBeenCalled();
        });

        it("should return the created buffer", () =>
        {
            const result = execute(mockDevice as unknown as GPUDevice, 6, 100, 0, 0);
            expect(result).toBe(mockBuffer);
        });

        it("should handle default parameters", () =>
        {
            execute(mockDevice as unknown as GPUDevice, 6, 100);

            expect(mockDevice.createBuffer).toHaveBeenCalled();
        });
    });

    describe("update", () =>
    {
        it("should write buffer with correct data", () =>
        {
            update(mockDevice as unknown as GPUDevice, mockBuffer as unknown as GPUBuffer, 6, 200, 0, 0);

            expect(mockDevice.queue.writeBuffer).toHaveBeenCalledWith(
                mockBuffer,
                0,
                expect.any(Uint32Array)
            );
        });

        it("should handle different vertex and instance counts", () =>
        {
            update(mockDevice as unknown as GPUDevice, mockBuffer as unknown as GPUBuffer, 3, 500, 1, 2);

            expect(mockDevice.queue.writeBuffer).toHaveBeenCalled();
        });
    });
});
