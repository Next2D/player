import type { IPooledBuffer } from "./interface/IPooledBuffer";

/**
 * @description WebGPUバッファマネージャー
 *              WebGPU buffer manager with buffer pooling support
 */
export class BufferManager
{
    private device: GPUDevice;
    private vertexBuffers: Map<string, GPUBuffer>;
    private uniformBuffers: Map<string, GPUBuffer>;

    /**
     * @description 頂点バッファプール（サイズごとにグループ化）
     *              Vertex buffer pool (grouped by size)
     */
    private vertexBufferPool: IPooledBuffer[];

    /**
     * @description ユニフォームバッファプール（サイズごとにグループ化）
     *              Uniform buffer pool (grouped by size)
     */
    private uniformBufferPool: IPooledBuffer[];

    /**
     * @description プールの最大サイズ
     *              Maximum pool size
     */
    private static readonly MAX_POOL_SIZE: number = 32;

    /**
     * @param {GPUDevice} device
     * @constructor
     */
    constructor(device: GPUDevice)
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
    createVertexBuffer(name: string, data: Float32Array): GPUBuffer
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
    createUniformBuffer(name: string, size: number): GPUBuffer
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
    updateUniformBuffer(name: string, data: Float32Array): void
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
    getVertexBuffer(name: string): GPUBuffer | undefined
    {
        return this.vertexBuffers.get(name);
    }

    /**
     * @description Uniformバッファを取得
     * @param {string} name
     * @return {GPUBuffer | undefined}
     */
    getUniformBuffer(name: string): GPUBuffer | undefined
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
    createRectVertices(x: number, y: number, width: number, height: number): Float32Array
    {
        return new Float32Array([
            // Position (x, y), TexCoord (u, v)
            x, y, 0.0, 0.0,
            x + width, y, 1.0, 0.0,
            x, y + height, 0.0, 1.0,
            
            x + width, y, 1.0, 0.0,
            x + width, y + height, 1.0, 1.0,
            x, y + height, 0.0, 1.0
        ]);
    }

    /**
     * @description プールから頂点バッファを取得（または新規作成）
     *              Acquire vertex buffer from pool (or create new)
     * @param {number} requiredSize - 必要なバイトサイズ
     * @param {Float32Array} data - 初期データ
     * @return {GPUBuffer}
     */
    acquireVertexBuffer(requiredSize: number, data?: Float32Array): GPUBuffer
    {
        // プールから適切なサイズのバッファを検索（2倍以内のサイズで最小のもの）
        let bestIndex = -1;
        let bestSize = Infinity;

        for (let i = 0; i < this.vertexBufferPool.length; i++) {
            const entry = this.vertexBufferPool[i];
            if (entry.size >= requiredSize && entry.size <= requiredSize * 2) {
                if (entry.size < bestSize) {
                    bestSize = entry.size;
                    bestIndex = i;
                }
            }
        }

        let buffer: GPUBuffer;

        if (bestIndex >= 0) {
            // プールから取得
            const entry = this.vertexBufferPool.splice(bestIndex, 1)[0];
            buffer = entry.buffer;
        } else {
            // 新規作成（2のべき乗に切り上げ）
            const size = this.upperPowerOfTwo(requiredSize);
            buffer = this.device.createBuffer({
                size: size,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
            });
        }

        // データがあれば書き込み
        if (data) {
            this.device.queue.writeBuffer(buffer, 0, data.buffer, data.byteOffset, data.byteLength);
        }

        return buffer;
    }

    /**
     * @description 頂点バッファをプールに返却
     *              Release vertex buffer back to pool
     * @param {GPUBuffer} buffer
     * @return {void}
     */
    releaseVertexBuffer(buffer: GPUBuffer): void
    {
        if (this.vertexBufferPool.length >= BufferManager.MAX_POOL_SIZE) {
            // プールが満杯の場合、最も小さいバッファを破棄
            let smallestIndex = 0;
            let smallestSize = this.vertexBufferPool[0].size;

            for (let i = 1; i < this.vertexBufferPool.length; i++) {
                if (this.vertexBufferPool[i].size < smallestSize) {
                    smallestSize = this.vertexBufferPool[i].size;
                    smallestIndex = i;
                }
            }

            this.vertexBufferPool[smallestIndex].buffer.destroy();
            this.vertexBufferPool.splice(smallestIndex, 1);
        }

        this.vertexBufferPool.push({
            buffer,
            size: buffer.size
        });
    }

    /**
     * @description プールからユニフォームバッファを取得（または新規作成）
     *              Acquire uniform buffer from pool (or create new)
     * @param {number} requiredSize - 必要なバイトサイズ
     * @return {GPUBuffer}
     */
    acquireUniformBuffer(requiredSize: number): GPUBuffer
    {
        // 16バイトアライメント
        const alignedSize = Math.ceil(requiredSize / 16) * 16;

        // プールから適切なサイズのバッファを検索
        for (let i = 0; i < this.uniformBufferPool.length; i++) {
            const entry = this.uniformBufferPool[i];
            if (entry.size >= alignedSize && entry.size <= alignedSize * 2) {
                return this.uniformBufferPool.splice(i, 1)[0].buffer;
            }
        }

        // 新規作成
        return this.device.createBuffer({
            size: alignedSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }

    /**
     * @description ユニフォームバッファをプールに返却
     *              Release uniform buffer back to pool
     * @param {GPUBuffer} buffer
     * @return {void}
     */
    releaseUniformBuffer(buffer: GPUBuffer): void
    {
        if (this.uniformBufferPool.length >= BufferManager.MAX_POOL_SIZE) {
            // プールが満杯の場合、最も小さいバッファを破棄
            let smallestIndex = 0;
            let smallestSize = this.uniformBufferPool[0].size;

            for (let i = 1; i < this.uniformBufferPool.length; i++) {
                if (this.uniformBufferPool[i].size < smallestSize) {
                    smallestSize = this.uniformBufferPool[i].size;
                    smallestIndex = i;
                }
            }

            this.uniformBufferPool[smallestIndex].buffer.destroy();
            this.uniformBufferPool.splice(smallestIndex, 1);
        }

        this.uniformBufferPool.push({
            buffer,
            size: buffer.size
        });
    }

    /**
     * @description 2のべき乗に切り上げ
     *              Round up to the next power of two
     * @param {number} v
     * @return {number}
     * @private
     */
    private upperPowerOfTwo(v: number): number
    {
        v--;
        v |= v >> 1;
        v |= v >> 2;
        v |= v >> 4;
        v |= v >> 8;
        v |= v >> 16;
        return v + 1;
    }

    /**
     * @description バッファを解放
     * @param {string} name
     * @return {void}
     */
    destroyBuffer(name: string): void
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
    dispose(): void
    {
        for (const buffer of this.vertexBuffers.values()) {
            buffer.destroy();
        }
        this.vertexBuffers.clear();

        for (const buffer of this.uniformBuffers.values()) {
            buffer.destroy();
        }
        this.uniformBuffers.clear();

        // プールもクリア
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
     *              Get pool statistics
     * @return {{ vertexPoolSize: number, uniformPoolSize: number }}
     */
    getPoolStats(): { vertexPoolSize: number; uniformPoolSize: number }
    {
        return {
            vertexPoolSize: this.vertexBufferPool.length,
            uniformPoolSize: this.uniformBufferPool.length
        };
    }
}
