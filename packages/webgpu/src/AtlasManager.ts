import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { TexturePacker } from "@next2d/texture-packer";

/**
 * @description テクスチャアトラス境界の初期最大値
 *              Initial maximum value for texture atlas bounds
 * @type {number}
 */
const $MAX_VALUE: number = Number.MAX_VALUE;

/**
 * @description テクスチャアトラス境界の初期最小値
 *              Initial minimum value for texture atlas bounds
 * @type {number}
 */
const $MIN_VALUE: number = -Number.MAX_VALUE;

/**
 * @description 現在アクティブなアトラスのインデックス
 *              Index of the currently active atlas
 * @type {number}
 */
let $activeAtlasIndex: number = 0;

/**
 * @description アクティブなアトラスインデックスを設定する
 *              Set the active atlas index
 * @param {number} index - アトラスインデックス / atlas index
 * @return {void}
 */
export const $setActiveAtlasIndex = (index: number): void =>
{
    $activeAtlasIndex = index;
};

/**
 * @description アクティブなアトラスインデックスを取得する
 *              Get the active atlas index
 * @return {number}
 */
export const $getActiveAtlasIndex = (): number =>
{
    return $activeAtlasIndex;
};

/**
 * @description アトラスのアタッチメントオブジェクト配列
 *              Array of atlas attachment objects
 * @type {IAttachmentObject[]}
 */
const $atlasAttachmentObjects: IAttachmentObject[] = [];

/**
 * @description アトラスのアタッチメントオブジェクト配列を取得する
 *              Get the array of atlas attachment objects
 * @return {IAttachmentObject[]}
 */
export const $getAtlasAttachmentObjects = (): IAttachmentObject[] =>
{
    return $atlasAttachmentObjects;
};

/**
 * @description アクティブなインデックスにアタッチメントオブジェクトを設定する
 *              Set an attachment object at the active atlas index
 * @param {IAttachmentObject} attachment_object - アタッチメントオブジェクト / attachment object
 * @return {void}
 */
export const $setAtlasAttachmentObject = (attachment_object: IAttachmentObject): void =>
{
    $atlasAttachmentObjects[$activeAtlasIndex] = attachment_object;
};

/**
 * @description アトラス生成関数の型定義
 *              Type definition for atlas creator function
 */
type AtlasCreator = (index: number) => IAttachmentObject;

/**
 * @description アトラス生成関数の参照
 *              Atlas creator function reference
 * @type {AtlasCreator | null}
 */
let $atlasCreator: AtlasCreator | null = null;

/**
 * @description アトラス生成関数を設定する
 *              Set the atlas creator function
 * @param {AtlasCreator} creator - アトラス生成関数 / atlas creator function
 * @return {void}
 */
export const $setAtlasCreator = (creator: AtlasCreator): void =>
{
    $atlasCreator = creator;
};

/**
 * @description アクティブなインデックスのアタッチメントオブジェクトを取得する（未作成の場合はcreatorで生成）
 *              Get the attachment object at the active index (creates via creator if not yet created)
 * @return {IAttachmentObject | null}
 */
export const $getAtlasAttachmentObject = (): IAttachmentObject | null =>
{
    let attachment = $atlasAttachmentObjects[$activeAtlasIndex];
    if (!attachment) {
        if (!$atlasCreator) {
            return null;
        }
        attachment = $atlasCreator($activeAtlasIndex);
        $setAtlasAttachmentObject(attachment);
    }
    return attachment;
};

/**
 * @description 指定インデックスのアタッチメントオブジェクトを取得する
 *              Get the attachment object at a specified index
 * @param {number} index - アトラスインデックス / atlas index
 * @return {IAttachmentObject | null}
 */
export const $getAtlasAttachmentObjectByIndex = (index: number): IAttachmentObject | null =>
{
    return $atlasAttachmentObjects[index] ?? null;
};

/**
 * @description テクスチャパッカーのルートノード配列
 *              Array of root nodes for texture packing
 * @type {TexturePacker[]}
 */
export const $rootNodes: TexturePacker[] = [];

/**
 * @description アトラスごとの転送領域配列
 *              Array of transfer bounds per atlas
 * @type {Float32Array[]}
 */
const $transferBounds: Float32Array[] = [];

/**
 * @description 指定インデックスのアクティブな転送領域を取得する（未作成の場合は初期化）
 *              Get the active transfer bounds at the specified index (initializes if not yet created)
 * @param {number} index - アトラスインデックス / atlas index
 * @return {Float32Array}
 */
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

/**
 * @description 全ての転送領域を初期値にリセットする
 *              Reset all transfer bounds to their initial values
 * @return {void}
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
};

/**
 * @description 現在処理中のアトラスインデックス
 *              Index of the currently processed atlas
 * @type {number}
 */
let $currentAtlasIndex: number = 0;

/**
 * @description 現在のアトラスインデックスを設定する
 *              Set the current atlas index
 * @param {number} index - アトラスインデックス / atlas index
 * @return {void}
 */
export const $setCurrentAtlasIndex = (index: number): void =>
{
    $currentAtlasIndex = index;
};

/**
 * @description 現在のアトラスインデックスを取得する
 *              Get the current atlas index
 * @return {number}
 */
export const $getCurrentAtlasIndex = (): number =>
{
    return $currentAtlasIndex;
};

/**
 * @description アトラスの全状態をリセットする（テクスチャリソースの破棄を含む）
 *              Reset all atlas state including destroying texture resources
 * @return {void}
 */
export const $resetAtlas = (): void =>
{
    $rootNodes.length = 0;

    $setActiveAtlasIndex(0);

    for (let idx = 0; idx < $atlasAttachmentObjects.length; idx++) {
        const attachment = $atlasAttachmentObjects[idx];
        if (!attachment) {
            continue;
        }
        if (attachment.texture) {
            attachment.texture.resource.destroy();
        }
        if (attachment.stencil) {
            attachment.stencil.resource.destroy();
        }
        if (attachment.msaaTexture) {
            attachment.msaaTexture.resource.destroy();
        }
        if (attachment.msaaStencil) {
            attachment.msaaStencil.resource.destroy();
        }
    }

    $atlasAttachmentObjects.length = 0;

    $clearTransferBounds();

    $setCurrentAtlasIndex(0);
};
