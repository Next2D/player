import type { IBlendMode } from "./interface/IBlendMode";
import type { IBlendState } from "./interface/IBlendState";

export type { IBlendState };

/**
 * @description 現在のブレンドモード
 *              The current blend mode used for rendering
 *
 * @type {IBlendMode}
 */
export let $currentBlendMode: IBlendMode = "normal";

/**
 * @description 現在のブレンドモードを設定する
 *              Set the current blend mode
 *
 * @param {IBlendMode} blend_mode - ブレンドモード / blend mode to apply
 * @return {void}
 */
export const $setCurrentBlendMode = (blend_mode: IBlendMode): void =>
{
    $currentBlendMode = blend_mode;
};

/**
 * @description 指定されたブレンドモードに対応するWebGPUブレンドステートを返す
 *              Returns the WebGPU blend state configuration for the given blend mode
 *
 * @param {IBlendMode} mode - ブレンドモード / blend mode
 * @return {IBlendState}
 */
export const $getBlendState = (mode: IBlendMode): IBlendState =>
{
    switch (mode) {
        case "add":
            return {
                "color": {
                    "srcFactor": "one",
                    "dstFactor": "one",
                    "operation": "add"
                },
                "alpha": {
                    "srcFactor": "one",
                    "dstFactor": "one-minus-src-alpha",
                    "operation": "add"
                }
            };

        case "screen":
            return {
                "color": {
                    "srcFactor": "one-minus-dst",
                    "dstFactor": "one",
                    "operation": "add"
                },
                "alpha": {
                    "srcFactor": "one",
                    "dstFactor": "one-minus-src-alpha",
                    "operation": "add"
                }
            };

        case "alpha":
            return {
                "color": {
                    "srcFactor": "zero",
                    "dstFactor": "src-alpha",
                    "operation": "add"
                },
                "alpha": {
                    "srcFactor": "zero",
                    "dstFactor": "src-alpha",
                    "operation": "add"
                }
            };

        case "erase":
            return {
                "color": {
                    "srcFactor": "zero",
                    "dstFactor": "one-minus-src-alpha",
                    "operation": "add"
                },
                "alpha": {
                    "srcFactor": "zero",
                    "dstFactor": "one-minus-src-alpha",
                    "operation": "add"
                }
            };

        case "copy":
            return {
                "color": {
                    "srcFactor": "one",
                    "dstFactor": "zero",
                    "operation": "add"
                },
                "alpha": {
                    "srcFactor": "one",
                    "dstFactor": "zero",
                    "operation": "add"
                }
            };

        // normal and default
        default:
            return {
                "color": {
                    "srcFactor": "one",
                    "dstFactor": "one-minus-src-alpha",
                    "operation": "add"
                },
                "alpha": {
                    "srcFactor": "one",
                    "dstFactor": "one-minus-src-alpha",
                    "operation": "add"
                }
            };
    }
};
