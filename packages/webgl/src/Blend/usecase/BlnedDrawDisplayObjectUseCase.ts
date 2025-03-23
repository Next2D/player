import type { Node } from "@next2d/texture-packer";
import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as variantsBlendInstanceShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendInstanceShaderService";
import { execute as variantsBlendDrawShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendDrawShaderService";
import { $getFloat32Array6, $RENDER_MAX_SIZE } from "../../WebGLUtil";
import { $setActiveAtlasIndex } from "../../AtlasManager";
import { execute as frameBufferManagerGetTextureFromNodeUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetTextureFromNodeUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { execute as textureManagerBind0UseCase } from "../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as textureManagerBind01UseCase } from "../../TextureManager/usecase/TextureManagerBind01UseCase";
import { execute as frameBufferManagerGetTextureFromBoundsUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetTextureFromBoundsUseCase";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as shaderManagerDrawTextureUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as frameBufferManagerTransferTextureFromRectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerTransferTextureFromRectUseCase";
import { execute as shaderManagerSetBlendWithColorTransformUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetBlendWithColorTransformUniformService";
import { execute as variantsBlendMatrixTextureShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendMatrixTextureShaderService";
import { execute as shaderManagerSetMatrixTextureUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMatrixTextureUniformService";
import {
    $context,
    $getViewportHeight,
    $getViewportWidth
} from "../../WebGLUtil";
import {
    $getCurrentBlendMode,
    $setCurrentBlendMode
} from "../../Blend";
import {
    $getCurrentAtlasIndex,
    $setCurrentAtlasIndex
} from "../../AtlasManager";
import { renderQueue } from "@next2d/render-queue";

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

    const ct0 = color_transform[0];
    const ct1 = color_transform[1];
    const ct2 = color_transform[2];
    const ct3 = $context.globalAlpha;
    const ct4 = color_transform[4] / 255;
    const ct5 = color_transform[5] / 255;
    const ct6 = color_transform[6] / 255;
    const ct7 = 0;

    const matrix = $context.$matrix;
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

                renderQueue.push(
                    // texture rectangle (vec4)
                    node.x / $RENDER_MAX_SIZE, node.y / $RENDER_MAX_SIZE,
                    node.w / $RENDER_MAX_SIZE, node.h / $RENDER_MAX_SIZE,
                    // texture width, height and viewport width, height (vec4)
                    node.w, node.h, $getViewportWidth(), $getViewportHeight(),
                    // matrix tx, ty (vec2)
                    matrix[6], matrix[7],
                    // matrix scale0, rotate0, scale1, rotate1 (vec4)
                    matrix[0], matrix[1], matrix[3], matrix[4],
                    // mulColor (vec4)
                    ct0, ct1, ct2, ct3,
                    // addColor (vec4)
                    ct4, ct5, ct6, ct7
                );
                shaderInstancedManager.count++;
            }
            break;

        default:
            {
                const currentAttachmentObject = $context.currentAttachmentObject;

                // これまでの描画を実行
                $context.drawArraysInstanced();

                const width  = Math.ceil(Math.abs(x_max - x_min));
                const height = Math.ceil(Math.abs(y_max - y_min));

                let offsetX = 0;
                let offsetY = 0;

                let srcTextureObject = frameBufferManagerGetTextureFromNodeUseCase(node);
                if (matrix[0] !== 1 || matrix[1] !== 0
                    || matrix[3] !== 0 || matrix[4] !== 1
                ) {

                    const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase(
                        width, height, false
                    );

                    const a = $getFloat32Array6(
                        matrix[0], matrix[1],
                        matrix[3], matrix[4],
                        width / 2, height / 2
                    );

                    const b = $getFloat32Array6(
                        1, 0, 0, 1,
                        -node.w / 2,
                        -node.h / 2
                    );

                    const tMatrix = $getFloat32Array6(
                        a[0] * b[0] + a[2] * b[1],
                        a[1] * b[0] + a[3] * b[1],
                        a[0] * b[2] + a[2] * b[3],
                        a[1] * b[2] + a[3] * b[3],
                        a[0] * b[4] + a[2] * b[5] + a[4],
                        a[1] * b[4] + a[3] * b[5] + a[5]
                    );

                    $context.save();
                    $context.bind(attachmentObject);
                    $context.setTransform(
                        tMatrix[0], tMatrix[1],
                        tMatrix[2], tMatrix[3],
                        tMatrix[4], tMatrix[5]
                    );

                    offsetX = tMatrix[4];
                    offsetY = tMatrix[5];

                    // 元の描画をフィルター用のテクスチャに描画
                    const shaderManager = variantsBlendMatrixTextureShaderService();
                    shaderManagerSetMatrixTextureUniformService(
                        shaderManager, srcTextureObject.width, srcTextureObject.height
                    );

                    textureManagerBind0UseCase(srcTextureObject, true);
                    shaderManagerDrawTextureUseCase(shaderManager);

                    // 元のテクスチャを解放
                    textureManagerReleaseTextureObjectUseCase(srcTextureObject);

                    // フィルター用のテクスチャをセットしてコピー用のAttachmentObjectをリリース
                    srcTextureObject = attachmentObject.texture as ITextureObject;
                    frameBufferManagerReleaseAttachmentObjectUseCase(attachmentObject, false);

                    if (currentAttachmentObject) {
                        $context.bind(currentAttachmentObject);
                    }

                    $context.restore();
                }

                // offset値があれば、座標を移動
                if (offsetX || offsetY) {
                    matrix[6] -= offsetX;
                    matrix[7] -= offsetY;
                }

                const dstTextureObject = frameBufferManagerGetTextureFromBoundsUseCase(
                    matrix[6], matrix[7], width, height
                );

                const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase(width, height, false);
                $context.bind(attachmentObject);

                // ブレンドするテクスチャをバインド
                textureManagerBind01UseCase(dstTextureObject, srcTextureObject);

                // blend用のシェーダーを取得
                const shaderManager = variantsBlendDrawShaderService($context.globalCompositeOperation, true);
                shaderManagerSetBlendWithColorTransformUniformService(
                    shaderManager,
                    ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7
                );

                shaderManagerDrawTextureUseCase(shaderManager);

                if (currentAttachmentObject) {
                    $context.bind(currentAttachmentObject);
                }

                // ブレンドしたtextureを元の座標に描画
                frameBufferManagerTransferTextureFromRectUseCase(
                    attachmentObject.texture as ITextureObject
                );

                // matrixを元に戻す
                if (offsetX || offsetY) {
                    matrix[6] += offsetX;
                    matrix[7] += offsetY;
                }

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