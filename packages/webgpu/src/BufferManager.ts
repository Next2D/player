import type { IPooledBuffer } from "./interface/IPooledBuffer";
import type { IPooledStorageBuffer } from "./interface/IStorageBufferConfig";
import { execute as bufferManagerCreateRectVerticesService } from "./BufferManager/service/BufferManagerCreateRectVerticesService";
import { execute as bufferManagerAcquireVertexBufferUseCase } from "./BufferManager/usecase/BufferManagerAcquireVertexBufferUseCase";
import { execute as bufferManagerAcquireUniformBufferUseCase } from "./BufferManager/usecase/BufferManagerAcquireUniformBufferUseCase";
import { execute as bufferManagerReleaseVertexBufferService } from "./BufferManager/service/BufferManagerReleaseVertexBufferService";
import { execute as bufferManagerReleaseUniformBufferService } from "./BufferManager/service/BufferManagerReleaseUniformBufferService";
import {
    execute as bufferManagerAcquireStorageBufferUseCase,
    releaseStorageBuffer,
    cleanupStorageBuffers
} from "./BufferManager/usecase/BufferManagerAcquireStorageBufferUseCase";
import {
    execute as bufferManagerCreateIndirectBufferService,
    update as updateIndirectBuffer
} from "./BufferManager/service/BufferManagerCreateIndirectBufferService";

/**
 * @description WebGPUバッファマネージャー
 *              WebGPU buffer manager with buffer pooling support
 */
export class BufferManager
{
    private device: GPUDevice;
    private vertexBuffers: Map<string, GPUBuffer>;
    private uniformBuffers: Map<string, GPUBuffer>;
    private vertexBufferPool: IPooledBuffer[];
    private uniformBufferPool: IPooledBuffer[];
    private storageBufferPool: IPooledStorageBuffer[];
    private indirectBuffer: GPUBuffer | null;
    private frameNumber: number;

    /**
     * @param {GPUDevice} device
     * @constructor
     */
    constructor (device: GPUDevice)
    {
        this.device = device;
        this.vertexBuffers = new Map();
        this.uniformBuffers = new Map();
        this.vertexBufferPool = [];
        this.uniformBufferPool = [];
        this.storageBufferPool = [];
        this.indirectBuffer = null;
        this.frameNumber = 0;
    }

    /**
     * @description 頂点バッファを作成
     * @param {string} name
     * @param {Float32Array} data
     * @return {GPUBuffer}
     */
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

    /**
     * @description Uniformバッファを作成
     * @param {string} name
     * @param {number} size
     * @return {GPUBuffer}
     */
    createUniformBuffer (name: string, size: number): GPUBuffer
    {
        const buffer = this.device.createBuffer({
            "size": size,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        this.uniformBuffers.set(name, buffer);
        return buffer;
    }

    /**
     * @description Uniformバッファを更新
     * @param {string} name
     * @param {Float32Array} data
     * @return {void}
     */
    updateUniformBuffer (name: string, data: Float32Array): void
    {
        const buffer = this.uniformBuffers.get(name);
        if (buffer) {
            this.device.queue.writeBuffer(buffer, 0, data.buffer, data.byteOffset, data.byteLength);
        }
    }

    /**
     * @description 頂点バッファを取得
     * @param {string} name
     * @return {GPUBuffer | undefined}
     */
    getVertexBuffer (name: string): GPUBuffer | undefined
    {
        return this.vertexBuffers.get(name);
    }

    /**
     * @description Uniformバッファを取得
     * @param {string} name
     * @return {GPUBuffer | undefined}
     */
    getUniformBuffer (name: string): GPUBuffer | undefined
    {
        return this.uniformBuffers.get(name);
    }

    /**
     * @description 矩形の頂点データを作成
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {Float32Array}
     */
    createRectVertices (x: number, y: number, width: number, height: number): Float32Array
    {
        return bufferManagerCreateRectVerticesService(x, y, width, height);
    }

    /**
     * @description プールから頂点バッファを取得（または新規作成）
     * @param {number} requiredSize
     * @param {Float32Array} [data]
     * @return {GPUBuffer}
     */
    acquireVertexBuffer (requiredSize: number, data?: Float32Array): GPUBuffer
    {
        return bufferManagerAcquireVertexBufferUseCase(
            this.device,
            this.vertexBufferPool,
            requiredSize,
            data
        );
    }

    /**
     * @description 頂点バッファをプールに返却
     * @param {GPUBuffer} buffer
     * @return {void}
     */
    releaseVertexBuffer (buffer: GPUBuffer): void
    {
        bufferManagerReleaseVertexBufferService(this.vertexBufferPool, buffer);
    }

    /**
     * @description プールからユニフォームバッファを取得（または新規作成）
     * @param {number} requiredSize
     * @return {GPUBuffer}
     */
    acquireUniformBuffer (requiredSize: number): GPUBuffer
    {
        return bufferManagerAcquireUniformBufferUseCase(
            this.device,
            this.uniformBufferPool,
            requiredSize
        );
    }

    /**
     * @description ユニフォームバッファをプールに返却
     * @param {GPUBuffer} buffer
     * @return {void}
     */
    releaseUniformBuffer (buffer: GPUBuffer): void
    {
        bufferManagerReleaseUniformBufferService(this.uniformBufferPool, buffer);
    }

    /**
     * @description バッファを解放
     * @param {string} name
     * @return {void}
     */
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

    /**
     * @description すべてのバッファを解放
     * @return {void}
     */
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

        for (const entry of this.vertexBufferPool) {
            entry.buffer.destroy();
        }
        this.vertexBufferPool = [];

        for (const entry of this.uniformBufferPool) {
            entry.buffer.destroy();
        }
        this.uniformBufferPool = [];

        for (const entry of this.storageBufferPool) {
            entry.buffer.destroy();
        }
        this.storageBufferPool = [];

        if (this.indirectBuffer) {
            this.indirectBuffer.destroy();
            this.indirectBuffer = null;
        }
    }

    /**
     * @description プールの統計情報を取得
     * @return {{ vertexPoolSize: number, uniformPoolSize: number }}
     */
    getPoolStats (): { vertexPoolSize: number; uniformPoolSize: number }
    {
        return {
            "vertexPoolSize": this.vertexBufferPool.length,
            "uniformPoolSize": this.uniformBufferPool.length
        };
    }

    /**
     * @description フレームごとの一時バッファをクリア
     *              endFrame()で呼び出す
     * @return {void}
     */
    clearFrameBuffers (): void
    {
        // 一時バッファを解放
        for (const buffer of this.vertexBuffers.values()) {
            buffer.destroy();
        }
        this.vertexBuffers.clear();

        for (const buffer of this.uniformBuffers.values()) {
            buffer.destroy();
        }
        this.uniformBuffers.clear();

        // フレーム番号をインクリメント
        this.frameNumber++;

        // 60フレームごとに古いStorage Bufferをクリーンアップ
        if (this.frameNumber % 60 === 0) {
            cleanupStorageBuffers(this.storageBufferPool, this.frameNumber);
        }
    }

    /**
     * @description プールからStorage Bufferを取得（または新規作成）
     *              Acquire Storage Buffer from pool or create new one
     *
     * Storage Bufferは大きなインスタンスデータに最適。
     * 動的更新が効率的で、Compute Shaderでも使用可能。
     *
     * @param {number} requiredSize - 必要なサイズ（バイト）
     * @return {GPUBuffer}
     */
    acquireStorageBuffer (requiredSize: number): GPUBuffer
    {
        return bufferManagerAcquireStorageBufferUseCase(
            this.device,
            this.storageBufferPool,
            requiredSize,
            this.frameNumber
        );
    }

    /**
     * @description Storage Bufferをプールに返却
     * @param {GPUBuffer} buffer
     * @return {void}
     */
    releaseStorageBuffer (buffer: GPUBuffer): void
    {
        releaseStorageBuffer(this.storageBufferPool, buffer);
    }

    /**
     * @description Storage Bufferにデータを書き込む
     * @param {GPUBuffer} buffer
     * @param {Float32Array | Uint32Array} data
     * @return {void}
     */
    writeStorageBuffer (buffer: GPUBuffer, data: Float32Array | Uint32Array): void
    {
        this.device.queue.writeBuffer(buffer, 0, data.buffer, data.byteOffset, data.byteLength);
    }

    /**
     * @description Indirect Bufferを作成または取得
     *              Create or get Indirect Buffer for draw indirect commands
     *
     * @param {number} vertexCount - 頂点数
     * @param {number} instanceCount - インスタンス数
     * @param {number} [firstVertex=0] - 開始頂点インデックス
     * @param {number} [firstInstance=0] - 開始インスタンスインデックス
     * @return {GPUBuffer}
     */
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

    /**
     * @description 現在のフレーム番号を取得
     * @return {number}
     */
    getFrameNumber (): number
    {
        return this.frameNumber;
    }

    /**
     * @description Storage Bufferプールの統計情報を取得
     * @return {{ storagePoolSize: number, storagePoolInUse: number }}
     */
    getStoragePoolStats (): { storagePoolSize: number; storagePoolInUse: number }
    {
        const inUse = this.storageBufferPool.filter((e) => e.inUse).length;
        return {
            "storagePoolSize": this.storageBufferPool.length,
            "storagePoolInUse": inUse
        };
    }
}
