import { renderQueue } from "@next2d/render-queue";

/**
 * @description WebGPU用インスタンスシェーダーマネージャー
 */
export class ShaderInstancedManager
{
    public count: number;

    constructor()
    {
        this.count = 0;
    }

    clear(): void
    {
        this.count = renderQueue.offset = 0;
    }
}
