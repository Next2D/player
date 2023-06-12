import { TextureManager } from "./TextureManager";
import { StencilBufferPool } from "./StencilBufferPool";
import { ColorBufferPool } from "./ColorBufferPool";
import type { AttachmentImpl } from "../interface/AttachmentImpl";

/**
 * @class
 */
export class FrameBufferManager
{
    private _$gl: WebGL2RenderingContext;
    private _$objectPool: AttachmentImpl[];
    private readonly _$frameBuffer: WebGLFramebuffer | null;
    private readonly _$frameBufferTexture: WebGLFramebuffer | null;
    private _$currentAttachment: AttachmentImpl | null;
    private _$isBinding: boolean;
    private readonly _$textureManager: TextureManager;
    private readonly _$stencilBufferPool: StencilBufferPool;
    private readonly _$colorBufferPool: ColorBufferPool;

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {number} samples
     * @constructor
     */
    constructor (gl: WebGL2RenderingContext, samples: number)
    {
        /**
         * @type {WebGL2RenderingContext}
         * @private
         */
        this._$gl = gl;

        /**
         * @type {array}
         * @private
         */
        this._$objectPool = [];

        /**
         * @type {WebGLFramebuffer}
         * @private
         */
        this._$frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this._$frameBuffer);

        /**
         * @type {WebGLFramebuffer}
         * @private
         */
        this._$frameBufferTexture = gl.createFramebuffer();

        /**
         * @type {AttachmentImpl}
         * @default null
         * @private
         */
        this._$currentAttachment = null;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isBinding = false;

        /**
         * @type {TextureManager}
         * @private
         */
        this._$textureManager = new TextureManager(gl);

        /**
         * @type {StencilBufferPool}
         * @private
         */
        this._$stencilBufferPool = new StencilBufferPool(gl);

        /**
         * @type {ColorBufferPool}
         * @private
         */
        this._$colorBufferPool = new ColorBufferPool(gl, samples);
    }

    /**
     * @member {AttachmentImpl|null}
     * @readonly
     * @public
     */
    get currentAttachment (): AttachmentImpl|null
    {
        return this._$currentAttachment;
    }

    /**
     * @member {TextureManager}
     * @readonly
     * @public
     */
    get textureManager (): TextureManager
    {
        return this._$textureManager;
    }

    /**
     * @param  {number}  width
     * @param  {number}  height
     * @param  {boolean} [multisample=false]
     * @param  {number}  [samples=0]
     * @return {AttachmentImpl}
     * @method
     * @public
     */
    createCacheAttachment (
        width: number, height: number,
        multisample: boolean = false, samples: number = 0
    ): AttachmentImpl {

        const attachment: AttachmentImpl = this._$objectPool.pop() || {
            "width": 0,
            "height": 0,
            "color": null,
            "texture": null,
            "msaa": false,
            "stencil": null,
            "mask": false,
            "clipLevel": 0,
            "isActive": false
        };

        const texture: WebGLTexture = this._$textureManager.create(width, height);

        attachment.width  = width;
        attachment.height = height;

        if (multisample) {
            attachment.color   = this._$colorBufferPool.create(width, height, samples);
            attachment.texture = texture;
            attachment.msaa    = true;
            attachment.stencil = attachment.color.stencil;
        } else {
            attachment.color   = texture;
            attachment.texture = texture;
            attachment.msaa    = false;
            attachment.stencil = this._$stencilBufferPool.create(width, height);
        }

        attachment.mask      = false;
        attachment.clipLevel = 0;
        attachment.isActive  = true;

        return attachment;
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    setMaxSize (width: number, height: number): void
    {
        this._$stencilBufferPool._$maxWidth  = width;
        this._$stencilBufferPool._$maxHeight = height;
        this._$textureManager._$maxWidth     = width;
        this._$textureManager._$maxHeight    = height;
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @return {AttachmentImpl}
     * @method
     * @public
     */
    createTextureAttachment (
        width: number, height: number
    ): AttachmentImpl {

        const attachment: AttachmentImpl = this._$objectPool.pop() || {
            "width": 0,
            "height": 0,
            "color": null,
            "texture": null,
            "msaa": false,
            "stencil": null,
            "mask": false,
            "clipLevel": 0,
            "isActive": false
        };

        const texture: WebGLTexture = this._$textureManager.create(width, height);

        attachment.width     = width;
        attachment.height    = height;
        attachment.color     = texture;
        attachment.texture   = texture;
        attachment.msaa      = false;
        attachment.stencil   = null;
        attachment.mask      = false;
        attachment.clipLevel = 0;
        attachment.isActive  = true;

        return attachment;
    }

    /**
     * @param  {WebGLTexture} texture
     * @return {AttachmentImpl}
     * @method
     * @public
     */
    createTextureAttachmentFrom (texture: WebGLTexture): AttachmentImpl
    {
        const attachment: AttachmentImpl = this._$objectPool.pop() || {
            "width": 0,
            "height": 0,
            "color": null,
            "texture": null,
            "msaa": false,
            "stencil": null,
            "mask": false,
            "clipLevel": 0,
            "isActive": true
        };

        attachment.width     = texture.width;
        attachment.height    = texture.height;
        attachment.color     = texture;
        attachment.texture   = texture;
        attachment.msaa      = false;
        attachment.stencil   = null;
        attachment.mask      = false;
        attachment.clipLevel = 0;
        attachment.isActive  = true;

        return attachment;
    }

    /**
     * @param  {AttachmentImpl} [attachment = null]
     * @param  {boolean} [should_release_texture=false]
     * @return {void}
     * @method
     * @public
     */
    releaseAttachment (
        attachment: AttachmentImpl | null = null,
        should_release_texture: boolean = false
    ): void {

        if (!attachment || !attachment.isActive) {
            return;
        }

        if (attachment.msaa) {
            if (attachment.color instanceof WebGLRenderbuffer) {
                this._$colorBufferPool.release(attachment.color);
            }
        } else if (attachment.stencil) {
            this._$stencilBufferPool.release(attachment.stencil);
        }

        if (should_release_texture && attachment.texture) {
            this._$textureManager.release(attachment.texture);
        }

        attachment.color    = null;
        attachment.texture  = null;
        attachment.stencil  = null;
        attachment.isActive = false;

        this._$objectPool.push(attachment);
    }

    /**
     * @param  {object} attachment
     * @return {void}
     * @method
     * @public
     */
    bind (attachment: AttachmentImpl): void
    {
        this._$currentAttachment = attachment;
        if (!this._$isBinding) {
            this._$isBinding = true;
            this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER, this._$frameBuffer);
        }

        if (attachment.msaa) {
            if (attachment.color instanceof WebGLRenderbuffer) {
                this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER, attachment.color);
                this._$gl.framebufferRenderbuffer(
                    this._$gl.FRAMEBUFFER, this._$gl.COLOR_ATTACHMENT0,
                    this._$gl.RENDERBUFFER, attachment.color
                );
            }
        } else {

            if (attachment.color instanceof WebGLTexture) {

                if (attachment.color) {
                    this._$textureManager.bind0(attachment.color);
                }

                this._$gl.framebufferTexture2D(
                    this._$gl.FRAMEBUFFER, this._$gl.COLOR_ATTACHMENT0,
                    this._$gl.TEXTURE_2D, attachment.color, 0
                );
            }
        }

        this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER, attachment.stencil);
        this._$gl.framebufferRenderbuffer(
            this._$gl.FRAMEBUFFER, this._$gl.STENCIL_ATTACHMENT,
            this._$gl.RENDERBUFFER, attachment.stencil
        );
    }

    /**
     * @return void
     * @method
     * @public
     */
    unbind (): void
    {
        this._$currentAttachment = null;
        if (this._$isBinding) {
            this._$isBinding = false;
            this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER, null);
        }
    }

    /**
     * @return {WebGLTexture}
     * @method
     * @public
     */
    getTextureFromCurrentAttachment (): WebGLTexture
    {
        if (!this._$currentAttachment) {
            throw new Error("the current attachment is null.");
        }

        if (!this._$currentAttachment.msaa
            && this._$currentAttachment.texture
        ) {
            return this._$currentAttachment.texture;
        }

        const width: number   = this._$currentAttachment.width;
        const height: number  = this._$currentAttachment.height;

        const texture: WebGLTexture|null = this._$currentAttachment.texture;
        if (!texture) {
            throw new Error("the texture is null.");
        }

        texture.dirty = false;

        this._$gl.bindFramebuffer(
            this._$gl.DRAW_FRAMEBUFFER,
            this._$frameBufferTexture
        );

        this._$textureManager.bind0(texture);

        this._$gl.framebufferTexture2D(
            this._$gl.FRAMEBUFFER, this._$gl.COLOR_ATTACHMENT0,
            this._$gl.TEXTURE_2D, texture, 0
        );

        this._$gl.blitFramebuffer(
            0, 0, width, height,
            0, 0, width, height,
            this._$gl.COLOR_BUFFER_BIT,
            this._$gl.NEAREST
        );

        this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER, this._$frameBuffer);

        return texture;
    }

    /**
     * @param  {number}     width
     * @param  {number}     height
     * @param  {Uint8Array} [pixels=null]
     * @param  {boolean}    [premultipliedAlpha=false]
     * @param  {boolean}    [flip_y=true]
     * @return {WebGLTexture}
     * @public
     */
    createTextureFromPixels (
        width: number, height: number,
        pixels: Uint8Array|null = null,
        premultipliedAlpha: boolean = false,
        flip_y: boolean = true
    ): WebGLTexture {
        return this
            ._$textureManager
            .create(width, height, pixels, premultipliedAlpha, flip_y);
    }

    /**
     * @param  {HTMLCanvasElement} canvas
     * @return {WebGLTexture}
     * @public
     */
    createTextureFromCanvas (canvas: HTMLCanvasElement): WebGLTexture
    {
        return this
            ._$textureManager
            .createFromCanvas(canvas);
    }

    /**
     * @param  {HTMLImageElement} image
     * @param  {boolean} [smoothing=false]
     * @return {WebGLTexture}
     * @public
     */
    createTextureFromImage (
        image: HTMLImageElement,
        smoothing: boolean = false
    ): WebGLTexture {
        return this
            ._$textureManager
            .createFromImage(image, smoothing);
    }

    /**
     * @param  {HTMLVideoElement} video
     * @param  {boolean} [smoothing=false]
     * @return {WebGLTexture}
     * @public
     */
    createTextureFromVideo (
        video: HTMLVideoElement,
        smoothing: boolean = false
    ): WebGLTexture {
        return this
            ._$textureManager
            .createFromVideo(video, smoothing);
    }

    /**
     * @return {WebGLTexture}
     * @public
     */
    createTextureFromCurrentAttachment (): WebGLTexture
    {
        if (!this._$currentAttachment) {
            throw new Error("the current attachment is null.");
        }

        const width: number  = this._$currentAttachment.width;
        const height: number = this._$currentAttachment.height;

        const texture: WebGLTexture = this._$textureManager.create(width, height);

        this._$textureManager.bind0(texture);

        this._$gl.copyTexSubImage2D(
            this._$gl.TEXTURE_2D, 0,
            0, 0, 0, 0, width, height
        );

        return texture;
    }

    /**
     * @param  {WebGLTexture} texture
     * @return void
     * @public
     */
    releaseTexture (texture: WebGLTexture): void
    {
        this._$textureManager.release(texture);
    }

}