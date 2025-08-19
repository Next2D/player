import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { ITextureObject } from "./interface/ITextureObject";

/**
 * @description 生成したFrameBufferの管理オブジェクトを配列にプールして再利用します。
 *              Pool the management object of the generated FrameBuffer in an array and reuse it.
 *
 * @type {array}
 * @protected
 */
export const $objectPool: IAttachmentObject[] = [];

/**
 * @description READ用のレンダーパスエンコーダー
 *              Render pass encoder for READ
 *
 * @type {GPURenderPassEncoder | null}
 * @protected
 */
export let $readRenderPassEncoder: GPURenderPassEncoder | null = null;

/**
 * @description READ用のレンダーパスエンコーダーを設定
 *              Set the render pass encoder for READ
 *
 * @param  {GPURenderPassEncoder} encoder
 * @return {void}
 * @method
 * @protected
 */
export const $setReadRenderPassEncoder = (encoder: GPURenderPassEncoder): void =>
{
    $readRenderPassEncoder = encoder;
};

/**
 * @description DRAW用のレンダーパスエンコーダー
 *              Render pass encoder for DRAW
 *
 * @type {GPURenderPassEncoder | null}
 * @protected
 */
export let $drawRenderPassEncoder: GPURenderPassEncoder | null = null;

/**
 * @description DRAW用のレンダーパスエンコーダーを設定
 *              Set the render pass encoder for DRAW
 *
 * @param  {GPURenderPassEncoder} encoder
 * @return {void}
 * @method
 * @protected
 */
export const $setDrawRenderPassEncoder = (encoder: GPURenderPassEncoder): void =>
{
    $drawRenderPassEncoder = encoder;
};

/**
 * @description アトラス用のテクスチャオブジェクト
 *              Texture object for atlas
 *
 * @type {ITextureObject | null}
 * @protected
 */
export let $atlasTextureObject: ITextureObject | null = null;

/**
 * @description アトラス用のテクスチャオブジェクトを設定
 *              Set the texture object for atlas
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
 * @description ビットマップ用のテクスチャオブジェクト
 *              Texture object for bitmap
 *
 * @type {ITextureObject | null}
 * @protected
 */
export let $bitmapTextureObject: ITextureObject | null = null;

/**
 * @description ビットマップ用のテクスチャオブジェクトを設定
 *              Set the texture object for bitmap
 *
 * @param  {ITextureObject} textureObject
 * @return {void}
 * @method
 * @protected
 */
export const $setBitmapTextureObject = (textureObject: ITextureObject): void =>
{
    $bitmapTextureObject = textureObject;
};

/**
 * @description 現在のアタッチメントオブジェクト
 *              Current attachment object
 *
 * @type {IAttachmentObject | null}
 * @protected
 */
export let $currentAttachment: IAttachmentObject | null = null;

/**
 * @description 現在のアタッチメントオブジェクトを取得
 *              Get the current attachment object
 *
 * @return {IAttachmentObject | null}
 * @method
 * @protected
 */
export const $getCurrentAttachment = (): IAttachmentObject | null =>
{
    return $currentAttachment;
};

/**
 * @description 現在のアタッチメントオブジェクトを設定
 *              Set the current attachment object
 *
 * @param  {IAttachmentObject | null} attachment
 * @return {void}
 * @method
 * @protected
 */
export const $setCurrentAttachment = (attachment: IAttachmentObject | null): void =>
{
    $currentAttachment = attachment;
};

/**
 * @description アタッチメントオブジェクトを作成
 *              Create attachment object
 *
 * @param  {number} width
 * @param  {number} height
 * @param  {ITextureObject} textureObject
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const $createAttachmentObject = (
    width: number,
    height: number,
    textureObject: ITextureObject
): IAttachmentObject =>
{
    const attachment: IAttachmentObject = $objectPool.pop() || {
        "id": 0,
        "width": 0,
        "height": 0,
        "clipLevel": 0,
        "msaa": false,
        "mask": false,
        "texture": null
    };

    attachment.id = Math.random();
    attachment.width = width;
    attachment.height = height;
    attachment.clipLevel = 0;
    attachment.msaa = false;
    attachment.mask = false;
    attachment.texture = textureObject;

    return attachment;
};

/**
 * @description アタッチメントオブジェクトをプールに戻す
 *              Return attachment object to pool
 *
 * @param  {IAttachmentObject} attachment
 * @return {void}
 * @method
 * @protected
 */
export const $poolAttachmentObject = (attachment: IAttachmentObject): void =>
{
    attachment.texture = null;
    $objectPool.push(attachment);
};

/**
 * @description レンダーターゲットを設定
 *              Set render target
 *
 * @param  {IAttachmentObject | null} attachment
 * @return {void}
 * @method
 * @protected
 */
export const $setRenderTarget = (attachment: IAttachmentObject | null): void =>
{
    $currentAttachment = attachment;
    // TODO: WebGPU版のレンダーターゲット設定実装
};

/**
 * @description レンダーターゲットをクリア
 *              Clear render target
 *
 * @param  {number} r
 * @param  {number} g
 * @param  {number} b
 * @param  {number} a
 * @return {void}
 * @method
 * @protected
 */
export const $clearRenderTarget = (_r: number, _g: number, _b: number, _a: number): void =>
{
    // TODO: WebGPU版のレンダーターゲットクリア実装
    // WebGPUではレンダーパスの作成時にクリア色を設定する
};