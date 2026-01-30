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
const mockBuffer = {};

const mockDevice = {
    createBuffer: vi.fn(() => mockBuffer)
};

// Import after mocking
import { execute } from "./BufferManagerCreateStorageBufferService";

describe("BufferManagerCreateStorageBufferService", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    describe("execute", () =>
    {
        it("should create buffer with correct usage flags", () =>
        {
            const config = {
                "size": 1024,
                "usage": 0,
                "label": "test_storage"
            };

            execute(mockDevice as unknown as GPUDevice, config);

            expect(mockDevice.createBuffer).toHaveBeenCalledWith(
                expect.objectContaining({
                    "size": 1024,
                    "usage": GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX,
                    "label": "test_storage"
                })
            );
        });

        it("should include VERTEX flag for setVertexBuffer compatibility", () =>
        {
            const config = {
                "size": 2048,
                "usage": GPUBufferUsage.STORAGE
            };

            execute(mockDevice as unknown as GPUDevice, config);

            const callArgs = mockDevice.createBuffer.mock.calls[0][0];
            expect(callArgs.usage & GPUBufferUsage.VERTEX).toBeTruthy();
        });

        it("should use default label if not provided", () =>
        {
            const config = {
                "size": 512,
                "usage": 0
            };

            execute(mockDevice as unknown as GPUDevice, config);

            expect(mockDevice.createBuffer).toHaveBeenCalledWith(
                expect.objectContaining({
                    "label": "storage_buffer"
                })
            );
        });

        it("should return the created buffer", () =>
        {
            const config = {
                "size": 256,
                "usage": 0
            };

            const result = execute(mockDevice as unknown as GPUDevice, config);
            expect(result).toBe(mockBuffer);
        });

        it("should combine provided usage with required flags", () =>
        {
            const additionalUsage = GPUBufferUsage.UNIFORM;
            const config = {
                "size": 1024,
                "usage": additionalUsage
            };

            execute(mockDevice as unknown as GPUDevice, config);

            const callArgs = mockDevice.createBuffer.mock.calls[0][0];
            expect(callArgs.usage & additionalUsage).toBeTruthy();
            expect(callArgs.usage & GPUBufferUsage.STORAGE).toBeTruthy();
            expect(callArgs.usage & GPUBufferUsage.COPY_DST).toBeTruthy();
            expect(callArgs.usage & GPUBufferUsage.VERTEX).toBeTruthy();
        });
    });
});
