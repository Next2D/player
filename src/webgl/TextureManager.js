/**
 * @class
 */
class TextureManager
{
    /**
     * @param {WebGLRenderingContext} gl
     * @param {boolean}               isWebGL2Context
     * @constructor
     */
    constructor (gl, isWebGL2Context)
    {
        this._$gl              = gl;
        this._$isWebGL2Context = isWebGL2Context;
        this._$objectPool      = [];
        this._$objectPoolArea  = 0;
        this._$activeTexture   = -1;
        this._$boundTextures   = [null, null, null];
        this._$maxWidth        = 0;
        this._$maxHeight       = 0;

        this._$gl.pixelStorei(this._$gl.UNPACK_ALIGNMENT, 1);
        this._$gl.pixelStorei(this._$gl.UNPACK_FLIP_Y_WEBGL, true);
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @return {WebGLTexture}
     * @private
     */
    _$createTexture (width, height)
    {
        const texture = this._$gl.createTexture();

        texture.width     = 0;
        texture.height    = 0;
        texture.area      = 0;
        texture.dirty     = true;
        texture.smoothing = true;
        texture._$offsetX = 0;
        texture._$offsetY = 0;

        this.bind0(texture, false);

        this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_WRAP_S, this._$gl.CLAMP_TO_EDGE);
        this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_WRAP_T, this._$gl.CLAMP_TO_EDGE);

        if (this._$isWebGL2Context) {
            texture.width  = width;
            texture.height = height;
            texture.area   = width * height;
            texture.dirty  = false;
            this._$gl.texStorage2D(this._$gl.TEXTURE_2D, 1, this._$gl.RGBA8, width, height);
        }

        return texture;
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @return {WebGLTexture}
     * @private
     */
    _$getTexture (width, height)
    {
        // プールに同じサイズのテクスチャがあれば、それを使い回す
        for (let i = 0; i < this._$objectPool.length; i++) {
            const texture = this._$objectPool[i];
            if (texture.width === width && texture.height === height) {
                this._$objectPool.splice(i, 1);
                this._$objectPoolArea -= texture.area;

                this.bind0(texture, false);

                return texture;
            }
        }

        return this._$createTexture(width, height);
    }

    /**
     * @param  {number}     width
     * @param  {number}     height
     * @param  {Uint8Array} pixels
     * @return {WebGLTexture}
     * @public
     */
    createAlpha (width, height, pixels)
    {
        if (!this._$alphaTexture) {
            this._$alphaTexture = this._$gl.createTexture();

            this.bind0(this._$alphaTexture);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_WRAP_S, this._$gl.CLAMP_TO_EDGE);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_WRAP_T, this._$gl.CLAMP_TO_EDGE);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MIN_FILTER, this._$gl.NEAREST);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MAG_FILTER, this._$gl.NEAREST);
        } else {

            this.bind0(this._$alphaTexture);

        }

        this._$alphaTexture.width  = width;
        this._$alphaTexture.height = height;
        this._$alphaTexture.dirty  = false;

        this._$gl.texImage2D(
            this._$gl.TEXTURE_2D, 0, this._$gl.ALPHA, width, height,
            0, this._$gl.ALPHA, this._$gl.UNSIGNED_BYTE, pixels
        );

        return this._$alphaTexture;
    }

    /**
     * @param  {number}     width
     * @param  {number}     height
     * @param  {Uint8Array} [pixels=null]
     * @param  {boolean}    [premultipliedAlpha=false]
     * @param  {boolean}    [flipY=true]
     * @return {WebGLTexture}
     */
    create (width, height, pixels = null, premultipliedAlpha = false, flipY = true)
    {
        const texture = this._$getTexture(width, height);

        if (premultipliedAlpha) {
            this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        }

        if (!flipY) {
            this._$gl.pixelStorei(this._$gl.UNPACK_FLIP_Y_WEBGL, false);
        }

        if (texture.width !== width || texture.height !== height) {
            texture.width  = width;
            texture.height = height;
            texture.area   = width * height;
            texture.dirty  = false;

            this._$gl.texImage2D(
                this._$gl.TEXTURE_2D, 0, this._$gl.RGBA, width, height,
                0, this._$gl.RGBA, this._$gl.UNSIGNED_BYTE, pixels
            );
        } else if (pixels) {
            texture.dirty = false;

            this._$gl.texSubImage2D(
                this._$gl.TEXTURE_2D, 0, 0, 0, width, height,
                this._$gl.RGBA, this._$gl.UNSIGNED_BYTE, pixels
            );
        }

        if (premultipliedAlpha) {
            this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        }

        if (!flipY) {
            this._$gl.pixelStorei(this._$gl.UNPACK_FLIP_Y_WEBGL, true);
        }

        return texture;
    }

    /**
     * @param  {HTMLImageElement} image
     * @return {WebGLTexture}
     * @public
     */
    createFromImage (image)
    {
        return this._$createFromElement(image.width, image.height, image, false, null);
    }

    /**
     * @param  {HTMLCanvasElement} canvas
     * @return {WebGLTexture}
     */
    createFromCanvas (canvas)
    {
        return this._$createFromElement(canvas.width, canvas.height, canvas, false, null);
    }

    /**
     * @param  {HTMLVideoElement} video
     * @param  {boolean} [smoothing=false]
     * @param  {WebGLTexture} [target_texture=null]
     * @return {WebGLTexture}
     */
    createFromVideo (video, smoothing = false, target_texture = null)
    {
        return this._$createFromElement(video.videoWidth, video.videoHeight, video, smoothing, target_texture);
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @param  {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} element
     * @param  {boolean} [smoothing=false]
     * @param  {WebGLTexture} [target_texture=null]
     * @return {WebGLTexture}
     * @private
     */
    _$createFromElement (width, height, element, smoothing = false, target_texture = null)
    {
        const texture = target_texture || this._$getTexture(width, height);

        texture.dirty = false;
        this.bind0(texture, smoothing);

        this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

        if (texture.width !== width || texture.height !== height) {
            texture.width  = width;
            texture.height = height;
            texture.area   = width * height;

            this._$gl.texImage2D(
                this._$gl.TEXTURE_2D, 0, this._$gl.RGBA,
                this._$gl.RGBA, this._$gl.UNSIGNED_BYTE, element
            );
        } else {
            this._$gl.texSubImage2D(
                this._$gl.TEXTURE_2D, 0, 0, 0,
                this._$gl.RGBA, this._$gl.UNSIGNED_BYTE, element
            );
        }

        this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

        return texture;
    }

    /**
     * @param  {WebGLTexture} texture
     * @return void
     */
    release (texture)
    {
        // テクスチャのサイズが非常に大きい場合はプールしない
        if (texture.area > this._$maxWidth * this._$maxHeight * 2 | 0) {
            this._$gl.deleteTexture(texture);
            return;
        }

        texture.dirty = true;
        this._$objectPool.push(texture);
        this._$objectPoolArea += texture.area;

        // プール容量が一定を超えたら、古いテクスチャから削除していく
        if (this._$objectPoolArea > this._$maxWidth * this._$maxHeight * 10) {
            const oldTexture = this._$objectPool.shift();
            this._$objectPoolArea -= oldTexture.area;
            this._$gl.deleteTexture(oldTexture);
        }
    }

    /**
     * @param  {WebGLTexture} texture0
     * @param  {boolean}      [smoothing0=null]
     * @return void
     */
    bind0 (texture0, smoothing0 = null)
    {
        this._$bindTexture(2, this._$gl.TEXTURE2, null, null);
        this._$bindTexture(1, this._$gl.TEXTURE1, null, null);
        this._$bindTexture(0, this._$gl.TEXTURE0, texture0, smoothing0);
    }

    /**
     * @param  {WebGLTexture} texture0
     * @param  {WebGLTexture} texture1
     * @param  {boolean}      [smoothing01=null]
     * @return void
     */
    bind01 (texture0, texture1, smoothing01 = null)
    {
        this._$bindTexture(2, this._$gl.TEXTURE2, null, null);
        this._$bindTexture(1, this._$gl.TEXTURE1, texture1, smoothing01);
        this._$bindTexture(0, this._$gl.TEXTURE0, texture0, smoothing01);
    }

    /**
     * @param  {WebGLTexture} texture0
     * @param  {WebGLTexture} texture1
     * @param  {WebGLTexture} texture2
     * @param  {boolean}      [smoothing2=null]
     * @return void
     */
    bind012 (texture0, texture1, texture2, smoothing2 = null)
    {
        this._$bindTexture(2, this._$gl.TEXTURE2, texture2, smoothing2);
        this._$bindTexture(1, this._$gl.TEXTURE1, texture1, null);
        this._$bindTexture(0, this._$gl.TEXTURE0, texture0, null);
    }

    /**
     * @param  {WebGLTexture} texture0
     * @param  {WebGLTexture} texture2
     * @param  {boolean}      [smoothing2=null]
     * @return void
     */
    bind02 (texture0, texture2, smoothing2 = null)
    {
        this._$bindTexture(2, this._$gl.TEXTURE2, texture2, smoothing2);
        this._$bindTexture(1, this._$gl.TEXTURE1, null, null);
        this._$bindTexture(0, this._$gl.TEXTURE0, texture0, null);
    }

    /**
     * @param  {number}       index
     * @param  {number}       target
     * @param  {WebGLTexture} texture
     * @param  {boolean}      smoothing
     * @return void
     */
    _$bindTexture (index, target, texture, smoothing)
    {
        const shouldBind   = texture !== this._$boundTextures[index];
        const shouldSmooth = smoothing !== null && smoothing !== texture.smoothing;
        const shouldActive = (shouldBind || shouldSmooth || target === this._$gl.TEXTURE0)
            && target !== this._$activeTexture;

        if (shouldActive) {
            this._$activeTexture = target;
            this._$gl.activeTexture(target);
        }

        if (shouldBind) {
            this._$boundTextures[index] = texture;
            this._$gl.bindTexture(this._$gl.TEXTURE_2D, texture);
        }

        if (shouldSmooth) {
            texture.smoothing = smoothing;
            const filter = smoothing && Util.$currentPlayer()._$quality !== StageQuality.LOW
                ? this._$gl.LINEAR
                : this._$gl.NEAREST;
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MIN_FILTER, filter);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MAG_FILTER, filter);
        }
    }
}
