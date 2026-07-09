import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { TexturePacker } from "@next2d/texture-packer";
import type { ITextureObject } from "./interface/ITextureObject";
import { execute as textureManagerCreateAtlasTextureUseCase } from "./TextureManager/usecase/TextureManagerCreateAtlasTextureUseCase";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "./FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import {
    $RENDER_MAX_SIZE,
    $gl
} from "./WebGLUtil";

const $MAX_VALUE: number = Number.MAX_VALUE;
const $MIN_VALUE: number = -Number.MAX_VALUE;

export let $activeAtlasIndex: number = 0;

export const $setActiveAtlasIndex = (index: number): void =>
{
    $activeAtlasIndex = index;
};

const $atlasAttachmentObjects: IAttachmentObject[] = [];

export const $getAtlasAttachmentObjects = (): IAttachmentObject[] =>
{
    return $atlasAttachmentObjects;
};

export const $setAtlasAttachmentObject = (attachment_object: IAttachmentObject): void =>
{
    $atlasAttachmentObjects[$activeAtlasIndex] = attachment_object;
};

export const $getAtlasAttachmentObject = (): IAttachmentObject =>
{
    let attachmentObject = $atlasAttachmentObjects[$activeAtlasIndex];
    if (!attachmentObject) {
        attachmentObject = frameBufferManagerGetAttachmentObjectUseCase(
            $RENDER_MAX_SIZE, $RENDER_MAX_SIZE, true
        );
        $atlasAttachmentObjects[$activeAtlasIndex] = attachmentObject;
    }
    return attachmentObject;
};

export const $hasAtlasAttachmentObject = (): boolean =>
{
    return !!$atlasAttachmentObjects[$activeAtlasIndex];
};

export const $rootNodes: TexturePacker[] = [];

export let $atlasTexture: ITextureObject | null = null;

/**
 * @description 現在のアトラス配列テクスチャのレイヤー数
 *              Current number of layers in the atlas array texture
 *
 * @type {number}
 * @private
 */
let $atlasTextureLayers: number = 0;

/**
 * @description ページ毎の「未解決の描き込みがあるか」フラグ
 *              Per-page flag indicating unresolved drawing into the page
 *
 * @type {boolean[]}
 * @private
 */
const $atlasDirtyPages: boolean[] = [];

/**
 * @description 指定ページを未解決(dirty)としてマークする
 *              Mark the given page as dirty (has unresolved drawing)
 *
 * @param  {number} index
 * @return {void}
 * @method
 * @protected
 */
export const $setAtlasPageDirty = (index: number): void =>
{
    $atlasDirtyPages[index] = true;
};

/**
 * @description 指定ページのdirtyフラグを取得
 *              Get the dirty flag of the given page
 *
 * @param  {number} index
 * @return {boolean}
 * @method
 * @protected
 */
export const $isAtlasPageDirty = (index: number): boolean =>
{
    return !!$atlasDirtyPages[index];
};

/**
 * @description 指定ページのdirtyフラグをクリア
 *              Clear the dirty flag of the given page
 *
 * @param  {number} index
 * @return {void}
 * @method
 * @protected
 */
export const $clearAtlasPageDirty = (index: number): void =>
{
    $atlasDirtyPages[index] = false;
};

export const $getAtlasTextureObject = (): ITextureObject =>
{
    if (!$atlasTexture) {
        $atlasTexture = textureManagerCreateAtlasTextureUseCase(1);
        $atlasTextureLayers = 1;
    }
    return $atlasTexture as ITextureObject;
};

/**
 * @description アトラス配列テクスチャのレイヤー数を必要数まで拡張する。
 *              texStorage3Dはimmutableのため、拡張時は作り直して全ページを
 *              dirty(全域)にし、次回の解決で各ページのMSAAバッファから再転写する。
 *              (ページの内容は各ページのMSAAアタッチメントが保持している)
 *              Grow the atlas array texture to the required layer count.
 *              texStorage3D is immutable, so the texture is recreated and all
 *              pages are marked fully dirty; the next resolve re-blits each
 *              page from its MSAA attachment (which owns the page contents).
 *
 * @param  {number} layers
 * @return {void}
 * @method
 * @protected
 */
export const $ensureAtlasTextureLayers = (layers: number): void =>
{
    if (!$atlasTexture) {
        $atlasTextureLayers = Math.max(1, layers);
        $atlasTexture = textureManagerCreateAtlasTextureUseCase($atlasTextureLayers);
        return ;
    }

    if (layers <= $atlasTextureLayers) {
        return ;
    }

    $gl.deleteTexture($atlasTexture.resource);
    $atlasTexture = textureManagerCreateAtlasTextureUseCase(layers);
    $atlasTextureLayers = layers;

    // 全ページを全域dirtyにして次回の解決で再転写させる
    for (let idx = 0; idx < $atlasAttachmentObjects.length; ++idx) {
        if (!$atlasAttachmentObjects[idx]) {
            continue;
        }
        $atlasDirtyPages[idx] = true;

        const bounds = $getActiveTransferBounds(idx);
        bounds[0] = 0;
        bounds[1] = 0;
        bounds[2] = $RENDER_MAX_SIZE;
        bounds[3] = $RENDER_MAX_SIZE;
    }
};

const $transferBounds: Float32Array[] = [];

export const $getActiveTransferBounds = (index: number): Float32Array =>
{
    let bounds = $transferBounds[index];
    if (!bounds) {
        bounds = new Float32Array([
            $MAX_VALUE,
            $MAX_VALUE,
            $MIN_VALUE,
            $MIN_VALUE
        ]);
        $transferBounds[index] = bounds;
    }
    return bounds;
};

export const $clearTransferBounds = (): void =>
{
    for (let idx = 0; idx < $transferBounds.length; ++idx) {
        const bounds = $transferBounds[idx];
        if (!bounds) {
            continue;
        }

        bounds[0] = bounds[1] = $MAX_VALUE;
        bounds[2] = bounds[3] = $MIN_VALUE;
    }
};

export let $currentAtlasIndex: number = 0;

export const $setCurrentAtlasIndex = (index: number): void =>
{
    $currentAtlasIndex = index;
};
