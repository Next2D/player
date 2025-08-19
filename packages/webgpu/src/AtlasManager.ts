import type { Node } from "@next2d/texture-packer";
import type { ITextureObject } from "./interface/ITextureObject";

/**
 * @description アトラステクスチャオブジェクト
 *              Atlas texture object
 *
 * @type {ITextureObject | null}
 * @protected
 */
let $atlasTextureObject: ITextureObject | null = null;

/**
 * @description アトラステクスチャオブジェクトを設定
 *              Set atlas texture object
 *
 * @param  {ITextureObject} textureObject
 * @return {void}
 * @method
 * @protected
 */
export const $setAtlasTextureObject = (textureObject: ITextureObject): void =>
{
    $atlasTextureObject = textureObject;
};

/**
 * @description アトラステクスチャオブジェクトを取得
 *              Get atlas texture object
 *
 * @return {ITextureObject | null}
 * @method
 * @protected
 */
export const $getAtlasTextureObject = (): ITextureObject | null =>
{
    return $atlasTextureObject;
};

/**
 * @description ノードを作成
 *              Create node
 *
 * @param  {GPUDevice} _device
 * @param  {HTMLCanvasElement | ImageBitmap | ImageData} _source
 * @param  {number} _width
 * @param  {number} _height
 * @return {Node | null}
 * @method
 * @protected
 */
export const $createNode = (
    _device: GPUDevice,
    _source: HTMLCanvasElement | ImageBitmap | ImageData,
    _width: number,
    _height: number
): Node | null =>
{
    // TODO: WebGPU版のノード作成実装
    // WebGLからの移植が必要
    return null;
};

/**
 * @description ノードを削除
 *              Remove node
 *
 * @param  {Node} _node
 * @return {void}
 * @method
 * @protected
 */
export const $removeNode = (_node: Node): void =>
{
    // TODO: WebGPU版のノード削除実装
    // WebGLからの移植が必要
};