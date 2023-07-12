import type { CachePositionImpl } from "./interface/CachePositionImpl";

/**
 * @class
 */
export class TextureManager
{
    private readonly _$gl: WebGL2RenderingContext;
    private readonly _$objectPool: WebGLTexture[];
    private readonly _$boundTextures: Array<WebGLTexture | null>;
    private _$objectPoolArea: number;
    private _$activeTexture: number;
    public _$maxWidth: number;
    public _$maxHeight: number;
    private readonly _$atlasTextures: WebGLTexture[];

    /**
     * @param {WebGL2RenderingContext} gl
     * @constructor
     * @public
     */
    constructor (gl: WebGL2RenderingContext)
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
         * @type {number}
         * @default 0
         * @private
         */
        this._$objectPoolArea = 0;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$activeTexture = -1;

        /**
         * @type {array}
         * @private
         */
        this._$boundTextures = [null, null, null];

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$maxWidth = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$maxHeight = 0;

        this._$gl.pixelStorei(this._$gl.UNPACK_ALIGNMENT, 1);
        this._$gl.pixelStorei(this._$gl.UNPACK_FLIP_Y_WEBGL, true);

        this._$atlasTextures = [];
        this.createTextureAtlas();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    createTextureAtlas (): void
    {
        const texture: WebGLTexture = this._$gl.createTexture() as NonNullable<WebGLTexture>;
        texture.width  = 4096;
        texture.height = 4096;

        this._$gl.activeTexture(this._$gl.TEXTURE3 + this._$atlasTextures.length);
        this._$gl.bindTexture(this._$gl.TEXTURE_2D, texture);

        this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_WRAP_S, this._$gl.CLAMP_TO_EDGE);
        this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_WRAP_T, this._$gl.CLAMP_TO_EDGE);
        this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MIN_FILTER, this._$gl.NEAREST);
        this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MAG_FILTER, this._$gl.NEAREST);

        this._$gl.texStorage2D(this._$gl.TEXTURE_2D, 1, this._$gl.RGBA8, 4096, 4096);

        this._$atlasTextures.push(texture);
    }

    /**
     * @param  {number} index
     * @return {WebGLTexture}
     * @method
     * @public
     */
    getActiveTexture (index: number): WebGLTexture
    {
        this._$activeTexture = 3 + index;
        this._$gl.activeTexture(this._$gl.TEXTURE3 + index);
        return this._$atlasTextures[index];
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @return {object}
     * @method
     * @public
     */
    createCachePosition (width: number, height: number): CachePositionImpl
    {
        return {
            "index": 0,
            "x": 0,
            "y": 0,
            "w": width,
            "h": height
        };
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @return {WebGLTexture}
     * @method
     * @private
     */
    _$createTexture (width: number, height: number): WebGLTexture
    {
        const texture: WebGLTexture = this._$gl.createTexture() as NonNullable<WebGLTexture>;

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

        texture.width  = width;
        texture.height = height;
        texture.area   = width * height;
        texture.dirty  = false;

        this._$gl.texStorage2D(this._$gl.TEXTURE_2D, 1, this._$gl.RGBA8, width, height);

        return texture;
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @return {WebGLTexture}
     * @method
     * @private
     */
    _$getTexture (width: number, height: number): WebGLTexture
    {
        // プールに同じサイズのテクスチャがあれば、それを使い回す
        for (let i: number = 0; i < this._$objectPool.length; i++) {

            const texture: WebGLTexture = this._$objectPool[i];
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
     * @param  {Uint8Array} [pixels=null]
     * @param  {boolean}    [premultiplied_alpha=false]
     * @param  {boolean}    [flip_y=true]
     * @method
     * @return {WebGLTexture}
     */
    create (
        width: number, height: number,
        pixels: Uint8Array|null = null,
        premultiplied_alpha: boolean = false,
        flip_y: boolean = true
    ): WebGLTexture {

        const texture: WebGLTexture = this._$getTexture(width, height);

        if (premultiplied_alpha) {
            this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        }

        if (!flip_y) {
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

        if (premultiplied_alpha) {
            this._$gl.pixelStorei(this._$gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        }

        if (!flip_y) {
            this._$gl.pixelStorei(this._$gl.UNPACK_FLIP_Y_WEBGL, true);
        }

        return texture;
    }

    /**
     * @param  {HTMLImageElement} image
     * @param  {boolean} [smoothing=false]
     * @return {WebGLTexture}
     * @method
     * @public
     */
    createFromImage (image: HTMLImageElement, smoothing: boolean = false): WebGLTexture
    {
        return this._$createFromElement(
            image.width,
            image.height,
            image,
            smoothing
        );
    }

    /**
     * @param  {HTMLCanvasElement} canvas
     * @return {WebGLTexture}
     * @method
     * @public
     */
    createFromCanvas (canvas: HTMLCanvasElement | OffscreenCanvas): WebGLTexture
    {
        return this._$createFromElement(
            canvas.width,
            canvas.height,
            canvas,
            false
        );
    }

    /**
     * @param  {HTMLVideoElement} video
     * @param  {boolean} [smoothing=false]
     * @return {WebGLTexture}
     * @method
     * @public
     */
    createFromVideo (
        video: HTMLVideoElement,
        smoothing: boolean = false
    ): WebGLTexture {
        return this._$createFromElement(
            video.videoWidth,
            video.videoHeight,
            video,
            smoothing
        );
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @param  {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} element
     * @param  {boolean} [smoothing=false]
     * @return {WebGLTexture}
     * @method
     * @private
     */
    _$createFromElement (
        width: number, height: number,
        element: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas,
        smoothing: boolean = false
    ): WebGLTexture {

        const texture: WebGLTexture = this._$getTexture(width, height);

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
     * @return {void}
     * @method
     * @public
     */
    release (texture: WebGLTexture): void
    {
        // テクスチャのサイズが非常に大きい場合はプールしない
        if (texture.area > this._$maxWidth * this._$maxHeight * 2) {
            this._$gl.deleteTexture(texture);
            return ;
        }

        texture.dirty = true;
        this._$objectPool.push(texture);

        this._$objectPoolArea += texture.area;

        // プール容量が一定を超えたら、古いテクスチャから削除していく
        if (this._$objectPool.length
            && this._$objectPoolArea > this._$maxWidth * this._$maxHeight * 10
        ) {

            const oldTexture: WebGLTexture = this._$objectPool.shift() as NonNullable<WebGLTexture>;

            this._$objectPoolArea -= oldTexture.area;

            this._$gl.deleteTexture(oldTexture);
        }
    }

    /**
     * @param  {WebGLTexture} texture0
     * @param  {boolean|null} [smoothing0=null]
     * @return {void}
     * @method
     * @public
     */
    bind0 (texture0: WebGLTexture, smoothing0: boolean|null = null): void
    {
        this._$bindTexture(2, this._$gl.TEXTURE2, null, null);
        this._$bindTexture(1, this._$gl.TEXTURE1, null, null);
        this._$bindTexture(0, this._$gl.TEXTURE0, texture0, smoothing0);
    }

    /**
     * @param  {WebGLTexture} texture0
     * @param  {WebGLTexture} texture1
     * @param  {boolean}      [smoothing01=null]
     * @return {void}
     * @method
     * @public
     */
    bind01 (
        texture0: WebGLTexture,
        texture1: WebGLTexture,
        smoothing01: boolean|null = null
    ): void {
        this._$bindTexture(2, this._$gl.TEXTURE2, null, null);
        this._$bindTexture(1, this._$gl.TEXTURE1, texture1, smoothing01);
        this._$bindTexture(0, this._$gl.TEXTURE0, texture0, smoothing01);
    }

    /**
     * @param  {WebGLTexture} texture0
     * @param  {WebGLTexture} texture1
     * @param  {WebGLTexture} texture2
     * @param  {boolean}      [smoothing2=null]
     * @return {void}
     * @method
     * @public
     */
    bind012 (
        texture0: WebGLTexture,
        texture1: WebGLTexture,
        texture2: WebGLTexture,
        smoothing2: boolean|null = null
    ): void {
        this._$bindTexture(2, this._$gl.TEXTURE2, texture2, smoothing2);
        this._$bindTexture(1, this._$gl.TEXTURE1, texture1, null);
        this._$bindTexture(0, this._$gl.TEXTURE0, texture0, null);
    }

    /**
     * @param  {WebGLTexture} texture0
     * @param  {WebGLTexture} texture2
     * @param  {boolean}      [smoothing2=null]
     * @return {void}
     * @method
     * @public
     */
    bind02 (
        texture0: WebGLTexture,
        texture2: WebGLTexture,
        smoothing2: boolean|null = null
    ): void {
        this._$bindTexture(2, this._$gl.TEXTURE2, texture2, smoothing2);
        this._$bindTexture(1, this._$gl.TEXTURE1, null, null);
        this._$bindTexture(0, this._$gl.TEXTURE0, texture0, null);
    }

    /**
     * @param  {number}       index
     * @param  {number}       target
     * @param  {WebGLTexture} texture
     * @param  {boolean}      smoothing
     * @return {void}
     * @method
     * @private
     */
    _$bindTexture (
        index: number, target: number,
        texture: WebGLTexture|null = null,
        smoothing: boolean|null = null
    ): void {

        const shouldBind:boolean   = texture !== this._$boundTextures[index];
        const shouldSmooth:boolean = smoothing !== null && texture !== null && smoothing !== texture.smoothing;
        const shouldActive:boolean = (shouldBind || shouldSmooth || target === this._$gl.TEXTURE0)
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

            if (texture) {
                texture.smoothing = !!smoothing;
            }

            const filter: number = smoothing ? this._$gl.LINEAR : this._$gl.NEAREST;
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MIN_FILTER, filter);
            this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MAG_FILTER, filter);
        }
    }
}
