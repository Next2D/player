/**
 * BitmapData クラスを使用すると、Bitmap オブジェクトのデータ (ピクセル) を処理できます。
 * BitmapData クラスのメソッドを使用して、任意のサイズの透明または不透明のビットマップイメージを作成し
 * 実行時に様々な方法で操作できます。
 *
 * The BitmapData class lets you work with the data (pixels) of a Bitmap object.
 * You can use the methods of the BitmapData class to create arbitrarily sized transparent or
 * opaque bitmap images and manipulate them in various ways at runtime.
 *
 * @class
 * @memberOf next2d.display
 */
class BitmapData
{
    /**
     * @param   {number}  [width=0]
     * @param   {number}  [height=0]
     * @param   {boolean} [transparent=true]
     * @param   {number}  [color=0xffffffff]
     *
     * @constructor
     * @public
     */
    constructor (width = 0, height = 0, transparent = true, color = 0xffffffff)
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$width = width | 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$height = height | 0;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$transparent = transparent;

        /**
         * @type {number}
         * @default 0xffffffff
         * @private
         */
        this._$color = this._$toRGBA(Util.$clamp(color, 0, 0xffffffff, 0xffffffff));

        /**
         * @type {number}
         * @private
         */
        this._$instanceId = instanceId++;

        /**
         * @type {Uint8Array}
         * @default null
         * @private
         */
        this._$buffer = null;

        /**
         * @type {HTMLImageElement}
         * @default null
         * @private
         */
        this._$image = null;

        /**
         * @type {CanvasRenderingContext2D}
         * @default null
         * @private
         */
        this._$canvas = null;

        /**
         * @type {WebGLBuffer}
         * @type {null}
         * @private
         */
        this._$pixelBuffer = null;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class BitmapData]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class BitmapData]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.BitmapData
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display.BitmapData";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object BitmapData]
     * @method
     * @public
     */
    toString ()
    {
        return "[object BitmapData]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.BitmapData
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.display.BitmapData";
    }

    /**
     * @description ビットマップイメージの高さ（ピクセル単位）です。
     *              The height of the bitmap image in pixels.
     *
     * @return  {number}
     * @readonly
     * @public
     */
    get height ()
    {
        return this._$height;
    }

    /**
     * @description Imageクラスを利用して BitmapData を生成します。
     *              Use the Image class to generate BitmapData.
     *
     * @return {HTMLImageElement}
     * @public
     */
    get image ()
    {
        return this._$image;
    }
    set image (image)
    {
        this._$canvas = null;
        this._$image  = image;
        this._$width  = image.width;
        this._$height = image.height;
    }

    /**
     * @description Canvasクラス利用して BitmapData を生成します。
     *              Use the Canvas class to generate BitmapData.
     *
     * @return {CanvasRenderingContext2D}
     * @public
     */
    get canvas ()
    {
        return this._$canvas;
    }
    set canvas (canvas)
    {
        this._$image  = null;
        this._$canvas = canvas;
        this._$width  = canvas.width;
        this._$height = canvas.height;
    }

    /**
     * @description ビットマップイメージがピクセル単位の透明度をサポートするかどうかを定義します。
     *              Defines whether the bitmap image supports per-pixel transparency.
     *
     * @return  {boolean}
     * @readonly
     * @public
     */
    get transparent ()
    {
        return this._$transparent;
    }

    /**
     * @description ビットマップイメージの幅（ピクセル単位）です。
     *              The width of the bitmap image in pixels.
     *
     * @return  {number}
     * @readonly
     * @public
     */
    get width ()
    {
        return this._$width;
    }

    /**
     * @member {WebGLTexture}
     * @private
     */
    get _$texture ()
    {
        const { width, height } = this;
        if (!width || !height) {
            return null;
        }

        const player     = Util.$currentPlayer();
        const cacheStore = player._$cacheStore;
        const cacheKeys  = cacheStore.generateKeys(this._$instanceId);
        let texture      = cacheStore.get(cacheKeys);

        // delay init
        if (!texture) {

            const context = player._$context;
            switch (true) {

                case this._$image !== null:

                    texture = context
                        .frameBuffer
                        .createTextureFromImage(this._$image);

                    this._$image = null;

                    break;

                case this._$canvas !== null:

                    texture = context
                        .frameBuffer
                        .createTextureFromCanvas(this._$canvas);

                    this._$canvas = null;

                    break;

                case this._$pixelBuffer !== null:

                    texture = context
                        .frameBuffer
                        .createTextureFromPixels(
                            width, height,
                            context.pbo.getBufferSubDataAsync(this._$pixelBuffer), true
                        );

                    this._$pixelBuffer = null;

                    break;

                case this._$buffer !== null:

                    texture = context
                        .frameBuffer
                        .createTextureFromPixels(
                            width, height, this._$buffer, true
                        );

                    break;

                default:
                    {
                        const currentAttachment = context
                            .frameBuffer
                            .currentAttachment;

                        // new attachment
                        const attachment = context
                            .frameBuffer
                            .createCacheAttachment(width, height, false);
                        context._$bind(attachment);

                        Util.$resetContext(context);
                        context.fillStyle = [
                            this._$color.R / 255, this._$color.G / 255,
                            this._$color.B / 255, this._$color.A / 255
                        ];
                        context.setTransform(1, 0, 0, 1, 0, 0);
                        context.beginPath();
                        context.fillRect(0, 0, width, height);

                        texture = context
                            .frameBuffer
                            .getTextureFromCurrentAttachment();

                        // reset
                        if (currentAttachment) {
                            context._$bind(currentAttachment);
                        } else {
                            context.frameBuffer.unbind();
                        }

                        context
                            .frameBuffer
                            .releaseAttachment(attachment, false);

                    }
                    break;

            }

            cacheStore.set(cacheKeys, texture);
        }

        Util.$poolArray(cacheKeys);
        // this._$flushSetPixelQueue();

        if (!this._$buffer && !texture._$bitmapData) {
            texture._$bitmapData = this;
        }

        return texture;

    }
    set _$texture (texture)
    {
        // 未反映の setPixel/setPixel32 は破棄する。
        // if (this._$setPixelQueue) {
        //     Util.$poolFloat32Array(this._$setPixelQueue);
        // }
        this._$setPixelQueue = null;
        this._$setPixelCount = 0;

        // if (this._$linePixelsCache) {
        //     Util.$poolUint8Array(this._$linePixelsCache);
        // }
        this._$linePixelsCache = null;
        this._$linePixelsCacheY = null;

        const player     = Util.$currentPlayer();
        const cacheStore = player._$cacheStore;
        const cacheKeys  = cacheStore.generateKeys(this._$instanceId);

        const currentTexture = cacheStore.get(cacheKeys);
        if (currentTexture) {

            if (currentTexture._$bitmapData) {
                delete currentTexture._$bitmapData;
            }

            player._$context
                .frameBuffer
                .releaseTexture(currentTexture);

            cacheStore.set(cacheKeys, null);
        }

        if (this._$buffer) {
            this._$buffer = null;
        }

        cacheStore.set(cacheKeys, texture);
        Util.$poolArray(cacheKeys);

        if (!texture._$bitmapData) {
            texture._$bitmapData = this;
        }
    }

    /**
     * @param  {DisplayObject}  source
     * @param  {Matrix}         [matrix=null]
     * @param  {ColorTransform} [color_transform=null]
     * @param  {string}         [blend_mode=BlendMode.NORMAL]
     * @param  {Rectangle}      [clip_rect=null]
     * @param  {boolean}        [smoothing=false]
     * @return {void}
     * @public
     */
    draw (
        source, matrix = null, color_transform = null,
        blend_mode = BlendMode.NORMAL, clip_rect = null, smoothing = false
    ) {

        const width  = this._$width;
        const height = this._$height;
        if (!width || !height) {
            return ;
        }

        const player = Util.$currentPlayer();

        const context = player._$context;

        const currentAttachment = context
            .frameBuffer
            .currentAttachment;

        // new buffer
        const sourceAttachment = context
            .frameBuffer
            .createCacheAttachment(width, height, false);
        context._$bind(sourceAttachment);

        Util.$resetContext(context);
        context.setTransform(1, 0, 0, 1, 0, 0);

        // id clip
        if (clip_rect) {

            const dx = clip_rect.x;
            const dy = clip_rect.y;
            const dw = clip_rect.width;
            const dh = clip_rect.height;

            context.save();
            context._$enterClip();
            context._$beginClipDef();

            context.setTransform(1, 0, 0, 1, 0, 0);
            context.beginPath();
            context.moveTo(dx     , dy);
            context.lineTo(dx + dw, dy);
            context.lineTo(dx + dw, dy + dh);
            context.lineTo(dx     , dy + dh);
            context.lineTo(dx     , dy);
            context.clip(true);
            context._$endClipDef();

        }

        let tMatrix = matrix
            ? matrix._$matrix
            : Util.$MATRIX_ARRAY_IDENTITY;

        let colorTransform = color_transform
            ? color_transform._$colorTransform
            : Util.$COLOR_ARRAY_IDENTITY;

        if (source instanceof DisplayObject) {

            // matrix invert
            const clone = source._$transform.matrix;
            clone.invert();

            if (matrix) {
                tMatrix = Util.$multiplicationMatrix(
                    tMatrix, clone._$matrix
                );
            }

            source._$draw(context, tMatrix, colorTransform);

            Util.$poolMatrix(clone);

        } else {

            // clone canvas
            const bitmap = new Bitmap(source, PixelSnapping.AUTO, smoothing);
            bitmap._$draw(context, tMatrix, colorTransform);

        }

        // clip end
        if (clip_rect) {
            context.restore();
            context._$leaveClip();
        }

        const sourceTexture = context
            .frameBuffer
            .getTextureFromCurrentAttachment();

        // setup
        const attachment = context
            .frameBuffer
            .createTextureAttachmentFrom(this._$texture);
        context._$bind(attachment);

        // pool
        context
            .frameBuffer
            .releaseAttachment(sourceAttachment, false);

        // draw source
        Util.$resetContext(context);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context._$imageSmoothingEnabled    = smoothing;
        context._$globalCompositeOperation = blend_mode;
        context.drawImage(sourceTexture, 0, 0, width, height);

        if (currentAttachment) {
            context._$bind(currentAttachment);
        } else {
            context.frameBuffer.unbind();
        }

        // pool
        context.frameBuffer.releaseTexture(sourceTexture);
        context.frameBuffer.releaseAttachment(attachment, false);
    }

    /**
     * @param  {uint} color
     * @return {object}
     * @private
     */
    _$toRGBA (color)
    {
        return this._$transparent
            ? Util.$uintToRGBA(color)
            : Util.$intToRGBA(color);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @param  {string} [byte_order="RGBA"]
     * @return {void}
     * @private
     */
    _$getPixelsAsync (x, y, w, h, byte_order = "RGBA")
    {
        x = Math.max(x, 0);
        y = Math.max(y, 0);

        const width  = $Math.min(w, this.width  - x);
        const height = $Math.min(h, this.height - y);
        if (width <= 0 || height <= 0) {
            return ;
        }

        const context = Util
            .$currentPlayer()
            ._$context;

        if (!context) {
            return ;
        }

        const shader = context
            ._$shaderList
            ._$bitmapData
            .getPixels[byte_order]
            .instance;

        context
            ._$shaderList
            .bitmapShaderVariants
            .setGetPixelsUniform(
                shader.uniform,
                width / this.width, -height / this.height,
                x / this.width, 1 - y / this.height
            );

        const currentAttachment = context
            .frameBuffer
            .currentAttachment;

        const attachment = context
            .frameBuffer
            .createCacheAttachment(width, height, false);
        context._$bind(attachment);

        context
            ._$frameBufferManager
            ._$textureManager
            .bind0(this._$texture, false);

        context.blend.disable();
        shader._$drawImage();
        context.blend.enable();

        this._$pixelBuffer = context
            .pbo
            .readPixelsAsync(
                0, 0, this.width, this.height
            );

        if (currentAttachment) {
            context._$bind(currentAttachment);
        } else {
            context.frameBuffer.unbind();
        }
        context.frameBuffer.releaseAttachment(attachment);
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @param  {string} [byte_order="ARGB"]
     * @param  {function} [allocator=null]
     * @return {Uint8Array}
     * @private
     */
    _$getPixels (x, y, w, h, byte_order = "ARGB", allocator = null)
    {
        switch (byte_order) {

            case "ARGB":
            case "RGBA":
            case "BGRA":
                break;

            default:
                throw new Error(`Unsupported byteOrder: ${byte_order}`);

        }

        x = Math.max(x, 0);
        y = Math.max(y, 0);
        const width  = $Math.min(w, this.width  - x);
        const height = $Math.min(h, this.height - y);

        if (width <= 0 || height <= 0) {
            return new Uint8Array(0);
        }

        const pixels = allocator
            ? allocator(width * height * 4)
            : new Uint8Array(width * height * 4);

        const context = Util
            .$currentPlayer()
            ._$context;

        if (!context) {
            return pixels;
        }

        const shader = context
            ._$shaderList
            ._$bitmapData
            .getPixels[byte_order]
            .instance;

        context
            ._$shaderList
            .bitmapShaderVariants
            .setGetPixelsUniform(
                shader.uniform,
                width / this.width, -height / this.height,
                x / this.width, 1 - y / this.height
            );

        const currentAttachment = context
            .frameBuffer
            .currentAttachment;

        const attachment = context
            .frameBuffer
            .createCacheAttachment(width, height, false);
        context._$bind(attachment);

        context
            ._$frameBufferManager
            ._$textureManager
            .bind0(this._$texture, false);

        context.blend.disable();
        shader._$drawImage();
        context.blend.enable();

        const gl = context._$gl;
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        if (currentAttachment) {
            context._$bind(currentAttachment);
        } else {
            context.frameBuffer.unbind();
        }
        context.frameBuffer.releaseAttachment(attachment);

        return pixels;
    }

    /**
     * @param  {HTMLCanvasElement} canvas
     * @return {CanvasRenderingContext2D}
     * @method
     * @public
     */
    drawFromCanvas (canvas)
    {
        const { width, height } = this;

        canvas.width  = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (width || height) {

            const player  = Util.$currentPlayer();
            const context = player._$context;

            const cacheWidth  = player._$canvas.width;
            const cacheHeight = player._$canvas.height;

            context.frameBuffer.unbind();
            Util.$resetContext(context);
            context.setTransform(1, 0, 0, 1, 0, 0);
            context._$setColor(0, 0, 0, 0);
            context.clearRect(0, 0, cacheWidth, cacheHeight);

            // resize
            const resize = width > cacheWidth || height > cacheHeight;
            if (resize) {
                // canvas
                player._$canvas.width  = width;
                player._$canvas.height = height;

                // webgl
                context._$gl.viewport(0, 0, width, height);
                context._$viewportWidth  = width;
                context._$viewportHeight = height;

                const manager = context._$frameBufferManager;
                if (player._$buffer) {
                    manager.unbind();
                    manager.releaseAttachment(player._$buffer, true);
                }

                player._$buffer = manager
                    .createCacheAttachment(width, height, false);
            }

            // reset and draw to canvas
            context.drawImage(this._$texture, 0, 0, width, height);
            ctx.drawImage(player._$canvas, 0, 0);

            // end
            context._$bind(player._$buffer);
        }

        return ctx;
    }

    /**
     * @return {Uint8Array}
     * @method
     * @public
     */
    toUint8Array ()
    {
        return this._$buffer
            ? this._$buffer
            : this._$getPixels(0, 0, this.width, this.height, "RGBA");
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    dispose ()
    {
        const player  = Util.$currentPlayer();
        const texture = this._$texture;

        if (texture) {
            texture._$bitmapData = false;
        }

        // set null
        player
            ._$cacheStore
            .removeCache(this._$instanceId);
    }
}
