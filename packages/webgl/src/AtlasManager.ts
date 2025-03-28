import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { TexturePacker } from "@next2d/texture-packer";
import type { ITextureObject } from "./interface/ITextureObject";
import { execute as textureManagerCreateAtlasTextureUseCase } from "./TextureManager/usecase/TextureManagerCreateAtlasTextureUseCase";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "./FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { $RENDER_MAX_SIZE } from "./WebGLUtil";

/**
 * @description アクティブなアトラスインデックス
 *              Active atlas index
 *
 * @type {number}
 * @private
 */
let $activeAtlasIndex: number = 0;

/**
 * @description アクティブなアトラスインデックスをセット
 *              Set the active atlas index
 *
 * @param  {number} index
 * @return {void}
 * @method
 * @protected
 */
export const $setActiveAtlasIndex = (index: number): void =>
{
    $activeAtlasIndex = index;
};

/**
 * @description アクティブなアトラスインデックスを返却
 *              Return the active atlas index
 *
 * @returns {number}
 * @method
 * @protected
 */
export const $getActiveAtlasIndex = (): number =>
{
    return $activeAtlasIndex;
};

/**
 * @description アトラステクスチャのアタッチメントオブジェクト
 *              Attachment object of atlas texture
 *
 * @type {IAttachmentObject[]}
 * @private
 */
const $atlasAttachmentObjects: IAttachmentObject[] = [];

/**
 * @description アトラス専用のフレームバッファ配列
 *              Array of frame buffers dedicated to the atlas
 *
 * @return {IAttachmentObject[]}
 * @method
 * @protected
 */
export const $getAtlasAttachmentObjects = (): IAttachmentObject[] =>
{
    return $atlasAttachmentObjects;
};

/**
 * @description アトラステクスチャオブジェクトをセット
 *              Set the atlas texture object
 *
 * @param  {IAttachmentObject} attachment_object
 * @return {void}
 * @method
 * @protected
 */
export const $setAtlasAttachmentObject = (attachment_object: IAttachmentObject): void =>
{
    $atlasAttachmentObjects[$activeAtlasIndex] = attachment_object;
};

/**
 * @description アトラステクスチャオブジェクトを返却
 *              Return the atlas texture object
 *
 * @returns {IAttachmentObject}
 * @method
 * @protected
 */
export const $getAtlasAttachmentObject = (): IAttachmentObject =>
{
    if (!($activeAtlasIndex in $atlasAttachmentObjects)) {
        $setAtlasAttachmentObject(
            frameBufferManagerGetAttachmentObjectUseCase($RENDER_MAX_SIZE, $RENDER_MAX_SIZE, true)
        );
    }
    return $atlasAttachmentObjects[$activeAtlasIndex];
};

/**
 * @description アトラステクスチャオブジェクトが存在するか
 *              Does the atlas texture object exist?
 *
 * @return {boolean}
 * @method
 * @protected
 */
export const $hasAtlasAttachmentObject = (): boolean =>
{
    return $activeAtlasIndex in $atlasAttachmentObjects;
};

/**
 * @description ルートノードの配列
 *              Array of root nodes
 *
 * @type {TexturePacker[]}
 * @protected
 */
export const $rootNodes: TexturePacker[] = [];

/**
 * @description アトラス専用のテクスチャ
 *              Texture for atlas only
 *
 * @type {ITextureObject | null}
 * @private
 */
export let $atlasTexture: ITextureObject | null = null;

/**
 * @description アトラステクスチャオブジェクトを返却
 *              Return the atlas texture object
 *
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const $getAtlasTextureObject = (): ITextureObject =>
{
    if (!$atlasTexture) {
        $atlasTexture = textureManagerCreateAtlasTextureUseCase();
    }
    return $atlasTexture as ITextureObject;
};

/**
 * @type {Float32Array[]}
 * @private
 */
const $transferBounds: Float32Array[] = [];

/**
 * @description アトラステクスチャの転送範囲を返却
 *              Return the transfer range of the atlas texture
 *
 * @param  {number} index
 * @return {Float32Array}
 * @method
 * @protected
 */
export const $getActiveTransferBounds = (index: number): Float32Array =>
{
    if (!(index in $transferBounds)) {
        $transferBounds[index] = new Float32Array([
            Number.MAX_VALUE,
            Number.MAX_VALUE,
            -Number.MAX_VALUE,
            -Number.MAX_VALUE
        ]);
    }
    return $transferBounds[index];
};

/**
 * @type {Float32Array[]}
 * @private
 */
const $allTransferBounds: Float32Array[] = [];

/**
 * @description アトラステクスチャの切り替え時の転送範囲を返却
 *              Return the transfer range when switching the atlas texture
 *
 * @param  {number} index
 * @return {Float32Array}
 * @method
 * @protected
 */
export const $getActiveAllTransferBounds = (index: number): Float32Array =>
{
    if (!(index in $allTransferBounds)) {
        $allTransferBounds[index] = new Float32Array([
            Number.MAX_VALUE,
            Number.MAX_VALUE,
            -Number.MAX_VALUE,
            -Number.MAX_VALUE
        ]);
    }
    return $allTransferBounds[index];
};

/**
 * @description アトラステクスチャの転送範囲をクリア
 *              Clear the transfer range of the atlas texture
 *
 * @return {void}
 * @method
 * @protected
 */
export const $clearTransferBounds = (): void =>
{
    for (let idx = 0; idx < $transferBounds.length; ++idx) {
        const bounds = $transferBounds[idx];
        if (!bounds) {
            continue;
        }

        bounds[0] = bounds[1] = Number.MAX_VALUE;
        bounds[2] = bounds[3] = -Number.MAX_VALUE;
    }

    for (let idx = 0; idx < $allTransferBounds.length; ++idx) {
        const bounds = $allTransferBounds[idx];
        if (!bounds) {
            continue;
        }

        bounds[0] = bounds[1] = Number.MAX_VALUE;
        bounds[2] = bounds[3] = -Number.MAX_VALUE;
    }
};

/**
 * @description 現在設定されているアトラスアタッチメントオブジェクトのインデックス値
 *              Index value of the currently set atlas attachment object
 *
 * @type {number}
 * @default 0
 * @private
 */
let $currentAtlasIndex: number = 0;

/**
 * @description 現在設定されているアトラスアタッチメントオブジェクトのインデックス値をセット
 *              Set the index value of the currently set atlas attachment object
 *
 * @param  {number} index
 * @return {void}
 * @method
 * @protected
 */
export const $setCurrentAtlasIndex = (index: number): void =>
{
    $currentAtlasIndex = index;
};

/**
 * @description 現在設定されているアトラスアタッチメントオブジェクトのインデックス値を返却
 *              Returns the index value of the currently set atlas attachment object
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getCurrentAtlasIndex = (): number =>
{
    return $currentAtlasIndex;
};