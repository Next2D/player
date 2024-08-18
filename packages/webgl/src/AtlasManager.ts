import type { ITextureObject } from "./interface/ITextureObject";
import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { TexturePacker } from "./AtlasManager/domain/TexturePacker";

/**
 * @description アトラステクスチャのアタッチメントオブジェクト
 *              Attachment object of atlas texture
 * 
 * @type {IAttachmentObject}
 * @private
 */
let $atlasAttachmentObject: IAttachmentObject;

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
    $atlasAttachmentObject = attachment_object;
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
    return $atlasAttachmentObject;
};

/**
 * @description 描画保管用のアトラステクスチャの配列
 *              Array of atlas textures for drawing storage
 * 
 * @type {ITextureObject[]}
 * @protected
 */
export const $atlasTextures: ITextureObject[] = [];

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
 * @description ルートノードの配列
 *              Array of root nodes
 * 
 * @type {TexturePacker[]}
 * @protected
 */
export const $rootNodes: TexturePacker[] = [];