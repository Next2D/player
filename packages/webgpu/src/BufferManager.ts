import type { IPooledBuffer } from "./interface/IPooledBuffer";
import { execute as bufferManagerCreateRectVerticesService } from "./BufferManager/service/BufferManagerCreateRectVerticesService";
import { execute as bufferManagerAcquireVertexBufferUseCase } from "./BufferManager/usecase/BufferManagerAcquireVertexBufferUseCase";
import { execute as bufferManagerAcquireUniformBufferUseCase } from "./BufferManager/usecase/BufferManagerAcquireUniformBufferUseCase";
import { execute as bufferManagerReleaseVertexBufferService } from "./BufferManager/service/BufferManagerReleaseVertexBufferService";
import { execute as bufferManagerReleaseUniformBufferService } from "./BufferManager/service/BufferManagerReleaseUniformBufferService";

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
            size: data.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
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
            size: size,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
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
    }

    /**
     * @description プールの統計情報を取得
     * @return {{ vertexPoolSize: number, uniformPoolSize: number }}
     */
    getPoolStats (): { vertexPoolSize: number; uniformPoolSize: number }
    {
        return {
            vertexPoolSize: this.vertexBufferPool.length,
            uniformPoolSize: this.uniformBufferPool.length
        };
    }
}
