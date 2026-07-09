import type { IAttachmentObject } from "./interface/IAttachmentObject";

export const $objectPool: IAttachmentObject[] = [];

export let $readFrameBuffer: WebGLFramebuffer;

export const $setReadFrameBuffer = (gl: WebGL2RenderingContext): void =>
{
    $readFrameBuffer = gl.createFramebuffer() as NonNullable<WebGLFramebuffer>;
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
