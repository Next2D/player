/**
 * @description プールされたバッファのエントリ
 *              Pooled buffer entry
 */
interface IPooledBuffer {
    buffer: GPUBuffer;
    size: number;
}

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
    }
}
