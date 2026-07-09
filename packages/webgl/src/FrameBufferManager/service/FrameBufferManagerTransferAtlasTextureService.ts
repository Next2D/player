import {
    $getActiveTransferBounds,
    $getAtlasAttachmentObjects,
    $getAtlasTextureObject,
    $ensureAtlasTextureLayers,
    $isAtlasPageDirty,
    $clearAtlasPageDirty
} from "../../AtlasManager";
import {
    $gl,
    $context,
    $RENDER_MAX_SIZE,
    $enableScissorTest,
    $disableScissorTest,
    $setScissorBox
} from "../../WebGLUtil";
import {
    $atlasFrameBuffer,
    $setFramebufferBound
} from "../../FrameBufferManager";

/**
 * @type {number}
 * @private
 */
const $MAX_VALUE: number = Number.MAX_VALUE;

/**
 * @description 未解決(dirty)の全アトラスページを、配列テクスチャの各レイヤーへ解決します。
 *              ページ毎に専用レイヤーを持つため、解決は「ページ切替のたび」ではなく
 *              「描き込みがあったページのみ」行えばよい。
 *              Resolve all dirty atlas pages into their own layers of the
 *              atlas array texture. Each page owns a dedicated layer, so a
 *              resolve is needed only for pages that received drawing,
 *              not on every page switch.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if (!$context.newDrawState) {
        return ;
    }

    const currentAttachmentObject = $context.currentAttachmentObject;

    const atlasAttachmentObjects = $getAtlasAttachmentObjects();

    // ページ数に合わせて配列テクスチャのレイヤーを確保
    // (拡張時は全ページが全域dirtyになり、このループで再転写される)
    $ensureAtlasTextureLayers(atlasAttachmentObjects.length);

    const atlasTextureObject = $getAtlasTextureObject();

    $enableScissorTest();
    for (let idx = 0; idx < atlasAttachmentObjects.length; ++idx) {

        if (!$isAtlasPageDirty(idx)) {
            continue;
        }

        const atlasAttachmentObject = atlasAttachmentObjects[idx];
        if (!atlasAttachmentObject) {
            $clearAtlasPageDirty(idx);
            continue;
        }

        // ページのMSAAアタッチメントをREADにバインド
        $context.bind(atlasAttachmentObject);

        // 対象レイヤーをDRAWにアタッチ
        $gl.bindFramebuffer($gl.DRAW_FRAMEBUFFER, $atlasFrameBuffer);
        $gl.framebufferTextureLayer(
            $gl.DRAW_FRAMEBUFFER, $gl.COLOR_ATTACHMENT0,
            atlasTextureObject.resource, 0, idx
        );
        $setFramebufferBound(false);

        const bounds = $getActiveTransferBounds(idx);
        if (bounds[0] === $MAX_VALUE) {
            // dirtyだが範囲が未記録の場合は全域を転写(安全側)
            $setScissorBox(0, 0, $RENDER_MAX_SIZE, $RENDER_MAX_SIZE);
        } else {
            $setScissorBox(
                bounds[0], bounds[1],
                bounds[2] - bounds[0], bounds[3] - bounds[1]
            );
        }

        $gl.blitFramebuffer(
            0, 0, atlasAttachmentObject.width, atlasAttachmentObject.height,
            0, 0, atlasAttachmentObject.width, atlasAttachmentObject.height,
            $gl.COLOR_BUFFER_BIT,
            $gl.NEAREST
        );

        $clearAtlasPageDirty(idx);
    }
    $disableScissorTest();

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }

    $context.newDrawState = false;
};
