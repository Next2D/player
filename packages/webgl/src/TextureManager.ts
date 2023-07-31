import { $RENDER_SIZE } from "./Const";
import type { CachePositionImpl } from "./interface/CachePositionImpl";
import type { GridImpl } from "./interface/GridImpl";

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
    private readonly _$atlasNodes: Map<number, GridImpl[]>;
    private readonly _$atlasTextures: WebGLTexture[];
    private readonly _$positionObjectArray: CachePositionImpl[];
    private readonly _$nodeObjectArray: GridImpl[];
    private readonly _$atlasCacheMap: Map<number, CachePositionImpl[]>;

    /**
     * @param {WebGL2RenderingContext} gl
     * @constructor
     * @public
     */
    constructor (gl: WebGL2RenderingContext)
    {
        // init setting
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

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

        /**
         * @type {array}
         * @private
         */
        this._$atlasTextures = [];

        /**
         * @type {array}
         * @private
         */
        this._$atlasCacheMap = new Map();

        /**
         * @type {array}
         * @private
         */
        this._$positionObjectArray = [];

        /**
         * @type {array}
         * @private
         */
        this._$nodeObjectArray = [];

        /**
         * @type {array}
         * @private
         */
        this._$atlasNodes = new Map();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    createTextureAtlas (): void
    {
        const texture: WebGLTexture = this._$gl.createTexture() as NonNullable<WebGLTexture>;
        texture.width  = $RENDER_SIZE;
        texture.height = $RENDER_SIZE;

        this._$gl.activeTexture(this._$gl.TEXTURE3);
        this._$gl.bindTexture(this._$gl.TEXTURE_2D, texture);

        this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_WRAP_S, this._$gl.CLAMP_TO_EDGE);
        this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_WRAP_T, this._$gl.CLAMP_TO_EDGE);
        this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MIN_FILTER, this._$gl.NEAREST);
        this._$gl.texParameteri(this._$gl.TEXTURE_2D, this._$gl.TEXTURE_MAG_FILTER, this._$gl.NEAREST);

        this._$gl.texStorage2D(this._$gl.TEXTURE_2D, 1, this._$gl.RGBA8, $RENDER_SIZE, $RENDER_SIZE);
        this._$gl.bindTexture(this._$gl.TEXTURE_2D, null);

        if (this._$activeTexture > -1) {
            this._$gl.activeTexture(this._$activeTexture);
        }

        // init array
        this._$atlasNodes.set(this._$atlasTextures.length, []);
        this._$atlasCacheMap.set(this._$atlasTextures.length, []);

        this._$atlasTextures.push(texture);

        console.log(this);
    }

    /**
     * @param  {number} index
     * @return {WebGLTexture}
     * @method
     * @public
     */
    getAtlasTexture (index: number): WebGLTexture
    {
        return this._$atlasTextures[index];
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @return {object}
     * @method
     * @public
     */
    getNode (x: number, y: number, w: number, h: number): GridImpl
    {
        const node = this._$nodeObjectArray.length
            ? this._$nodeObjectArray.pop() as NonNullable<GridImpl>
            : {
                "x": 0,
                "y": 0,
                "w": 0,
                "h": 0
            };

        node.x = x;
        node.y = y;
        node.w = w;
        node.h = h;

        return node;
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
        const object: CachePositionImpl = this._$positionObjectArray.length
            ? this._$positionObjectArray.pop() as NonNullable<CachePositionImpl>
            : {
                "index": 0,
                "x": 0,
                "y": 0,
                "w": 0,
                "h": 0
            };

        // init
        object.x = object.y = 0;
        object.w = width;
        object.h = height;

        // search
        for (const [index, nodes] of this._$atlasNodes) {

            // root node
            if (!nodes.length) {

                if (width > height) {

                    if ($RENDER_SIZE - width - 1 > 0) {
                        nodes.push(this.getNode(
                            width + 1,
                            0,
                            $RENDER_SIZE - width - 1,
                            height
                        ));
                    }

                    if ($RENDER_SIZE - height - 1 > 0) {
                        nodes.push(this.getNode(
                            0,
                            height + 1,
                            $RENDER_SIZE,
                            $RENDER_SIZE - height - 1
                        ));
                    }

                } else {
                    if ($RENDER_SIZE - height - 1 > 0) {
                        nodes.push(this.getNode(
                            0,
                            height + 1,
                            width,
                            $RENDER_SIZE - height - 1
                        ));
                    }

                    if ($RENDER_SIZE - width - 1 > 0) {
                        nodes.push(this.getNode(
                            width + 1,
                            0,
                            $RENDER_SIZE - width - 1,
                            $RENDER_SIZE
                        ));
                    }
                }

                object.index = index;

                const caches = this._$atlasCacheMap.get(object.index) as NonNullable<CachePositionImpl[]>;
                caches.push(object);

                return object;
            }

            const length: number = nodes.length;
            for (let idx = 0; idx < length; ++idx) {

                const node = nodes[idx];

                // no hit
                if (width > node.w || height > node.h) {
                    continue;
                }

                object.index = index;
                object.x = node.x;
                object.y = node.y;

                const caches = this._$atlasCacheMap.get(object.index) as NonNullable<CachePositionImpl[]>;
                caches.push(object);

                // division
                if (node.w !== width || node.h !== height) {

                    if (width > height) {

                        if (node.h - height - 1 > 0) {
                            nodes.push(this.getNode(
                                node.x,
                                node.y + height + 1,
                                node.w,
                                node.h - height - 1
                            ));
                        }

                        if (node.w - width - 1 > 0) {
                            node.x = node.x + width + 1;
                            node.w = node.w - width - 1;
                            node.h = height;
                        } else {
                            nodes.splice(idx, 1);
                            this._$nodeObjectArray.push(node);
                        }

                    } else {

                        if (node.w - width - 1 > 0) {
                            nodes.push(this.getNode(
                                node.x + width + 1,
                                node.y,
                                node.w - width - 1,
                                node.h
                            ));
                        }

                        if (node.h - height - 1 > 0) {
                            node.y = node.y + height + 1;
                            node.w = width;
                            node.h = node.h - height - 1;
                        } else {
                            nodes.splice(idx, 1);
                            this._$nodeObjectArray.push(node);
                        }
                    }

                } else {

                    nodes.splice(idx, 1);
                    this._$nodeObjectArray.push(node);

                }

                return object;
            }
        }

        // ヒットしない場合は新しいtextureを生成
        const index: number = this._$atlasTextures.length;
        this.createTextureAtlas();

        const nodes: GridImpl[] = this._$atlasNodes.get(index) as NonNullable<GridImpl[]>;
        if (width > height) {

            if ($RENDER_SIZE - width - 1 > 0) {
                nodes.push(this.getNode(
                    width + 1,
                    0,
                    $RENDER_SIZE - width - 1,
                    height
                ));
            }

            if ($RENDER_SIZE - height - 1 > 0) {
                nodes.push(this.getNode(
                    0,
                    height + 1,
                    $RENDER_SIZE,
                    $RENDER_SIZE - height - 1
                ));
            }

        } else {
            if ($RENDER_SIZE - height - 1 > 0) {
                nodes.push(this.getNode(
                    0,
                    height + 1,
                    width,
                    $RENDER_SIZE - height - 1
                ));
            }

            if ($RENDER_SIZE - width - 1 > 0) {
                nodes.push(this.getNode(
                    width + 1,
                    0,
                    $RENDER_SIZE - width - 1,
                    $RENDER_SIZE
                ));
            }
        }

        object.index = index;
        const caches: CachePositionImpl[] = this._$atlasCacheMap.get(object.index) as NonNullable<CachePositionImpl[]>;
        caches.push(object);

        return object;
    }

    /**
     * @param {object}
     * @method
     * @public
     */
    releasePosition (position: CachePositionImpl): void
    {
        if (!this._$atlasNodes.has(position.index)) {
            return ;
        }

        // 先頭にrootとして再登録
        this
            ._$atlasNodes
            .get(position.index)
            ?.unshift(this.getNode(
                position.x,
                position.y,
                position.w,
                position.y
            ));

        // pool
        this._$positionObjectArray.push(position);
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    clearCache (): void
    {
        for (const caches of this._$atlasCacheMap.values()) {
            this._$positionObjectArray.push(...caches);
            caches.length = 0;
        }
        for (const caches of this._$atlasNodes.values()) {
            this._$nodeObjectArray.push(...caches);
            caches.length = 0;
        }
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
