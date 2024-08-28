import type { Node } from "@next2d/texture-packer";
import { execute as variantsBlendInstanceShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendInstanceShaderService";
import { $RENDER_MAX_SIZE } from "../../WebGLUtil";
import {
    $context,
    $getViewportHeight,
    $getViewportWidth
} from "../../WebGLUtil";
import { 
    $getCurrentBlendMode,
    $setCurrentBlendMode,
    $getCurrentAtlasIndex,
    $setCurrentAtlasIndex,
 } from "../../Blend";
import { $setActiveAtlasIndex } from "../../AtlasManager";

/**
 * @description DisplayObject単体の描画を実行
 *              Execute drawing of a single DisplayObject
 * 
 * @param  {Node} node 
 * @param  {number} x_min 
 * @param  {number} y_min 
 * @param  {number} x_max 
 * @param  {number} y_max 
 * @param  {Float32Array} color_transform
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    node: Node,
    x_min: number, 
    y_min: number,
    x_max: number,
    y_max: number, 
    color_transform: Float32Array
): void => {

    const ct0: number = color_transform[0];
    const ct1: number = color_transform[1];
    const ct2: number = color_transform[2];
    const ct3: number = $context.globalAlpha;
    const ct4: number = color_transform[4] / 255;
    const ct5: number = color_transform[5] / 255;
    const ct6: number = color_transform[6] / 255;
    const ct7: number = 0;

    switch ($context.globalCompositeOperation) {

        case "normal":
        case "layer":
        case "add":
        case "screen":
        case "alpha":
        case "erase":
        case "copy":
            {
                if ($getCurrentBlendMode() !== $context.globalCompositeOperation
                    || $getCurrentAtlasIndex() !== node.index
                ) {
                    // 異なるフレームバッファになるので、切り替え前にメインバッファに描画を実行
                    $setActiveAtlasIndex($getCurrentAtlasIndex());
                    $context.drawArraysInstanced();

                    // ブレンドモードをセット
                    $setCurrentBlendMode($context.globalCompositeOperation);
                    $setCurrentAtlasIndex(node.index);
                    $setActiveAtlasIndex(node.index);
                }

                // 描画するまで配列に変数を保持
                const shaderInstancedManager = variantsBlendInstanceShaderService();

                const matrix = $context.$matrix;
                shaderInstancedManager.attributes.push(
                    // texture rectangle
                    node.x / $RENDER_MAX_SIZE, node.y / $RENDER_MAX_SIZE,
                    node.w / $RENDER_MAX_SIZE, node.h / $RENDER_MAX_SIZE,
                    // texture width, height and viewport width, height
                    node.w, node.h, $getViewportWidth(), $getViewportHeight(),
                    // matrix tx, ty and with_color_transform
                    matrix[6], matrix[7],
                    // matrix scale0, rotate0, scale1, rotate1
                    matrix[0], matrix[1], matrix[3], matrix[4],
                    // mulColor
                    ct0, ct1, ct2, ct3,
                    // addColor
                    ct4, ct5, ct6, ct7
                );
                shaderInstancedManager.count++;
            }
            break;

        default:
            $context.drawArraysInstanced();
            // todo
            break;

    }
};