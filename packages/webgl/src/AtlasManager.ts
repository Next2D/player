import type { ICachePosition } from "./interface/ICachePosition";
import type { IGrid } from "./interface/IGrid";
import type { ITextureObject } from "./interface/ITextureObject";
import type { IAttachmentObject } from "./interface/IAttachmentObject";

/**
 * @description アトラステクスチャのアタッチメントオブジェクト
 *              Attachment object of atlas texture
 * 
 * @type {IAttachmentObject}
 * @protected
 */
export let $atlasAttachmentObject: IAttachmentObject;

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
 * @description 描画保管用のアトラステクスチャの配列
 *              Array of atlas textures for drawing storage
 * 
 * @type {ITextureObject[]}
 * @protected
 */
export let $atlasTextures: ITextureObject[] = [];

/**
 * @description アトラステクスチャのノードの配列
 *              Array of nodes of atlas textures
 * 
 * @type {Map}
 * @protected
 */
export const $atlasNodes: Map<number, IGrid[]> = new Map();

/**
 * @description アトラステクスチャにキャッシュした座標配列
 *              Array of cached coordinates in atlas textures
 * 
 * @type {Map}
 * @protected
 */
export const $atlasCacheMap: Map<number, ICachePosition[]> = new Map();