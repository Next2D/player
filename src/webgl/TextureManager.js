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
        this._$boundTexture0   = null;
        this._$boundTexture1   = null;
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

        this.bindAndSmoothing(false, texture);

        this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_WRAP_S, this._$gl.CLAMP_TO_EDGE);
        this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_WRAP_T, this._$gl.CLAMP_TO_EDGE);

        if (this._$isWebGL2Context) {
            texture.width  = width;
            texture.height = height;
            texture.area   = width * height;
            texture.dirty  = false;
            this._$gl.texStorage2D(this._$gl.TEXTURE_2D, 1, this._$gl.RGBA8, width, height);

            // @ifdef DEBUG
            if (window.glstats) {
                glstats.ontex(texture.area);
            }
            // @endif
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

                this.bindAndSmoothing(false, texture);

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

            this.bind(this._$alphaTexture);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_WRAP_S, this._$gl.CLAMP_TO_EDGE);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_WRAP_T, this._$gl.CLAMP_TO_EDGE);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MIN_FILTER, this._$gl.NEAREST);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MAG_FILTER, this._$gl.NEAREST);
        } else {

            this.bind(this._$alphaTexture);

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

            // @ifdef DEBUG
            if (window.glstats) {
                glstats.ontex(texture.area);
            }
            // @endif
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
        this.bindAndSmoothing(smoothing, texture);

        this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

        if (texture.width !== width || texture.height !== height) {
            texture.width  = width;
            texture.height = height;
            texture.area   = width * height;

            this._$gl.texImage2D(
                this._$gl.TEXTURE_2D, 0, this._$gl.RGBA,
                this._$gl.RGBA, this._$gl.UNSIGNED_BYTE, element
            );

            // @ifdef DEBUG
            if (window.glstats) {
                glstats.ontex(texture.area);
            }
            // @endif
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
        if (texture.area > (this._$maxWidth * this._$maxHeight * 1.2)|0) {
            this._$gl.deleteTexture(texture);
            return;
        }

        texture.dirty = true;
        this._$objectPool.push(texture);
        this._$objectPoolArea += texture.area;

        // プール容量が一定を超えたら、古いテクスチャから削除していく
        if (this._$objectPoolArea > (this._$maxWidth * this._$maxHeight * 10)) {
            const oldTexture = this._$objectPool.shift();
            this._$objectPoolArea -= oldTexture.area;
            this._$gl.deleteTexture(oldTexture);
        }
    }

    /**
     * @param  {WebGLTexture} texture0
     * @param  {WebGLTexture} [texture1=null]
     * @return void
     */
    bind (texture0, texture1 = null)
    {
        if (texture0 !== this._$boundTexture0) {
            this._$boundTexture0 = texture0;
            this._$gl.bindTexture(this._$gl.TEXTURE_2D, texture0);
        }

        if (texture1) {
            if (texture1 !== this._$boundTexture1) {
                this._$boundTexture1 = texture1;
                this._$gl.activeTexture(this._$gl.TEXTURE1);
                this._$gl.bindTexture(this._$gl.TEXTURE_2D, texture1);
                this._$gl.activeTexture(this._$gl.TEXTURE0);
            }
        } else if (this._$boundTexture1) {
            this._$boundTexture1 = null;
            this._$gl.activeTexture(this._$gl.TEXTURE1);
            this._$gl.bindTexture(this._$gl.TEXTURE_2D, null);
            this._$gl.activeTexture(this._$gl.TEXTURE0);
        }
    }

    /**
     * @param  {boolean}      smoothing
     * @param  {WebGLTexture} texture0
     * @param  {WebGLTexture} [texture1=null]
     * @return void
     */
    bindAndSmoothing (smoothing, texture0, texture1 = null)
    {
        const filter = (smoothing && Util.$currentPlayer()._$quality !== StageQuality.LOW)
            ? this._$gl.LINEAR
            : this._$gl.NEAREST;
        
        if (texture0 !== this._$boundTexture0) {
            this._$boundTexture0 = texture0;
            this._$gl.bindTexture(this._$gl.TEXTURE_2D, texture0);
        }

        if (smoothing !== this._$boundTexture0.smoothing) {
            this._$boundTexture0.smoothing = smoothing;
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MIN_FILTER, filter);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MAG_FILTER, filter);
        }

        if (texture1) {
            let active1 = false;

            if (texture1 !== this._$boundTexture1) {
                this._$boundTexture1 = texture1;

                active1 = true;
                this._$gl.activeTexture(this._$gl.TEXTURE1);

                this._$gl.bindTexture(this._$gl.TEXTURE_2D, texture1);
            }

            if (smoothing !== this._$boundTexture1.smoothing) {
                this._$boundTexture1.smoothing = smoothing;

                if (!active1) {
                    active1 = true;
                    this._$gl.activeTexture(this._$gl.TEXTURE1);
                }

                this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MIN_FILTER, filter);
                this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MAG_FILTER, filter);  
            }

            if (active1) {
                this._$gl.activeTexture(this._$gl.TEXTURE0);
            }
        } else if (this._$boundTexture1) {
            this._$boundTexture1 = null;
            this._$gl.activeTexture(this._$gl.TEXTURE1);
            this._$gl.bindTexture(this._$gl.TEXTURE_2D, null);
            this._$gl.activeTexture(this._$gl.TEXTURE0);
        }
    }
}
