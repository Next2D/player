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

/**
 * @description Dynamic Uniform Buffer Allocator
 *              1フレーム内の全fill uniform データを1本の大バッファにサブアロケートし、
 *              BindGroup作成を1回に削減する。
 */
export class DynamicUniformAllocator
{
    private device: GPUDevice;
    private buffer: GPUBuffer | null = null;
    private offset: number = 0;
    private capacity: number;
    readonly alignment: number = 256;
    private pendingDestroyBuffers: GPUBuffer[] = [];
    private stagingBuffer: ArrayBuffer;
    private stagingFloat32: Float32Array;
    private dirtyEnd: number = 0;

    constructor (device: GPUDevice, capacity: number = 65536)
    {
        this.device = device;
        this.capacity = capacity;
        this.stagingBuffer = new ArrayBuffer(capacity);
        this.stagingFloat32 = new Float32Array(this.stagingBuffer);
    }

    /**
     * @description フレーム開始時にオフセットをリセット
     *              前フレームの旧バッファを安全に破棄（submit済みのため）
     */
    resetFrame (): void
    {
        this.offset = 0;
        this.dirtyEnd = 0;

        for (const buf of this.pendingDestroyBuffers) {
            buf.destroy();
        }
        this.pendingDestroyBuffers.length = 0;
    }

    /**
     * @description バッファを取得（遅延生成）
     */
    getBuffer (): GPUBuffer
    {
        if (!this.buffer) {
            this.buffer = this.device.createBuffer({
                "size": this.capacity,
                "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
        }
        return this.buffer;
    }

    /**
     * @description uniform データをCPUステージングバッファにコピーし、アライメント済みオフセットを返す
     *              実際のGPU書き込みはflush()で一括実行される
     * @param data - 書き込むデータ
     * @return アライメント済みオフセット（バイト単位）
     */
    allocate (data: Float32Array): number
    {
        // バッファの遅延生成
        if (!this.buffer) {
            this.getBuffer();
        }

        const alignedOffset = this.offset;
        const dataSize = data.byteLength;

        if (alignedOffset + dataSize > this.capacity) {
            // 旧バッファにステージングデータをフラッシュ
            this.flush();

            // バッファが足りない場合は容量を倍増して再作成
            this.capacity *= 2;
            const oldBuffer = this.buffer;
            this.buffer = this.device.createBuffer({
                "size": this.capacity,
                "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
            if (oldBuffer) {
                // 旧バッファは即座に破棄しない — コマンドエンコーダーに記録済みの
                // コマンドが旧バッファを参照している可能性があるため、
                // フレーム終了後のresetFrame()で安全に破棄する
                this.pendingDestroyBuffers.push(oldBuffer);
            }

            // ステージングバッファも拡張
            this.stagingBuffer = new ArrayBuffer(this.capacity);
            this.stagingFloat32 = new Float32Array(this.stagingBuffer);
        }

        // CPUステージングバッファにコピー（writeBuffer呼ばない）
        this.stagingFloat32.set(data, alignedOffset / 4);

        const end = alignedOffset + dataSize;
        if (end > this.dirtyEnd) {
            this.dirtyEnd = end;
        }

        // 次のアロケーションは256バイトアライメント
        this.offset = alignedOffset + Math.ceil(dataSize / this.alignment) * this.alignment;

        return alignedOffset;
    }

    /**
     * @description ステージングバッファの内容をGPUバッファに一括書き込み
     *              submit前に1回だけ呼び出す
     */
    flush (): void
    {
        if (this.dirtyEnd > 0 && this.buffer) {
            this.device.queue.writeBuffer(this.buffer, 0, this.stagingBuffer, 0, this.dirtyEnd);
            this.dirtyEnd = 0;
        }
    }

    dispose (): void
    {
        if (this.buffer) {
            this.buffer.destroy();
            this.buffer = null;
        }

        for (const buf of this.pendingDestroyBuffers) {
            buf.destroy();
        }
        this.pendingDestroyBuffers.length = 0;
    }
}

export class BufferManager
{
    private device: GPUDevice;
    private vertexBuffers: Map<string, GPUBuffer>;
    private uniformBuffers: Map<string, GPUBuffer>;
    private vertexBufferBuckets: Map<number, GPUBuffer[]>;
    private uniformBufferBuckets: Map<number, GPUBuffer[]>;
    private storageBufferPool: IPooledStorageBuffer[];
    private indirectBuffer: GPUBuffer | null;
    private indirectBufferPool: GPUBuffer[];
    private frameIndirectBuffers: GPUBuffer[];
    private frameNumber: number;
    private unitRectBuffer: GPUBuffer | null;
    private frameVertexPoolBuffers: GPUBuffer[];
    private frameUniformPoolBuffers: GPUBuffer[];
    readonly dynamicUniform: DynamicUniformAllocator;

    constructor (device: GPUDevice)
    {
        this.device = device;
        this.vertexBuffers = new Map();
        this.uniformBuffers = new Map();
        this.vertexBufferBuckets = new Map();
        this.uniformBufferBuckets = new Map();
        this.storageBufferPool = [];
        this.indirectBuffer = null;
        this.indirectBufferPool = [];
        this.frameIndirectBuffers = [];
        this.frameNumber = 0;
        this.unitRectBuffer = null;
        this.frameVertexPoolBuffers = [];
        this.frameUniformPoolBuffers = [];
        this.dynamicUniform = new DynamicUniformAllocator(device);
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
        const buffer = bufferManagerAcquireVertexBufferUseCase(
            this.device,
            this.vertexBufferBuckets,
            requiredSize,
            data
        );
        this.frameVertexPoolBuffers.push(buffer);
        return buffer;
    }

    releaseVertexBuffer (buffer: GPUBuffer): void
    {
        bufferManagerReleaseVertexBufferService(this.vertexBufferBuckets, buffer);
    }

    acquireUniformBuffer (requiredSize: number): GPUBuffer
    {
        const buffer = bufferManagerAcquireUniformBufferUseCase(
            this.device,
            this.uniformBufferBuckets,
            requiredSize
        );
        this.frameUniformPoolBuffers.push(buffer);
        return buffer;
    }

    /**
     * @description Uniform Bufferの取得と書き込みを一括で行うヘルパー
     *              acquireUniformBuffer + writeBuffer の2ステップを1呼び出しに統合
     * @param data - 書き込むデータ
     * @param byteLength - 書き込みバイト数（省略時はdata.byteLength）
     * @return GPUBuffer
     */
    acquireAndWriteUniformBuffer (data: Float32Array, byteLength?: number): GPUBuffer
    {
        const writeBytes = byteLength ?? data.byteLength;
        const buffer = this.acquireUniformBuffer(writeBytes);
        this.device.queue.writeBuffer(buffer, 0, data.buffer, data.byteOffset, writeBytes);
        return buffer;
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

        for (const buffer of this.indirectBufferPool) {
            buffer.destroy();
        }
        this.indirectBufferPool = [];

        for (const buffer of this.frameIndirectBuffers) {
            buffer.destroy();
        }
        this.frameIndirectBuffers = [];

        if (this.unitRectBuffer) {
            this.unitRectBuffer.destroy();
            this.unitRectBuffer = null;
        }

        this.frameVertexPoolBuffers.length = 0;
        this.frameUniformPoolBuffers.length = 0;

        this.dynamicUniform.dispose();
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

        // フレーム内で取得したプールバッファをプールに返却
        for (const buffer of this.frameVertexPoolBuffers) {
            bufferManagerReleaseVertexBufferService(this.vertexBufferBuckets, buffer);
        }
        this.frameVertexPoolBuffers.length = 0;

        for (const buffer of this.frameUniformPoolBuffers) {
            bufferManagerReleaseUniformBufferService(this.uniformBufferBuckets, buffer);
        }
        this.frameUniformPoolBuffers.length = 0;

        // フレーム内で使用したIndirect Bufferをプールに返却
        for (const buffer of this.frameIndirectBuffers) {
            this.indirectBufferPool.push(buffer);
        }
        this.frameIndirectBuffers.length = 0;

        this.releaseAllStorageBuffers();

        this.dynamicUniform.resetFrame();

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
        let buffer = this.indirectBufferPool.pop();
        if (buffer) {
            updateIndirectBuffer(
                this.device,
                buffer,
                vertexCount,
                instanceCount,
                firstVertex,
                firstInstance
            );
        } else {
            buffer = bufferManagerCreateIndirectBufferService(
                this.device,
                vertexCount,
                instanceCount,
                firstVertex,
                firstInstance
            );
        }
        this.frameIndirectBuffers.push(buffer);
        return buffer;
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

}
