import { BufferManager } from "./BufferManager";
import { PipelineManager } from "./Shader/PipelineManager";

/**
 * @description WebGPU描画マネージャー
 *              WebGPU draw manager
 */
export class DrawManager
{
    private device: GPUDevice;
    private bufferManager: BufferManager;
    private pipelineManager: PipelineManager;
    private bindGroups: Map<string, GPUBindGroup>;

    /**
     * @param {GPUDevice} device
     * @param {BufferManager} buffer_manager
     * @param {PipelineManager} pipeline_manager
     * @constructor
     */
    constructor(
        device: GPUDevice,
        buffer_manager: BufferManager,
        pipeline_manager: PipelineManager
    ) {
        this.device = device;
        this.bufferManager = buffer_manager;
        this.pipelineManager = pipeline_manager;
        this.bindGroups = new Map();
    }

    /**
     * @description バインドグループを作成（基本）
     * @param {string} name
     * @param {GPUBuffer} uniform_buffer
     * @return {GPUBindGroup}
     */
    createBasicBindGroup(name: string, uniform_buffer: GPUBuffer): GPUBindGroup
    {
        const layout = this.pipelineManager.getBindGroupLayout("basic");
        if (!layout) {
            throw new Error("Basic bind group layout not found");
        }

        const bindGroup = this.device.createBindGroup({
            layout: layout,
            entries: [{
                binding: 0,
                resource: { buffer: uniform_buffer }
            }]
        });

        this.bindGroups.set(name, bindGroup);
        return bindGroup;
    }

    /**
     * @description バインドグループを作成（テクスチャ）
     * @param {string} name
     * @param {GPUBuffer} uniform_buffer
     * @param {GPUSampler} sampler
     * @param {GPUTextureView} texture_view
     * @return {GPUBindGroup}
     */
    createTextureBindGroup(
        name: string,
        uniform_buffer: GPUBuffer,
        sampler: GPUSampler,
        texture_view: GPUTextureView
    ): GPUBindGroup {
        const layout = this.pipelineManager.getBindGroupLayout("texture");
        if (!layout) {
            throw new Error("Texture bind group layout not found");
        }

        const bindGroup = this.device.createBindGroup({
            layout: layout,
            entries: [
                {
                    binding: 0,
                    resource: { buffer: uniform_buffer }
                },
                {
                    binding: 1,
                    resource: sampler
                },
                {
                    binding: 2,
                    resource: texture_view
                }
            ]
        });

        this.bindGroups.set(name, bindGroup);
        return bindGroup;
    }

    /**
     * @description 矩形を描画
     * @param {GPURenderPassEncoder} pass_encoder
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Float32Array} color
     * @param {Float32Array} matrix
     * @return {void}
     */
    drawRect(
        pass_encoder: GPURenderPassEncoder,
        x: number,
        y: number,
        width: number,
        height: number,
        color: Float32Array,
        matrix: Float32Array
    ): void {
        const vertices = this.bufferManager.createRectVertices(x, y, width, height);
        const vertexBuffer = this.bufferManager.createVertexBuffer(
            `rect_${Date.now()}`,
            vertices
        );

        const uniformData = new Float32Array([
            ...matrix,
            ...color,
            1.0 // alpha
        ]);

        const uniformBuffer = this.bufferManager.createUniformBuffer(
            `uniform_${Date.now()}`,
            uniformData.byteLength
        );
        this.bufferManager.updateUniformBuffer(
            `uniform_${Date.now()}`,
            uniformData
        );

        const bindGroup = this.createBasicBindGroup(
            `bind_${Date.now()}`,
            uniformBuffer
        );

        const pipeline = this.pipelineManager.getPipeline("basic");
        if (!pipeline) {
            throw new Error("Basic pipeline not found");
        }

        pass_encoder.setPipeline(pipeline);
        pass_encoder.setVertexBuffer(0, vertexBuffer);
        pass_encoder.setBindGroup(0, bindGroup);
        pass_encoder.draw(6, 1, 0, 0);
    }

    /**
     * @description テクスチャ付き矩形を描画
     * @param {GPURenderPassEncoder} pass_encoder
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {GPUTextureView} texture_view
     * @param {GPUSampler} sampler
     * @param {Float32Array} matrix
     * @return {void}
     */
    drawTexturedRect(
        pass_encoder: GPURenderPassEncoder,
        x: number,
        y: number,
        width: number,
        height: number,
        texture_view: GPUTextureView,
        sampler: GPUSampler,
        matrix: Float32Array
    ): void {
        const vertices = this.bufferManager.createRectVertices(x, y, width, height);
        const vertexBuffer = this.bufferManager.createVertexBuffer(
            `tex_rect_${Date.now()}`,
            vertices
        );

        const uniformData = new Float32Array([
            ...matrix,
            1.0, 1.0, 1.0, 1.0, // color
            1.0 // alpha
        ]);

        const uniformBuffer = this.bufferManager.createUniformBuffer(
            `tex_uniform_${Date.now()}`,
            uniformData.byteLength
        );
        this.device.queue.writeBuffer(uniformBuffer, 0, uniformData);

        const bindGroup = this.createTextureBindGroup(
            `tex_bind_${Date.now()}`,
            uniformBuffer,
            sampler,
            texture_view
        );

        const pipeline = this.pipelineManager.getPipeline("texture");
        if (!pipeline) {
            throw new Error("Texture pipeline not found");
        }

        pass_encoder.setPipeline(pipeline);
        pass_encoder.setVertexBuffer(0, vertexBuffer);
        pass_encoder.setBindGroup(0, bindGroup);
        pass_encoder.draw(6, 1, 0, 0);
    }

    /**
     * @description バインドグループを取得
     * @param {string} name
     * @return {GPUBindGroup | undefined}
     */
    getBindGroup(name: string): GPUBindGroup | undefined
    {
        return this.bindGroups.get(name);
    }

    /**
     * @description リソースを解放
     * @return {void}
     */
    dispose(): void
    {
        this.bindGroups.clear();
    }
}
