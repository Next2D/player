import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { ITextureObject } from "../../interface/ITextureObject";
import type { Node } from "@next2d/texture-packer";
import { $containerLayerStack } from "./ContextContainerBeginLayerUseCase";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";
import { execute as variantsBlendMatrixTextureShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendMatrixTextureShaderService";
import { execute as shaderManagerSetMatrixTextureWithColorTransformUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMatrixTextureWithColorTransformUniformService";
import { execute as textureManagerBind0UseCase } from "../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as shaderManagerDrawTextureUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { execute as blendOperationUseCase } from "../../Blend/usecase/BlendOperationUseCase";
import { $context } from "../../WebGLUtil";
import { $getAtlasAttachmentObject } from "../../AtlasManager";

/**
 * @description コンテナ用のカラー変換（恒等変換）
 *              Identity color transform for container copy
 *
 * @type {Float32Array}
 * @private
 */
const $identityColorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

/**
 * @description コンテナのアトラスノードへの描画を終了し、
 *              temp FBOの内容をアトラスのノード領域にコピーします。
 *              End container atlas node rendering,
 *              copy temp FBO contents to atlas node region.
 *
 * @param  {Node} node
 * @return {void}
 * @method
 * @protected
 */
export const execute = (node: Node): void =>
{
    // temp FBOへの描画をフラッシュ
    $context.drawArraysInstanced();

    const tempAttachment = $context.$mainAttachmentObject as IAttachmentObject;
    const textureObject = tempAttachment.texture as ITextureObject;

    // mainを復元（$containerLayerStackから）
    $context.$mainAttachmentObject = $containerLayerStack.pop() as IAttachmentObject;

    // temp FBOを解放（テクスチャは保持してアトラスコピーに使用）
    frameBufferManagerReleaseAttachmentObjectUseCase(tempAttachment, false);

    if (textureObject) {
        // アトラスにバインド
        const atlas = $getAtlasAttachmentObject() as IAttachmentObject;
        $context.bind(atlas);

        // ノード領域を設定（scissor + clear + transfer bounds登録）
        $context.beginNodeRendering(node);

        // ブレンドモード設定（premultiplied alpha用: ONE, ONE_MINUS_SRC_ALPHA）
        blendOperationUseCase("normal");

        // テクスチャをノード位置に描画（Y軸反転: WebGLはbottom-left原点）
        const offsetY = atlas.height - node.y - node.h;
        $context.setTransform(1, 0, 0, 1, node.x, offsetY);
        const shaderManager = variantsBlendMatrixTextureShaderService(false);
        shaderManagerSetMatrixTextureWithColorTransformUniformService(
            shaderManager, $identityColorTransform, node.w, node.h
        );
        textureManagerBind0UseCase(textureObject);
        shaderManagerDrawTextureUseCase(shaderManager);

        // ノード描画終了
        $context.endNodeRendering();

        // テクスチャを解放
        textureManagerReleaseTextureObjectUseCase(textureObject);
    }

    // mainをバインド
    $context.bind($context.$mainAttachmentObject as IAttachmentObject);
};
