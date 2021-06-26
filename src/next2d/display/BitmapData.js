/**
 * @class
 * @memberOf next2d.display
 */
class BitmapData
{
    /**
     * BitmapData クラスを使用すると、Bitmap オブジェクトのデータ (ピクセル) を処理できます。
     * BitmapData クラスのメソッドを使用して、任意のサイズの透明または不透明のビットマップイメージを作成し
     * 実行時に様々な方法で操作できます。
     *
     * The BitmapData class lets you work with the data (pixels) of a Bitmap object.
     * You can use the methods of the BitmapData class to create arbitrarily sized transparent or
     * opaque bitmap images and manipulate them in various ways at runtime.
     *
     * @param   {number}  [width=0]
     * @param   {number}  [height=0]
     * @param   {boolean} [transparent=true]
     * @param   {number}  [color=0xffffffff]
     *
     * @constructor
     * @public
     */
    constructor(width = 0, height = 0, transparent = true, color = 0xffffffff)
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$width = width|0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$height = height|0;

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
     * @static
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
        const {width, height} = this;
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

            if (this._$buffer) {

                texture = context
                    .frameBuffer
                    .createTextureFromPixels(
                        width, height, this._$buffer, true
                    );

                this._$buffer = null;

            } else {

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

            cacheStore.set(cacheKeys, texture);
        }

        Util.$poolArray(cacheKeys);
        // this._$flushSetPixelQueue();

        if (!texture._$bitmapData) {
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
            Util.$poolTypedArrayBuffer(this._$buffer);
            this._$buffer = null;
        }

        cacheStore.set(cacheKeys, texture);
        Util.$poolArray(cacheKeys);

        if (!texture._$bitmapData) {
            texture._$bitmapData = this;
        }
    }

    /**
     * @param  {DisplayObject} source
     * @param  {Matrix} [matrix=null]
     * @param  {ColorTransform} [color_transform=null]
     * @param  {string} [blend_mode=BlendMode.NORMAL]
     * @param  {Rectangle} [clip_rect=null]
     * @param  {boolean} [smoothing=false]
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

        let tMatrix = (matrix)
            ? matrix._$matrix
            : Util.$MATRIX_ARRAY_IDENTITY;


        let colorTransform = (color_transform)
            ? color_transform._$colorTransform
            : Util.$COLOR_ARRAY_IDENTITY;

        switch (true) {

            case (source instanceof DisplayObject):

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

                break;

            case (source instanceof BitmapData):

                // clone canvas
                const bitmap = new Bitmap(source, PixelSnapping.AUTO, smoothing);
                bitmap._$draw(context, tMatrix, colorTransform);

                break;

            default:
                break;

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

        // data update
        // this._$updateData();



    }

    /**
     * @param  {URLRequest} url_request
     * @return {void}
     * @public
     */
    load (url_request)
    {

    }

    /**
     * @param  {uint} color
     * @return {object}
     * @private
     */
    _$toRGBA (color)
    {
        return (this._$transparent)
            ? Util.$uintToRGBA(color)
            : Util.$intToRGBA(color);
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
        const width  = Util.$min(w, this.width  - x);
        const height = Util.$min(h, this.height - y);

        if (width <= 0 || height <= 0) {
            return new Uint8Array(0);
        }

        const pixels = (allocator)
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
            .bindAndSmoothing(false, this._$texture);


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
     * @return {HTMLImageElement}
     * @public
     */
    toImage ()
    {
        const {width, height} = this;

        const image = new Image();
        if (width || height) {

            const canvas  = Util.$cacheStore().getCanvas();
            canvas.width  = width;
            canvas.height = height;

            const imageData = new ImageData(width, height);
            imageData.data.set(this._$getPixels(0, 0, width, height, "RGBA"));

            const context = canvas.getContext("2d");
            context.putImageData(imageData, 0, 0);

            image.width  = width;
            image.height = height;
            image.src    = context.canvas.toDataURL();

            Util.$cacheStore().destroy(context);
        }

        return image;
    }

    /**
     * @return {array}
     * @public
     */
    toArray ()
    {
        return Array.from(this._$getPixels(0, 0, this.width, this.height, "RGBA"));
    }
}