/**
 * @description WebGPUブレンドステート定義
 *              WebGPU blend state definitions
 */
export interface IBlendState {
    /**
     * @description カラーチャンネルのブレンド設定
     *              Blend component configuration for the color channel
     */
    color: GPUBlendComponent;
    /**
     * @description アルファチャンネルのブレンド設定
     *              Blend component configuration for the alpha channel
     */
    alpha: GPUBlendComponent;
}
