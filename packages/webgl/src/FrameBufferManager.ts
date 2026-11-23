import type { IAttachmentObject } from "./interface/IAttachmentObject";

export const $objectPool: IAttachmentObject[] = [];

export let $readFrameBuffer: WebGLFramebuffer;

export const $setReadFrameBuffer = (gl: WebGL2RenderingContext): void =>
{
    $readFrameBuffer = gl.createFramebuffer() as NonNullable<WebGLFramebuffer>;
    $attachedColor   = null;
    $attachedStencil = null;
};

/**
 * @description $readFrameBuffer の COLOR_ATTACHMENT0 に現在アタッチしているリソース
 *              (WebGLRenderbuffer または WebGLTexture)。同じものの付け直しを省くために覚えておく。
 *              $readFrameBuffer のアタッチメントを変えるのは
 *              FrameBufferManagerBindAttachmentObjectService だけ。
 *              The resource currently attached to COLOR_ATTACHMENT0 of $readFrameBuffer, kept so that
 *              re-attaching the same one can be skipped.
 *
 * @type {WebGLRenderbuffer | WebGLTexture | null}
 * @protected
 */
export let $attachedColor: WebGLRenderbuffer | WebGLTexture | null = null;

/**
 * @description $attachedColor を更新
 *              Update $attachedColor
 *
 * @param  {WebGLRenderbuffer | WebGLTexture | null} resource
 * @return {void}
 * @method
 * @protected
 */
export const $setAttachedColor = (resource: WebGLRenderbuffer | WebGLTexture | null): void =>
{
    $attachedColor = resource;
};

/**
 * @description $readFrameBuffer の STENCIL_ATTACHMENT に現在アタッチしている WebGLRenderbuffer
 *              The WebGLRenderbuffer currently attached to STENCIL_ATTACHMENT of $readFrameBuffer
 *
 * @type {WebGLRenderbuffer | null}
 * @protected
 */
export let $attachedStencil: WebGLRenderbuffer | null = null;

/**
 * @description $attachedStencil を更新
 *              Update $attachedStencil
 *
 * @param  {WebGLRenderbuffer | null} resource
 * @return {void}
 * @method
 * @protected
 */
export const $setAttachedStencil = (resource: WebGLRenderbuffer | null): void =>
{
    $attachedStencil = resource;
};

export let $drawFrameBuffer: WebGLFramebuffer | null = null;

export const $setDrawFrameBuffer = (gl: WebGL2RenderingContext): void =>
{
    $drawFrameBuffer = gl.createFramebuffer() as NonNullable<WebGLFramebuffer>;
};

export let $atlasFrameBuffer: WebGLFramebuffer | null = null;

export const $setAtlasFrameBuffer = (
    gl: WebGL2RenderingContext
): void => {

    // アトラスはTEXTURE_2D_ARRAYになったため、カラーアタッチメントは
    // 解決(blit)時に framebufferTextureLayer で対象レイヤーを都度アタッチする
    $atlasFrameBuffer = gl.createFramebuffer() as NonNullable<WebGLFramebuffer>;
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, $atlasFrameBuffer);
};

export let $currentAttachment: IAttachmentObject | null = null;

export const $setCurrentAttachment = (attachment_object: IAttachmentObject | null): void =>
{
    $currentAttachment = attachment_object;
};

/**
 * @description GL のフレームバッファに実際に付いているアタッチメントオブジェクト。
 *              通常は $currentAttachment と同じ。$attachmentDeferred が true の間だけ違う。
 *              The attachment object actually attached to the GL framebuffer. Normally the same as
 *              $currentAttachment; they differ only while $attachmentDeferred is true.
 *
 * @type {IAttachmentObject | null}
 * @public
 */
export let $physicalAttachment: IAttachmentObject | null = null;

/**
 * @param  {IAttachmentObject | null} attachment_object
 * @return {void}
 * @method
 * @public
 */
export const $setPhysicalAttachment = (attachment_object: IAttachmentObject | null): void =>
{
    $physicalAttachment = attachment_object;
};

/**
 * @description 描画先の切り替えを保留しているかどうか。true の間、$currentAttachment (とビューポートの
 *              大きさ) は切り替え後の値だが、GL のフレームバッファは $physicalAttachment のまま。
 *              GL で描く前に ContextSyncAttachmentUseCase で実際に切り替える。
 *              Whether a render target switch is pending. While true, $currentAttachment (and the
 *              viewport size) already hold the new target but the GL framebuffer still has
 *              $physicalAttachment. ContextSyncAttachmentUseCase performs the switch before
 *              anything is drawn with GL.
 *
 * @type {boolean}
 * @public
 */
export let $attachmentDeferred: boolean = false;

/**
 * @param  {boolean} state
 * @return {void}
 * @method
 * @public
 */
export const $setAttachmentDeferred = (state: boolean): void =>
{
    $attachmentDeferred = state;
};

export let $isFramebufferBound: boolean = false;

export const $setFramebufferBound = (state: boolean): void =>
{
    $isFramebufferBound = state;
};

export let $readBitmapFramebuffer: WebGLFramebuffer | null = null;

export let $drawBitmapFramebuffer: WebGLFramebuffer | null = null;

export let $pixelFrameBuffer: WebGLFramebuffer | null = null;

export let $pixelBufferObject: WebGLBuffer | null = null;

export const $setBitmapFrameBuffer = (gl: WebGL2RenderingContext): void =>
{
    // blitFramebuffer
    $drawBitmapFramebuffer = gl.createFramebuffer() as NonNullable<WebGLFramebuffer>;
    $readBitmapFramebuffer = gl.createFramebuffer() as NonNullable<WebGLFramebuffer>;

    // PBO
    $pixelFrameBuffer  = gl.createFramebuffer() as NonNullable<WebGLFramebuffer>;
    $pixelBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, $pixelBufferObject);
};
