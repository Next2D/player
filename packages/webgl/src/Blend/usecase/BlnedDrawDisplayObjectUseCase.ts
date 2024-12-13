import type { Node } from "@next2d/texture-packer";
import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as variantsBlendInstanceShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendInstanceShaderService";
import { execute as variantsBlendDrawShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendDrawShaderService";
import { $RENDER_MAX_SIZE } from "../../WebGLUtil";
import { $setActiveAtlasIndex } from "../../AtlasManager";
import { execute as frameBufferManagerGetTextureFromNodeUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetTextureFromNodeUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { execute as textureManagerBind01UseCase } from "../../TextureManager/usecase/TextureManagerBind01UseCase";
import { execute as frameBufferManagerGetTextureFromBoundsUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetTextureFromBoundsUseCase";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as shaderManagerDrawTextureUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as frameBufferManagerTransferTextureFromRectService } from "../../FrameBufferManager/service/FrameBufferManagerTransferTextureFromRectService";
import { execute as shaderManagerSetBlendUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetBlendUniformService";
import {
    $context,
    $getViewportHeight,
    $getViewportWidth
} from "../../WebGLUtil";
import {
    $getCurrentBlendMode,
    $setCurrentBlendMode,
    $getCurrentAtlasIndex,
    $setCurrentAtlasIndex
} from "../../Blend";

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

                    const currentOperation = $context.globalCompositeOperation;
                    $context.globalCompositeOperation = $getCurrentBlendMode();
                    $context.drawArraysInstanced();

                    // ブレンドモードをセット
                    $context.globalCompositeOperation = currentOperation;
                    $setCurrentBlendMode($context.globalCompositeOperation);

                    // indexをセット
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
                    // matrix tx, ty
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
            {
                // これまでの描画を実行
                $context.drawArraysInstanced();

                const srcTextureObject = frameBufferManagerGetTextureFromNodeUseCase(node);

                const x = x_min | 0;
                const y = y_min | 0;
                const width  = Math.ceil(Math.abs(x_max - x_min));
                const height = Math.ceil(Math.abs(y_max - y_min));

                const dstTextureObject = frameBufferManagerGetTextureFromBoundsUseCase(x, y, width, height);

                const currentAttachmentObject = $context.currentAttachmentObject;
                const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase(width, height, false);
                $context.bind(attachmentObject);

                // ブレンドするテクスチャをバインド
                textureManagerBind01UseCase(dstTextureObject, srcTextureObject);

                // blend用のシェーダーを取得
                const shaderManager = variantsBlendDrawShaderService($context.globalCompositeOperation, true);
                shaderManagerSetBlendUniformService(
                    shaderManager,
                    ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7
                );

                shaderManagerDrawTextureUseCase(shaderManager);

                if (currentAttachmentObject) {
                    $context.bind(currentAttachmentObject);
                }

                // ブレンドしたtextureを元の座標に描画
                frameBufferManagerTransferTextureFromRectService(
                    x, y, attachmentObject.texture as ITextureObject
                );

                // テクスチャを解放
                textureManagerReleaseTextureObjectUseCase(srcTextureObject);
                textureManagerReleaseTextureObjectUseCase(dstTextureObject);

                // フレームバッファを解放
                frameBufferManagerReleaseAttachmentObjectUseCase(attachmentObject);

                // ブレンドモードをセット
                $setCurrentBlendMode($context.globalCompositeOperation);

                // indexをセット
                $setCurrentAtlasIndex(node.index);
                $setActiveAtlasIndex(node.index);
            }
            break;

    }
};