import { renderQueue } from "@next2d/render-queue";

/**
 * @description WebGPU用インスタンスシェーダーマネージャー
 *              WebGPU instance shader manager
 */
export class ShaderInstancedManager
{
    public count: number;
    public readonly pipelineName: string;
    public readonly isAtlas: boolean;

    /**
     * @param {string} pipeline_name
     * @param {boolean} is_atlas
     * @constructor
     */
    constructor(pipeline_name: string, is_atlas: boolean = true)
    {
        this.pipelineName = pipeline_name;
        this.isAtlas = is_atlas;
        this.count = 0;
    }

    /**
     * @description インスタンスカウントをクリア
     * @return {void}
     */
    clear(): void
    {
        this.count = renderQueue.offset = 0;
    }
}
