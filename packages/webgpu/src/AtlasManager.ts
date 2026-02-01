import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { ITextureObject } from "./interface/ITextureObject";
import type { TexturePacker } from "@next2d/texture-packer";

/**
 * @description 最大値定数（パフォーマンス最適化のためキャッシュ）
 *              Maximum value constants (cached for performance optimization)
 *
 * @type {number}
 * @private
 * @const
 */
const $MAX_VALUE: number = Number.MAX_VALUE;
const $MIN_VALUE: number = -Number.MAX_VALUE;

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
 * @description アトラス生成関数の型
 *              Type of atlas creation function
 */
type AtlasCreator = (index: number) => IAttachmentObject;

/**
 * @description アトラス生成関数
 *              Atlas creation function
 *
 * @type {AtlasCreator | null}
 * @private
 */
let $atlasCreator: AtlasCreator | null = null;

/**
 * @description アトラス生成関数を登録
 *              Register atlas creation function
 *
 * @param  {AtlasCreator} creator
 * @return {void}
 * @method
 * @protected
 */
export const $setAtlasCreator = (creator: AtlasCreator): void =>
{
    $atlasCreator = creator;
};

/**
 * @description アトラステクスチャオブジェクトを返却
 *              Return the atlas texture object
 *
 * @returns {IAttachmentObject | null}
 * @method
 * @protected
 */
export const $getAtlasAttachmentObject = (): IAttachmentObject | null =>
{
    if (!($activeAtlasIndex in $atlasAttachmentObjects)) {
        // アトラスが存在しない場合は自動生成
        if ($atlasCreator) {
            const attachment = $atlasCreator($activeAtlasIndex);
            $setAtlasAttachmentObject(attachment);
        } else {
            return null;
        }
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
 * @description アトラステクスチャオブジェクトをセット
 *              Set the atlas texture object
 *
 * @param  {ITextureObject | null} texture_object
 * @return {void}
 * @method
 * @protected
 */
export const $setAtlasTexture = (texture_object: ITextureObject | null): void =>
{
    $atlasTexture = texture_object;
};

/**
 * @description アトラステクスチャオブジェクトを返却
 *              Return the atlas texture object
 *
 * @return {ITextureObject | null}
 * @method
 * @protected
 */
export const $getAtlasTexture = (): ITextureObject | null =>
{
    return $atlasTexture;
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
            $MAX_VALUE,
            $MAX_VALUE,
            $MIN_VALUE,
            $MIN_VALUE
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
            $MAX_VALUE,
            $MAX_VALUE,
            $MIN_VALUE,
            $MIN_VALUE
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

        bounds[0] = bounds[1] = $MAX_VALUE;
        bounds[2] = bounds[3] = $MIN_VALUE;
    }

    for (let idx = 0; idx < $allTransferBounds.length; ++idx) {
        const bounds = $allTransferBounds[idx];
        if (!bounds) {
            continue;
        }

        bounds[0] = bounds[1] = $MAX_VALUE;
        bounds[2] = bounds[3] = $MIN_VALUE;
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

/**
 * @description アトラス専用の座標マップ、フレームバッファをリセット
 *              Reset the coordinate map and frame buffer dedicated to the atlas
 *
 * @return {void}
 * @method
 * @protected
 */
export const $resetAtlas = (): void =>
{
    // ルートノードをリセット
    $rootNodes.length = 0;

    // アクティブインデックスをリセット
    $setActiveAtlasIndex(0);

    // アトラスアタッチメントオブジェクトのGPUリソースを解放（WebGL版と同じ）
    for (let idx = 0; idx < $atlasAttachmentObjects.length; idx++) {
        const attachment = $atlasAttachmentObjects[idx];
        if (!attachment) {
            continue;
        }
        // テクスチャリソースを破棄
        if (attachment.texture) {
            attachment.texture.resource.destroy();
        }
        // ステンシルリソースを破棄
        if (attachment.stencil) {
            attachment.stencil.resource.destroy();
        }
        // MSAAテクスチャを破棄
        if (attachment.msaaTexture) {
            attachment.msaaTexture.resource.destroy();
        }
        // MSAAステンシルを破棄
        if (attachment.msaaStencil) {
            attachment.msaaStencil.resource.destroy();
        }
    }

    // アトラスアタッチメントオブジェクトをリセット
    $atlasAttachmentObjects.length = 0;

    // 転送範囲をクリア
    $clearTransferBounds();

    // 現在のアトラスインデックスもリセット
    $setCurrentAtlasIndex(0);
};
