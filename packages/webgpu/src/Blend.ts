import type { IBlendMode } from "./interface/IBlendMode";

/**
 * @description 現在設定されているブレンドモード
 *              The currently set blend mode
 *
 * @type {IBlendMode}
 * @default "normal"
 * @private
 */
let $currentBlendMode: IBlendMode = "normal";

/**
 * @description ブレンド機能コード（パイプライン再利用判定用）
 *              Blend function code (for pipeline reuse determination)
 *
 * @type {number}
 * @private
 */
let $funcCode: number = 0;

/**
 * @description ブレンドモード情報を更新
 *              Update blend mode information
 *
 * @param  {string} blend_mode
 * @return {void}
 * @method
 * @protected
 */
export const $setCurrentBlendMode = (blend_mode: IBlendMode): void =>
{
    $currentBlendMode = blend_mode;
};

/**
 * @description 現在設定されているブレンドモードを返却
 *              Returns the currently set blend mode
 *
 * @return {IBlendMode}
 * @method
 * @protected
 */
export const $getCurrentBlendMode = (): IBlendMode =>
{
    return $currentBlendMode;
};

/**
 * @description ブレンド機能コードを設定
 *              Set the blend function code
 *
 * @param  {number} code
 * @return {void}
 * @method
 * @protected
 */
export const $setFuncCode = (code: number): void =>
{
    $funcCode = code;
};

/**
 * @description ブレンド機能コードを取得
 *              Get the blend function code
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getFuncCode = (): number =>
{
    return $funcCode;
};

/**
 * @description WebGPUブレンドステート定義
 *              WebGPU blend state definitions
 */
export interface IBlendState {
    color: GPUBlendComponent;
    alpha: GPUBlendComponent;
}

/**
 * @description ブレンドモードからWebGPUブレンドステートを取得
 *              Get WebGPU blend state from blend mode
 *
 * @param  {IBlendMode} mode
 * @return {IBlendState}
 * @method
 * @protected
 */
export const $getBlendState = (mode: IBlendMode): IBlendState =>
{
    switch (mode) {
        case "add":
            return {
                color: {
                    srcFactor: "one",
                    dstFactor: "one",
                    operation: "add"
                },
                alpha: {
                    srcFactor: "one",
                    dstFactor: "one-minus-src-alpha",
                    operation: "add"
                }
            };

        case "screen":
            return {
                color: {
                    srcFactor: "one-minus-dst",
                    dstFactor: "one",
                    operation: "add"
                },
                alpha: {
                    srcFactor: "one",
                    dstFactor: "one-minus-src-alpha",
                    operation: "add"
                }
            };

        case "alpha":
            return {
                color: {
                    srcFactor: "zero",
                    dstFactor: "src-alpha",
                    operation: "add"
                },
                alpha: {
                    srcFactor: "zero",
                    dstFactor: "src-alpha",
                    operation: "add"
                }
            };

        case "erase":
            return {
                color: {
                    srcFactor: "zero",
                    dstFactor: "one-minus-src-alpha",
                    operation: "add"
                },
                alpha: {
                    srcFactor: "zero",
                    dstFactor: "one-minus-src-alpha",
                    operation: "add"
                }
            };

        case "copy":
            return {
                color: {
                    srcFactor: "one",
                    dstFactor: "zero",
                    operation: "add"
                },
                alpha: {
                    srcFactor: "one",
                    dstFactor: "zero",
                    operation: "add"
                }
            };

        // normal and default
        default:
            return {
                color: {
                    srcFactor: "one",
                    dstFactor: "one-minus-src-alpha",
                    operation: "add"
                },
                alpha: {
                    srcFactor: "one",
                    dstFactor: "one-minus-src-alpha",
                    operation: "add"
                }
            };
    }
};
