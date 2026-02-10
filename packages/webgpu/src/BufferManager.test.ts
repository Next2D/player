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

vi.mock("./BufferManager/usecase/BufferManagerReleaseStorageBufferUseCase", () => ({
    "execute": vi.fn((pool, buffer) => {
        const entry = pool.find((e: any) => e.buffer === buffer);
        if (entry) entry.inUse = false;
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

        it("should initialize with zero frame number", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            expect(manager.getFrameNumber()).toBe(0);
        });

        it("should initialize with empty pool stats", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            const stats = manager.getPoolStats();
            expect(stats.vertexPoolSize).toBe(0);
            expect(stats.uniformPoolSize).toBe(0);
        });
    });

    describe("createVertexBuffer", () =>
    {
        it("should create vertex buffer with data", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);
            const data = new Float32Array([1, 2, 3, 4]);

            const buffer = manager.createVertexBuffer("test", data);

            expect(buffer).toBeDefined();
            expect(device.createBuffer).toHaveBeenCalled();
        });

        it("should store buffer by name", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);
            const data = new Float32Array([1, 2, 3]);

            manager.createVertexBuffer("myBuffer", data);
            const retrieved = manager.getVertexBuffer("myBuffer");

            expect(retrieved).toBeDefined();
        });
    });

    describe("createUniformBuffer", () =>
    {
        it("should create uniform buffer with specified size", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            const buffer = manager.createUniformBuffer("uniforms", 64);

            expect(buffer).toBeDefined();
            expect(device.createBuffer).toHaveBeenCalled();
        });

        it("should store buffer by name", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            manager.createUniformBuffer("myUniforms", 128);
            const retrieved = manager.getUniformBuffer("myUniforms");

            expect(retrieved).toBeDefined();
        });
    });

    describe("updateUniformBuffer", () =>
    {
        it("should write data to existing buffer", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);
            const data = new Float32Array([1, 2, 3, 4]);

            manager.createUniformBuffer("uniforms", 64);
            manager.updateUniformBuffer("uniforms", data);

            expect(device.queue.writeBuffer).toHaveBeenCalled();
        });

        it("should not throw when buffer does not exist", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);
            const data = new Float32Array([1, 2, 3, 4]);

            expect(() => manager.updateUniformBuffer("nonexistent", data)).not.toThrow();
        });
    });

    describe("getVertexBuffer", () =>
    {
        it("should return undefined for non-existent buffer", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            expect(manager.getVertexBuffer("nonexistent")).toBeUndefined();
        });
    });

    describe("getUniformBuffer", () =>
    {
        it("should return undefined for non-existent buffer", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            expect(manager.getUniformBuffer("nonexistent")).toBeUndefined();
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

        it("should update pool stats", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            manager.acquireVertexBuffer(256);

            const stats = manager.getPoolStats();
            expect(stats.vertexPoolSize).toBe(1);
        });
    });

    describe("releaseVertexBuffer", () =>
    {
        it("should release buffer back to pool", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);
            const buffer = manager.acquireVertexBuffer(256);

            expect(() => manager.releaseVertexBuffer(buffer)).not.toThrow();
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

        it("should update pool stats", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            manager.acquireUniformBuffer(64);

            const stats = manager.getPoolStats();
            expect(stats.uniformPoolSize).toBe(1);
        });
    });

    describe("releaseUniformBuffer", () =>
    {
        it("should release buffer back to pool", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);
            const buffer = manager.acquireUniformBuffer(64);

            expect(() => manager.releaseUniformBuffer(buffer)).not.toThrow();
        });
    });

    describe("destroyBuffer", () =>
    {
        it("should destroy vertex buffer by name", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            manager.createVertexBuffer("test", new Float32Array([1, 2, 3]));
            manager.destroyBuffer("test");

            expect(manager.getVertexBuffer("test")).toBeUndefined();
        });

        it("should destroy uniform buffer by name", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            manager.createUniformBuffer("test", 64);
            manager.destroyBuffer("test");

            expect(manager.getUniformBuffer("test")).toBeUndefined();
        });
    });

    describe("dispose", () =>
    {
        it("should clear all buffers", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            manager.createVertexBuffer("v1", new Float32Array([1, 2, 3]));
            manager.createUniformBuffer("u1", 64);

            manager.dispose();

            expect(manager.getVertexBuffer("v1")).toBeUndefined();
            expect(manager.getUniformBuffer("u1")).toBeUndefined();
        });

        it("should reset pool stats", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            manager.acquireVertexBuffer(256);
            manager.acquireUniformBuffer(64);

            manager.dispose();

            const stats = manager.getPoolStats();
            expect(stats.vertexPoolSize).toBe(0);
            expect(stats.uniformPoolSize).toBe(0);
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

        it("should update storage pool stats", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            manager.acquireStorageBuffer(1024);

            const stats = manager.getStoragePoolStats();
            expect(stats.storagePoolSize).toBe(1);
            expect(stats.storagePoolInUse).toBe(1);
        });
    });

    describe("releaseStorageBuffer", () =>
    {
        it("should release storage buffer", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);
            const buffer = manager.acquireStorageBuffer(1024);

            expect(() => manager.releaseStorageBuffer(buffer)).not.toThrow();
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

            manager.releaseAllStorageBuffers();

            const stats = manager.getStoragePoolStats();
            expect(stats.storagePoolInUse).toBe(0);
        });
    });

    describe("clearFrameBuffers", () =>
    {
        it("should clear named buffers", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            manager.createVertexBuffer("frame", new Float32Array([1, 2, 3]));
            manager.clearFrameBuffers();

            expect(manager.getVertexBuffer("frame")).toBeUndefined();
        });

        it("should increment frame number", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            const beforeFrame = manager.getFrameNumber();
            manager.clearFrameBuffers();

            expect(manager.getFrameNumber()).toBe(beforeFrame + 1);
        });

        it("should release all storage buffers", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            manager.acquireStorageBuffer(256);
            manager.clearFrameBuffers();

            const stats = manager.getStoragePoolStats();
            expect(stats.storagePoolInUse).toBe(0);
        });
    });

    describe("getOrCreateIndirectBuffer", () =>
    {
        it("should create indirect buffer on first call", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            const buffer = manager.getOrCreateIndirectBuffer(6, 10);

            expect(buffer).toBeDefined();
        });

        it("should return same buffer on subsequent calls", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            const buffer1 = manager.getOrCreateIndirectBuffer(6, 10);
            const buffer2 = manager.getOrCreateIndirectBuffer(6, 20);

            expect(buffer1).toBe(buffer2);
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

    describe("getFrameNumber", () =>
    {
        it("should track frame count", () =>
        {
            const device = createMockDevice();
            const manager = new BufferManager(device);

            manager.clearFrameBuffers();
            manager.clearFrameBuffers();
            manager.clearFrameBuffers();

            expect(manager.getFrameNumber()).toBe(3);
        });
    });
});
