import type { IPooledStorageBuffer } from "./interface/IStorageBufferConfig";
import { execute as bufferManagerCreateRectVerticesService } from "./BufferManager/service/BufferManagerCreateRectVerticesService";
import { execute as bufferManagerAcquireVertexBufferUseCase } from "./BufferManager/usecase/BufferManagerAcquireVertexBufferUseCase";
import { execute as bufferManagerAcquireUniformBufferUseCase } from "./BufferManager/usecase/BufferManagerAcquireUniformBufferUseCase";
import { execute as bufferManagerReleaseVertexBufferService } from "./BufferManager/service/BufferManagerReleaseVertexBufferService";
import { execute as bufferManagerReleaseUniformBufferService } from "./BufferManager/service/BufferManagerReleaseUniformBufferService";
import { execute as bufferManagerAcquireStorageBufferUseCase } from "./BufferManager/usecase/BufferManagerAcquireStorageBufferUseCase";
import { execute as releaseStorageBufferUseCase } from "./BufferManager/usecase/BufferManagerReleaseStorageBufferUseCase";
import { execute as cleanupStorageBuffersUseCase } from "./BufferManager/usecase/BufferManagerCleanupStorageBuffersUseCase";
import { execute as bufferManagerCreateIndirectBufferService } from "./BufferManager/service/BufferManagerCreateIndirectBufferService";
import { execute as updateIndirectBuffer } from "./BufferManager/service/BufferManagerUpdateIndirectBufferService";

export class BufferManager
{
    private device: GPUDevice;
    private vertexBuffers: Map<string, GPUBuffer>;
    private uniformBuffers: Map<string, GPUBuffer>;
    private vertexBufferBuckets: Map<number, GPUBuffer[]>;
    private uniformBufferBuckets: Map<number, GPUBuffer[]>;
    private storageBufferPool: IPooledStorageBuffer[];
    private indirectBuffer: GPUBuffer | null;
    private frameNumber: number;
    private unitRectBuffer: GPUBuffer | null;

    constructor (device: GPUDevice)
    {
        this.device = device;
        this.vertexBuffers = new Map();
        this.uniformBuffers = new Map();
        this.vertexBufferBuckets = new Map();
        this.uniformBufferBuckets = new Map();
        this.storageBufferPool = [];
        this.indirectBuffer = null;
        this.frameNumber = 0;
        this.unitRectBuffer = null;
    }

    createVertexBuffer (name: string, data: Float32Array): GPUBuffer
    {
        const buffer = this.device.createBuffer({
            "size": data.byteLength,
            "usage": GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            "mappedAtCreation": true
        });

        new Float32Array(buffer.getMappedRange()).set(data);
        buffer.unmap();

        this.vertexBuffers.set(name, buffer);
        return buffer;
    }

    createUniformBuffer (name: string, size: number): GPUBuffer
    {
        const buffer = this.device.createBuffer({
            "size": size,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        this.uniformBuffers.set(name, buffer);
        return buffer;
    }

    updateUniformBuffer (name: string, data: Float32Array): void
    {
        const buffer = this.uniformBuffers.get(name);
        if (buffer) {
            this.device.queue.writeBuffer(buffer, 0, data.buffer, data.byteOffset, data.byteLength);
        }
    }

    getVertexBuffer (name: string): GPUBuffer | undefined
    {
        return this.vertexBuffers.get(name);
    }

    getUniformBuffer (name: string): GPUBuffer | undefined
    {
        return this.uniformBuffers.get(name);
    }

    createRectVertices (x: number, y: number, width: number, height: number): Float32Array
    {
        return bufferManagerCreateRectVerticesService(x, y, width, height);
    }

    acquireVertexBuffer (requiredSize: number, data?: Float32Array): GPUBuffer
    {
        return bufferManagerAcquireVertexBufferUseCase(
            this.device,
            this.vertexBufferBuckets,
            requiredSize,
            data
        );
    }

    releaseVertexBuffer (buffer: GPUBuffer): void
    {
        bufferManagerReleaseVertexBufferService(this.vertexBufferBuckets, buffer);
    }

    acquireUniformBuffer (requiredSize: number): GPUBuffer
    {
        return bufferManagerAcquireUniformBufferUseCase(
            this.device,
            this.uniformBufferBuckets,
            requiredSize
        );
    }

    releaseUniformBuffer (buffer: GPUBuffer): void
    {
        bufferManagerReleaseUniformBufferService(this.uniformBufferBuckets, buffer);
    }

    destroyBuffer (name: string): void
    {
        const vertexBuffer = this.vertexBuffers.get(name);
        if (vertexBuffer) {
            vertexBuffer.destroy();
            this.vertexBuffers.delete(name);
        }

        const uniformBuffer = this.uniformBuffers.get(name);
        if (uniformBuffer) {
            uniformBuffer.destroy();
            this.uniformBuffers.delete(name);
        }
    }

    dispose (): void
    {
        for (const buffer of this.vertexBuffers.values()) {
            buffer.destroy();
        }
        this.vertexBuffers.clear();

        for (const buffer of this.uniformBuffers.values()) {
            buffer.destroy();
        }
        this.uniformBuffers.clear();

        for (const bucket of this.vertexBufferBuckets.values()) {
            for (const buffer of bucket) {
                buffer.destroy();
            }
        }
        this.vertexBufferBuckets.clear();

        for (const bucket of this.uniformBufferBuckets.values()) {
            for (const buffer of bucket) {
                buffer.destroy();
            }
        }
        this.uniformBufferBuckets.clear();

        for (const entry of this.storageBufferPool) {
            entry.buffer.destroy();
        }
        this.storageBufferPool = [];

        if (this.indirectBuffer) {
            this.indirectBuffer.destroy();
            this.indirectBuffer = null;
        }

        if (this.unitRectBuffer) {
            this.unitRectBuffer.destroy();
            this.unitRectBuffer = null;
        }
    }

    getPoolStats (): { vertexPoolSize: number; uniformPoolSize: number }
    {
        let vertexCount = 0;
        for (const bucket of this.vertexBufferBuckets.values()) {
            vertexCount += bucket.length;
        }
        let uniformCount = 0;
        for (const bucket of this.uniformBufferBuckets.values()) {
            uniformCount += bucket.length;
        }
        return {
            "vertexPoolSize": vertexCount,
            "uniformPoolSize": uniformCount
        };
    }

    clearFrameBuffers (): void
    {
        for (const buffer of this.vertexBuffers.values()) {
            buffer.destroy();
        }
        this.vertexBuffers.clear();

        for (const buffer of this.uniformBuffers.values()) {
            buffer.destroy();
        }
        this.uniformBuffers.clear();

        this.releaseAllStorageBuffers();

        this.frameNumber++;

        if (this.frameNumber % 60 === 0) {
            cleanupStorageBuffersUseCase(this.storageBufferPool, this.frameNumber);
        }
    }

    releaseAllStorageBuffers (): void
    {
        for (const entry of this.storageBufferPool) {
            entry.inUse = false;
        }
    }

    acquireStorageBuffer (requiredSize: number): GPUBuffer
    {
        return bufferManagerAcquireStorageBufferUseCase(
            this.device,
            this.storageBufferPool,
            requiredSize,
            this.frameNumber
        );
    }

    releaseStorageBuffer (buffer: GPUBuffer): void
    {
        releaseStorageBufferUseCase(this.storageBufferPool, buffer);
    }

    writeStorageBuffer (buffer: GPUBuffer, data: Float32Array | Uint32Array): void
    {
        this.device.queue.writeBuffer(buffer, 0, data.buffer, data.byteOffset, data.byteLength);
    }

    getOrCreateIndirectBuffer (
        vertexCount: number,
        instanceCount: number,
        firstVertex: number = 0,
        firstInstance: number = 0
    ): GPUBuffer {
        if (!this.indirectBuffer) {
            this.indirectBuffer = bufferManagerCreateIndirectBufferService(
                this.device,
                vertexCount,
                instanceCount,
                firstVertex,
                firstInstance
            );
        } else {
            updateIndirectBuffer(
                this.device,
                this.indirectBuffer,
                vertexCount,
                instanceCount,
                firstVertex,
                firstInstance
            );
        }
        return this.indirectBuffer;
    }

    createIndirectBuffer (
        vertexCount: number,
        instanceCount: number,
        firstVertex: number = 0,
        firstInstance: number = 0
    ): GPUBuffer {
        return bufferManagerCreateIndirectBufferService(
            this.device,
            vertexCount,
            instanceCount,
            firstVertex,
            firstInstance
        );
    }

    getUnitRectBuffer (): GPUBuffer
    {
        if (!this.unitRectBuffer) {
            const vertices = this.createRectVertices(0, 0, 1, 1);
            this.unitRectBuffer = this.device.createBuffer({
                "size": vertices.byteLength,
                "usage": GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
                "mappedAtCreation": true
            });
            new Float32Array(this.unitRectBuffer.getMappedRange()).set(vertices);
            this.unitRectBuffer.unmap();
        }
        return this.unitRectBuffer;
    }

    getFrameNumber (): number
    {
        return this.frameNumber;
    }

    getStoragePoolStats (): { storagePoolSize: number; storagePoolInUse: number }
    {
        const inUse = this.storageBufferPool.filter((e) => e.inUse).length;
        return {
            "storagePoolSize": this.storageBufferPool.length,
            "storagePoolInUse": inUse
        };
    }
}
