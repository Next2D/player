/**
 * @class
 */
class FrameBufferManager
{
    /**
     * @param {WebGLRenderingContext} gl
     * @param {number} samples
     * @constructor
     */
    constructor (gl, samples)
    {
        this._$gl                 = gl;
        this._$objectPool         = [];
        this._$frameBuffer        = gl.createFramebuffer();
        this._$frameBufferTexture = null;
        this._$currentAttachment  = null;
        this._$isBinding          = false;
        this._$textureManager     = new TextureManager(gl);
        this._$colorBufferPool    = null;
        this._$stencilBufferPool  = new StencilBufferPool(gl);
        this._$frameBufferTexture = gl.createFramebuffer();
        this._$colorBufferPool    = new ColorBufferPool(gl, samples);

        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this._$frameBuffer);
    }

    /**
     * @memberof FrameBufferManager#
     * @property {object}
     * @return   {object}
     * @public
     */
    get currentAttachment ()
    {
        return this._$currentAttachment;
    }

    /**
     * @param  {number}  width
     * @param  {number}  height
     * @param  {boolean} [multisample=false]
     * @param  {uint}    [samples=0]
     * @return {object}
     * @public
     */
    createCacheAttachment (width, height, multisample = false, samples = 0)
    {
        const attachment = this._$objectPool.length
            ? this._$objectPool.pop()
            : {};
        const texture = this._$textureManager.create(width, height);

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
            attachment.stencil = this._$stencilBufferPool.create(texture.width, texture.height);
        }

        attachment.mask      = false;
        attachment.clipLevel = 0;
        attachment.isActive  = true;

        return attachment;
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @return {object}
     * @public
     */
    createTextureAttachment (width, height)
    {
        const attachment = this._$objectPool.length
            ? this._$objectPool.pop()
            : {};
        const texture = this._$textureManager.create(width, height);

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
     * @return {object}
     * @public
     */
    createTextureAttachmentFrom (texture)
    {
        const attachment = this._$objectPool.length
            ? this._$objectPool.pop()
            : {};

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
     * @param  {object}  attachment
     * @param  {boolean} [shouldReleaseTexture=false]
     * @return void
     * @public
     */
    releaseAttachment (attachment, shouldReleaseTexture = false)
    {
        if (!attachment.isActive) {
            return;
        }

        if (attachment.msaa) {
            this._$colorBufferPool.release(attachment.color);
        } else if (attachment.stencil) {
            this._$stencilBufferPool.release(attachment.stencil);
        }

        if (shouldReleaseTexture) {
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
     * @return void
     * @public
     */
    bind (attachment)
    {
        this._$currentAttachment = attachment;
        if (!this._$isBinding) {
            this._$isBinding = true;
            this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER, this._$frameBuffer);
        }

        if (attachment.msaa) {
            this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER, attachment.color);
            this._$gl.framebufferRenderbuffer(
                this._$gl.FRAMEBUFFER, this._$gl.COLOR_ATTACHMENT0,
                this._$gl.RENDERBUFFER, attachment.color
            );
        } else {
            this._$textureManager.bind0(attachment.color);

            this._$gl.framebufferTexture2D(
                this._$gl.FRAMEBUFFER, this._$gl.COLOR_ATTACHMENT0,
                this._$gl.TEXTURE_2D, attachment.color, 0
            );
        }

        this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER, attachment.stencil);
        this._$gl.framebufferRenderbuffer(
            this._$gl.FRAMEBUFFER, this._$gl.STENCIL_ATTACHMENT,
            this._$gl.RENDERBUFFER, attachment.stencil
        );
    }

    /**
     * @return void
     * @public
     */
    unbind ()
    {
        this._$currentAttachment = null;
        if (this._$isBinding) {
            this._$isBinding = false;
            this._$gl.bindFramebuffer(this._$gl.FRAMEBUFFER, null);
        }
    }

    /**
     * @return {WebGLTexture}
     * @public
     */
    getTextureFromCurrentAttachment ()
    {
        if (!this._$currentAttachment.msaa) {
            return this._$currentAttachment.texture;
        }

        const width   = this._$currentAttachment.width;
        const height  = this._$currentAttachment.height;
        const texture = this._$currentAttachment.texture;
        texture.dirty = false;

        this._$gl.bindFramebuffer(this._$gl.DRAW_FRAMEBUFFER, this._$frameBufferTexture);

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
     * @param  {boolean}    [flipY=true]
     * @return {WebGLTexture}
     * @public
     */
    createTextureFromPixels (width, height, pixels = null, premultipliedAlpha = false, flipY = true)
    {
        return this._$textureManager.create(width, height, pixels, premultipliedAlpha, flipY);
    }

    /**
     * @param  {HTMLCanvasElement} canvas
     * @return {WebGLTexture}
     * @public
     */
    createTextureFromCanvas (canvas)
    {
        return this._$textureManager.createFromCanvas(canvas);
    }

    /**
     * @param  {HTMLImageElement} image
     * @param  {boolean} [smoothing=false]
     * @return {WebGLTexture}
     * @public
     */
    createTextureFromImage (image, smoothing = false)
    {
        return this._$textureManager.createFromImage(image, smoothing);
    }

    /**
     * @param  {number}     width
     * @param  {number}     height
     * @param  {Uint8Array} pixels
     * @return {WebGLTexture}
     * @public
     */
    createAlphaTextureFromPixels (width, height, pixels)
    {
        return this._$textureManager.createAlpha(width, height, pixels);
    }

    /**
     * @param  {HTMLVideoElement} video
     * @param  {boolean} [smoothing=false]
     * @param  {WebGLTexture} [target_texture=null]
     * @return {WebGLTexture}
     * @public
     */
    createTextureFromVideo (video, smoothing = false, target_texture = null)
    {
        return this._$textureManager.createFromVideo(video, smoothing, target_texture);
    }

    /**
     * @return {WebGLTexture}
     * @public
     */
    createTextureFromCurrentAttachment ()
    {
        const width   = this._$currentAttachment.width;
        const height  = this._$currentAttachment.height;
        const texture = this._$textureManager.create(width, height);

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
    releaseTexture (texture)
    {
        this._$textureManager.release(texture);
    }

}