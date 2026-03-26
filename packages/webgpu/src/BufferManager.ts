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
 * @description 動的Uniformバッファアロケータ。1フレーム内の全uniformデータを1本の大バッファにサブアロケートし、BindGroup作成を1回に削減
 *              Dynamic Uniform Buffer Allocator. Sub-allocates all uniform data within a frame into a single large buffer, reducing BindGroup creation to once
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

    /**
     * @description コンストラクタ。GPUデバイスとバッファ容量を設定
     *              Constructor. Sets up GPU device and buffer capacity
     * @param {GPUDevice} device - WebGPUデバイス
     * @param {number} capacity - 初期バッファ容量（バイト単位、デフォルト: 65536）
     */
    constructor (device: GPUDevice, capacity: number = 65536)
    {
        this.device = device;
        this.capacity = capacity;
        this.stagingBuffer = new ArrayBuffer(capacity);
        this.stagingFloat32 = new Float32Array(this.stagingBuffer);
    }

    /**
     * @description フレーム開始時にオフセットをリセットし、前フレームの旧バッファを安全に破棄
     *              Reset offset at frame start and safely destroy old buffers from previous frame
     * @return {void}
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
     *              Get buffer with lazy initialization
     * @return {GPUBuffer} GPUバッファ
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
     * @description uniformデータをCPUステージングバッファにコピーし、アライメント済みオフセットを返す。実際のGPU書き込みはflush()で一括実行
     *              Copy uniform data to CPU staging buffer and return aligned offset. Actual GPU write is batched in flush()
     * @param {Float32Array} data - 書き込むデータ
     * @return {number} アライメント済みオフセット（バイト単位）
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
     * @description ステージングバッファの内容をGPUバッファに一括書き込み。submit前に1回だけ呼び出す
     *              Flush staging buffer content to GPU buffer in bulk. Call once before submit
     * @return {void}
     */
    flush (): void
    {
        if (this.dirtyEnd > 0 && this.buffer) {
            this.device.queue.writeBuffer(this.buffer, 0, this.stagingBuffer, 0, this.dirtyEnd);
            this.dirtyEnd = 0;
        }
    }

    /**
     * @description バッファを破棄してリソースを解放
     *              Dispose buffers and release resources
     * @return {void}
     */
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

/**
 * @description GPUバッファの管理クラス。頂点・ユニフォーム・ストレージ・インダイレクトバッファのプール管理と再利用を提供
 *              GPU buffer management class. Provides pooling and reuse for vertex, uniform, storage, and indirect buffers
 */
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

    /**
     * @description コンストラクタ。GPUデバイスを設定し、各種バッファプールを初期化
     *              Constructor. Sets up GPU device and initializes buffer pools
     * @param {GPUDevice} device - WebGPUデバイス
     */
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

    /**
     * @description 名前付き頂点バッファを作成し、初期データを書き込む
     *              Create a named vertex buffer and write initial data
     * @param {string} name - バッファ名
     * @param {Float32Array} data - 頂点データ
     * @return {GPUBuffer} 作成された頂点バッファ
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
     * @description 名前付きユニフォームバッファを作成
     *              Create a named uniform buffer
     * @param {string} name - バッファ名
     * @param {number} size - バッファサイズ（バイト単位）
     * @return {GPUBuffer} 作成されたユニフォームバッファ
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
     * @description 名前付きユニフォームバッファのデータを更新
     *              Update data of a named uniform buffer
     * @param {string} name - バッファ名
     * @param {Float32Array} data - 書き込むデータ
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
     * @description 名前で頂点バッファを取得
     *              Get vertex buffer by name
     * @param {string} name - バッファ名
     * @return {GPUBuffer | undefined} 頂点バッファ、存在しない場合はundefined
     */
    getVertexBuffer (name: string): GPUBuffer | undefined
    {
        return this.vertexBuffers.get(name);
    }

    /**
     * @description 名前でユニフォームバッファを取得
     *              Get uniform buffer by name
     * @param {string} name - バッファ名
     * @return {GPUBuffer | undefined} ユニフォームバッファ、存在しない場合はundefined
     */
    getUniformBuffer (name: string): GPUBuffer | undefined
    {
        return this.uniformBuffers.get(name);
    }

    /**
     * @description 矩形の頂点データを作成
     *              Create rect vertices data
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {number} width - 幅
     * @param {number} height - 高さ
     * @return {Float32Array} 矩形の頂点データ
     */
    createRectVertices (x: number, y: number, width: number, height: number): Float32Array
    {
        return bufferManagerCreateRectVerticesService(x, y, width, height);
    }

    /**
     * @description プールから頂点バッファを取得（または新規作成）
     *              Acquire vertex buffer from pool or create new one
     * @param {number} required_size - 必要なバイトサイズ
     * @param {Float32Array} [data] - 初期データ
     * @return {GPUBuffer} 取得された頂点バッファ
     */
    acquireVertexBuffer (required_size: number, data?: Float32Array): GPUBuffer
    {
        const buffer = bufferManagerAcquireVertexBufferUseCase(
            this.device,
            this.vertexBufferBuckets,
            required_size,
            data
        );
        this.frameVertexPoolBuffers.push(buffer);
        return buffer;
    }

    /**
     * @description 頂点バッファをプールに返却
     *              Release vertex buffer back to pool
     * @param {GPUBuffer} buffer - 返却するバッファ
     * @return {void}
     */
    releaseVertexBuffer (buffer: GPUBuffer): void
    {
        bufferManagerReleaseVertexBufferService(this.vertexBufferBuckets, buffer);
    }

    /**
     * @description プールからユニフォームバッファを取得（または新規作成）
     *              Acquire uniform buffer from pool or create new one
     * @param {number} required_size - 必要なバイトサイズ
     * @return {GPUBuffer} 取得されたユニフォームバッファ
     */
    acquireUniformBuffer (required_size: number): GPUBuffer
    {
        const buffer = bufferManagerAcquireUniformBufferUseCase(
            this.device,
            this.uniformBufferBuckets,
            required_size
        );
        this.frameUniformPoolBuffers.push(buffer);
        return buffer;
    }

    /**
     * @description Uniform Bufferの取得と書き込みを一括で行うヘルパー
     *              Helper to acquire and write uniform buffer in one call, combining acquireUniformBuffer + writeBuffer
     * @param {Float32Array} data - 書き込むデータ
     * @param {number} [byte_length] - 書き込みバイト数（省略時はdata.byteLength）
     * @return {GPUBuffer} 取得されたユニフォームバッファ
     */
    acquireAndWriteUniformBuffer (data: Float32Array, byte_length?: number): GPUBuffer
    {
        const writeBytes = byte_length ?? data.byteLength;
        const buffer = this.acquireUniformBuffer(writeBytes);
        this.device.queue.writeBuffer(buffer, 0, data.buffer, data.byteOffset, writeBytes);
        return buffer;
    }

    /**
     * @description ユニフォームバッファをプールに返却
     *              Release uniform buffer back to pool
     * @param {GPUBuffer} buffer - 返却するバッファ
     * @return {void}
     */
    releaseUniformBuffer (buffer: GPUBuffer): void
    {
        bufferManagerReleaseUniformBufferService(this.uniformBufferBuckets, buffer);
    }

    /**
     * @description 名前指定でバッファを破棄（頂点・ユニフォーム両方）
     *              Destroy buffer by name (both vertex and uniform)
     * @param {string} name - バッファ名
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
     * @description 全バッファを破棄してリソースを解放
     *              Dispose all buffers and release resources
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

    /**
     * @description フレーム内で使用したバッファをクリアし、プールに返却
     *              Clear frame buffers and return them to pool
     * @return {void}
     */
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

    /**
     * @description 全てのStorage Bufferを未使用状態に戻す
     *              Mark all storage buffers as not in use
     * @return {void}
     */
    releaseAllStorageBuffers (): void
    {
        for (const entry of this.storageBufferPool) {
            entry.inUse = false;
        }
    }

    /**
     * @description プールからStorage Bufferを取得（または新規作成）
     *              Acquire storage buffer from pool or create new one
     * @param {number} required_size - 必要なバイトサイズ
     * @return {GPUBuffer} 取得されたStorage Buffer
     */
    acquireStorageBuffer (required_size: number): GPUBuffer
    {
        return bufferManagerAcquireStorageBufferUseCase(
            this.device,
            this.storageBufferPool,
            required_size,
            this.frameNumber
        );
    }

    /**
     * @description Storage Bufferをプールに返却
     *              Release storage buffer back to pool
     * @param {GPUBuffer} buffer - 返却するバッファ
     * @return {void}
     */
    releaseStorageBuffer (buffer: GPUBuffer): void
    {
        releaseStorageBufferUseCase(this.storageBufferPool, buffer);
    }

    /**
     * @description Storage Bufferにデータを書き込む
     *              Write data to storage buffer
     * @param {GPUBuffer} buffer - 書き込み先バッファ
     * @param {Float32Array | Uint32Array} data - 書き込むデータ
     * @return {void}
     */
    writeStorageBuffer (buffer: GPUBuffer, data: Float32Array | Uint32Array): void
    {
        this.device.queue.writeBuffer(buffer, 0, data.buffer, data.byteOffset, data.byteLength);
    }

    /**
     * @description Indirect Bufferを取得または作成（シングルトン）
     *              Get or create indirect buffer (singleton)
     * @param {number} vertex_count - 頂点数
     * @param {number} instance_count - インスタンス数
     * @param {number} first_vertex - 開始頂点インデックス
     * @param {number} first_instance - 開始インスタンスインデックス
     * @return {GPUBuffer} Indirect Buffer
     */
    getOrCreateIndirectBuffer (
        vertex_count: number,
        instance_count: number,
        first_vertex: number = 0,
        first_instance: number = 0
    ): GPUBuffer {
        if (!this.indirectBuffer) {
            this.indirectBuffer = bufferManagerCreateIndirectBufferService(
                this.device,
                vertex_count,
                instance_count,
                first_vertex,
                first_instance
            );
        } else {
            updateIndirectBuffer(
                this.device,
                this.indirectBuffer,
                vertex_count,
                instance_count,
                first_vertex,
                first_instance
            );
        }
        return this.indirectBuffer;
    }

    /**
     * @description 新しいIndirect Bufferを作成（プールから再利用または新規作成）
     *              Create new indirect buffer (reuse from pool or create new)
     * @param {number} vertex_count - 頂点数
     * @param {number} instance_count - インスタンス数
     * @param {number} first_vertex - 開始頂点インデックス
     * @param {number} first_instance - 開始インスタンスインデックス
     * @return {GPUBuffer} 作成されたIndirect Buffer
     */
    createIndirectBuffer (
        vertex_count: number,
        instance_count: number,
        first_vertex: number = 0,
        first_instance: number = 0
    ): GPUBuffer {
        let buffer = this.indirectBufferPool.pop();
        if (buffer) {
            updateIndirectBuffer(
                this.device,
                buffer,
                vertex_count,
                instance_count,
                first_vertex,
                first_instance
            );
        } else {
            buffer = bufferManagerCreateIndirectBufferService(
                this.device,
                vertex_count,
                instance_count,
                first_vertex,
                first_instance
            );
        }
        this.frameIndirectBuffers.push(buffer);
        return buffer;
    }

    /**
     * @description 単位矩形（0,0,1,1）の頂点バッファを取得（遅延生成）
     *              Get unit rect (0,0,1,1) vertex buffer with lazy creation
     * @return {GPUBuffer} 単位矩形の頂点バッファ
     */
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

    /**
     * @description 現在のフレーム番号を取得
     *              Get current frame number
     * @return {number} フレーム番号
     */
    getFrameNumber (): number
    {
        return this.frameNumber;
    }

}
