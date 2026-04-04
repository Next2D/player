import { renderQueue } from "@next2d/render-queue";

/**
 * @description WebGPU用インスタンスシェーダーマネージャー
 *              WebGPU instanced shader manager for batch rendering
 */
export class ShaderInstancedManager
{
    /**
     * @description 現在のインスタンス描画カウント
     *              Current instance draw count
     *
     * @type {number}
     */
    public count: number;

    /**
     * @description ShaderInstancedManagerを初期化する
     *              Initialize ShaderInstancedManager
     */
    constructor()
    {
        this.count = 0;
    }

    /**
     * @description インスタンスカウントとレンダーキューオフセットをリセットする
     *              Reset instance count and render queue offset
     *
     * @return {void}
     */
    clear(): void
    {
        this.count = renderQueue.offset = 0;
    }
}
