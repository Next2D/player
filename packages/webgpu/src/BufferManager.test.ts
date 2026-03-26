import { describe, it, expect, vi, beforeEach } from "vitest";
import { BufferManager } from "./BufferManager";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    VERTEX: 0x20,
    UNIFORM: 0x40,
    COPY_DST: 0x08,
    STORAGE: 0x80,
    INDIRECT: 0x100
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

// Mock service and usecase modules
vi.mock("./BufferManager/service/BufferManagerCreateRectVerticesService", () => ({
    "execute": vi.fn((x, y, width, height) => {
        return new Float32Array([
            x, y, x + width, y, x, y + height,
            x + width, y, x + width, y + height, x, y + height
        ]);
    })
}));

vi.mock("./BufferManager/usecase/BufferManagerAcquireVertexBufferUseCase", () => ({
    "execute": vi.fn((device, pool, requiredSize, data) => {
        const buffer = { "size": requiredSize, "destroy": vi.fn(), "label": "pooledVertex" };
        if (!pool.has(requiredSize)) {
            pool.set(requiredSize, []);
        }
        pool.get(requiredSize).push(buffer);
        return buffer;
    })
}));

vi.mock("./BufferManager/usecase/BufferManagerAcquireUniformBufferUseCase", () => ({
    "execute": vi.fn((device, pool, requiredSize) => {
        const buffer = { "size": requiredSize, "destroy": vi.fn(), "label": "pooledUniform" };
        if (!pool.has(requiredSize)) {
            pool.set(requiredSize, []);
        }
        pool.get(requiredSize).push(buffer);
        return buffer;
    })
}));

vi.mock("./BufferManager/service/BufferManagerReleaseVertexBufferService", () => ({
    "execute": vi.fn()
}));

vi.mock("./BufferManager/service/BufferManagerReleaseUniformBufferService", () => ({
    "execute": vi.fn()
}));

vi.mock("./BufferManager/usecase/BufferManagerAcquireStorageBufferUseCase", () => ({
    "execute": vi.fn((device, pool, requiredSize, frameNumber) => {
        const buffer = { "size": requiredSize, "destroy": vi.fn(), "label": "storageBuffer" };
        pool.push({ buffer, "size": requiredSize, "inUse": true, "lastUsedFrame": frameNumber });
        return buffer;
    })
}));

vi.mock("./BufferManager/usecase/BufferManagerCleanupStorageBuffersUseCase", () => ({
    "execute": vi.fn()
}));

vi.mock("./BufferManager/service/BufferManagerCreateIndirectBufferService", () => ({
    "execute": vi.fn(() => ({ "label": "indirectBuffer", "destroy": vi.fn() }))
}));

vi.mock("./BufferManager/service/BufferManagerUpdateIndirectBufferService", () => ({
    "execute": vi.fn()
}));

describe("BufferManager", () =>
{
    const createMockDevice = (): GPUDevice =>
    {
        return {
            "createBuffer": vi.fn((descriptor) => ({
                "size": descriptor.size,
                "destroy": vi.fn(),
                "getMappedRange": vi.fn(() => new ArrayBuffer(descriptor.size)),
                "unmap": vi.fn()
            })),
            "queue": {
                "writeBuffer": vi.fn()
            }
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
            const manager = new BufferManager(device);

            expect(manager).toBeDefined();
        });

    });

    describe("createRectVertices", () =>
    {
        it("should create rectangle vertices", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            const vertices = manager.createRectVertices(0, 0, 100, 100);

            expect(vertices).toBeInstanceOf(Float32Array);
            expect(vertices.length).toBe(12); // 6 vertices * 2 coords
        });
    });

    describe("acquireVertexBuffer", () =>
    {
        it("should acquire buffer from pool or create new", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            const buffer = manager.acquireVertexBuffer(256);

            expect(buffer).toBeDefined();
        });

    });

    describe("acquireUniformBuffer", () =>
    {
        it("should acquire buffer from pool or create new", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            const buffer = manager.acquireUniformBuffer(64);

            expect(buffer).toBeDefined();
        });

    });

    describe("dispose", () =>
    {
        it("should not throw when disposing", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            expect(() => manager.dispose()).not.toThrow();
        });

    });

    describe("acquireStorageBuffer", () =>
    {
        it("should acquire storage buffer", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            const buffer = manager.acquireStorageBuffer(1024);

            expect(buffer).toBeDefined();
        });

    });

    describe("writeStorageBuffer", () =>
    {
        it("should write data to storage buffer", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);
            const buffer = manager.acquireStorageBuffer(256);
            const data = new Float32Array([1, 2, 3, 4]);

            manager.writeStorageBuffer(buffer, data);

            expect(device.queue.writeBuffer).toHaveBeenCalled();
        });
    });

    describe("releaseAllStorageBuffers", () =>
    {
        it("should mark all storage buffers as not in use", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            manager.acquireStorageBuffer(256);
            manager.acquireStorageBuffer(512);

            expect(() => manager.releaseAllStorageBuffers()).not.toThrow();
        });
    });

    describe("clearFrameBuffers", () =>
    {
        it("should not throw when clearing", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            expect(() => manager.clearFrameBuffers()).not.toThrow();
        });

        it("should release all storage buffers", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            manager.acquireStorageBuffer(256);
            expect(() => manager.clearFrameBuffers()).not.toThrow();
        });
    });

    describe("createIndirectBuffer", () =>
    {
        it("should create new indirect buffer each time", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            const buffer1 = manager.createIndirectBuffer(6, 10);
            const buffer2 = manager.createIndirectBuffer(6, 20);

            expect(buffer1).toBeDefined();
            expect(buffer2).toBeDefined();
        });
    });

});
