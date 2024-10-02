import type { IAttachmentObject } from "./interface/IAttachmentObject";
import { $getAtlasTextureObject } from "./AtlasManager";

/**
 * @description 生成したFrameBufferの管理オブジェクトを配列にプールして再利用します。
 *              Pool the management object of the generated FrameBuffer in an array and reuse it.
 *
 * @type {array}
 * @protected
 */
export const $objectPool: IAttachmentObject[] = [];

/**
 * @description READ_FRAMEBUFFER専用のFrameBufferオブジェクト
 *              FrameBuffer object for READ_FRAMEBUFFER only
 *
 * @class
 * @public
 */
export let $readFrameBuffer: WebGLFramebuffer;

/**
 * @description READ_FRAMEBUFFER専用のFrameBufferオブジェクトを設定
 *              Set the FrameBuffer object for READ_FRAMEBUFFER only
 *
 * @param  {WebGL2RenderingContext} gl
 * @return {void}
 * @method
 * @protected
 */
export const $setReadFrameBuffer = (gl: WebGL2RenderingContext): void =>
{
    $readFrameBuffer = gl.createFramebuffer() as NonNullable<WebGLFramebuffer>;
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, $readFrameBuffer);
};

/**
 * @description DRAW_FRAMEBUFFER専用のFrameBufferオブジェクト
 *              FrameBuffer object for DRAW_FRAMEBUFFER only
 *
 * @class
 * @public
 */
export let $drawFrameBuffer: WebGLFramebuffer | null = null;

/**
 * @description DRAW_FRAMEBUFFER専用のFrameBufferオブジェクトを設定
 *              Set the FrameBuffer object for DRAW_FRAMEBUFFER only
 *
 * @param  {WebGL2RenderingContext} gl
 * @return {void}
 * @method
 * @protected
 */
export const $setDrawFrameBuffer = (gl: WebGL2RenderingContext): void =>
{
    $drawFrameBuffer = gl.createFramebuffer() as NonNullable<WebGLFramebuffer>;
};

/**
 * @description アトラス専用のFrameBufferオブジェクト
 *              FrameBuffer object for atlas only
 *
 * @class
 * @public
 */
export let $atlasFrameBuffer: WebGLFramebuffer | null = null;

/**
 * @description アトラス専用のFrameBufferオブジェクトを設定
 *              Set the FrameBuffer object for atlas only
 *
 * @param  {WebGL2RenderingContext} gl
 * @return {void}
 * @method
 * @protected
 */
export const $setAtlasFrameBuffer = (gl: WebGL2RenderingContext): void =>
{
    $atlasFrameBuffer = gl.createFramebuffer() as NonNullable<WebGLFramebuffer>;
    gl.bindFramebuffer(gl.FRAMEBUFFER, $atlasFrameBuffer);

    const textureObject = $getAtlasTextureObject();

    gl.framebufferTexture2D(
        gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D, textureObject.resource, 0
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, $atlasFrameBuffer);
};

/**
 * @description 現在アタッチされてるAttachmentObject
 *              Currently attached AttachmentObject
 *
 * @type {IAttachmentObject|null}
 * @private
 */
let $currentAttachment: IAttachmentObject | null = null;

/**
 * @description 現在アタッチされてるAttachmentObjectを設定
 *              Set the currently attached AttachmentObject
 *
 * @param  {IAttachmentObject | null} attachment_object
 * @return {void}
 * @method
 * @protected
 */
export const $setCurrentAttachment = (attachment_object: IAttachmentObject | null): void =>
{
    $currentAttachment = attachment_object;
};

/**
 * @description 現在アタッチされてるAttachmentObjectを返却
 *              Returns the currently attached AttachmentObject
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
 * @description FrameBufferがバインドされているかどうかのフラグ
 *              Flag to check if FrameBuffer is bound
 *
 * @type {boolean}
 * @protected
 */
let $isFramebufferBound: boolean = false;

/**
 * @description FrameBufferがバインドされているかどうかのフラグの値を更新
 *              Update the value of the flag to check if FrameBuffer is bound
 *
 * @param {boolean} state
 * @return {void}
 * @method
 * @protected
 */
export const $setFramebufferBound = (state: boolean): void =>
{
    $isFramebufferBound = state;
};

/**
 * @description FrameBufferがバインドされているかどうかのフラグの値を返却
 *              Returns the value of the flag to check if FrameBuffer is bound
 *
 * @return {boolean}
 * @method
 * @protected
 */
export const $useFramebufferBound = (): boolean =>
{
    return $isFramebufferBound;
};

/**
 * @description ビットマップの読み込み専用のFrameBufferオブジェクト
 *              FrameBuffer object for reading bitmaps only
 * 
 * @type {WebGLFramebuffer|null}
 * @default null
 * @private
 */
let $readBitmapFramebuffer: WebGLFramebuffer | null = null;

/**
 * @description ビットマップの書き込み専用のFrameBufferオブジェクト
 *              FrameBuffer object for writing bitmaps only
 * 
 * @type {WebGLFramebuffer|null}
 * @default null
 * @private
 */
let $drawBitmapFramebuffer: WebGLFramebuffer | null = null;

/**
 * @description ビットマップの読み込み専用のFrameBufferオブジェクトを設定
 *              Set the FrameBuffer object for reading bitmaps only
 *
 * @param  {WebGL2RenderingContext} gl
 * @return {void}
 * @method
 * @protected
 */
export const $setBitmapFrameBuffer = (gl: WebGL2RenderingContext): void =>
{
    $drawBitmapFramebuffer = gl.createFramebuffer() as NonNullable<WebGLFramebuffer>;
    $readBitmapFramebuffer = gl.createFramebuffer() as NonNullable<WebGLFramebuffer>;
};

/**
 * @description ビットマップの読み込み専用のFrameBufferオブジェクトを返却
 *              Returns the FrameBuffer object for reading bitmaps only
 *
 * @return {WebGLFramebuffer}
 * @method
 * @protected
 */
export const $getReadBitmapFrameBuffer = (): WebGLFramebuffer =>
{
    return $readBitmapFramebuffer as NonNullable<WebGLFramebuffer>;
};

/**
 * @description ビットマップの書き込み専用のFrameBufferオブジェクトを返却
 *              Returns the FrameBuffer object for writing bitmaps only
 *
 * @return {WebGLFramebuffer}
 * @method
 * @protected
 */
export const $getDrawBitmapFrameBuffer = (): WebGLFramebuffer =>
{
    return $drawBitmapFramebuffer as NonNullable<WebGLFramebuffer>;
};