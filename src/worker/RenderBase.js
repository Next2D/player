Util.$filters = [
    BevelFilter,
    BlurFilter,
    ColorMatrixFilter,
    ConvolutionFilter,
    DisplacementMapFilter,
    DropShadowFilter,
    GlowFilter,
    GradientBevelFilter,
    GradientGlowFilter
];

let context = null;
let state   = "deactivate";
const queue = [];

/**
 * @class
 */
class CommandController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {HTMLCanvasElement}
         * @default null
         * @private
         */
        this._$canvas = null;

        /**
         * @type {CanvasToWebGLContext}
         * @default null
         * @private
         */
        this._$context = null;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$buffer = null;

        /**
         * @type {number}
         * @default 4
         * @private
         */
        this._$samples = 4;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$width = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$height = 0;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$wait = false;

        /**
         * @type {CacheStore}
         * @private
         */
        this._$cacheStore = new CacheStore(true);

        /**
         * @type {array}
         * @private
         */
        this._$layers = [];
    }

    /**
     * @description アンチエイリアスのサンプル数
     *              Number of anti-aliasing samples
     *
     * @member {number}
     * @readonly
     * @public
     */
    get samples ()
    {
        return this._$samples;
    }
    set samples (samples)
    {
        this._$samples = samples;
    }

    /**
     * @description 初期起動関数、CanvasToWebGLContextを起動
     *              Initial startup function, CanvasToWebGLContext
     *
     * @param  {HTMLCanvasElement} canvas
     * @param  {number} [samples=4]
     * @param  {number} [devicePixelRatio=2]
     * @return {void}
     * @method
     * @public
     */
    initialize (canvas, samples = 4, devicePixelRatio = 2)
    {
        // update
        $devicePixelRatio = devicePixelRatio;

        // setup
        this._$canvas  = canvas
        this._$samples = samples;

        const gl = canvas.getContext("webgl2", {
            "stencil": true,
            "premultipliedAlpha": true,
            "antialias": false,
            "depth": false,
            "preserveDrawingBuffer": true
        });

        this._$context = new CanvasToWebGLContext(gl, this.samples);
        this._$cacheStore._$context = this._$context;

        this._$maxTextureSize = $Math.min(8192,
            gl.getParameter(gl.MAX_TEXTURE_SIZE)
        ) - 2;

        globalThis.postMessage({
            "command": "initialize",
            "maxTextureSize": this._$maxTextureSize
        });
    }

    /**
     * @description 描画範囲をリサイズ
     *              Resize drawing area
     *
     * @param  {number} width
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    resize (width, height)
    {
        this._$canvas.width  = this._$width  = width;
        this._$canvas.height = this._$height = height;

        const context = this._$context;

        context._$gl.viewport(0, 0, width, height);

        const manager = context._$frameBufferManager;
        if (this._$buffer) {
            manager.unbind();
            manager.releaseAttachment(this._$buffer, true);
        }

        this._$buffer = manager
            .createCacheAttachment(width, height, false);

        // update cache max size
        manager._$stencilBufferPool._$maxWidth  = width;
        manager._$stencilBufferPool._$maxHeight = height;
        manager._$textureManager._$maxWidth     = width;
        manager._$textureManager._$maxHeight    = height;
        context._$pbo._$maxWidth                = width;
        context._$pbo._$maxHeight               = height;

        this._$cacheStore.reset();
    }

    /**
     * @description 描画の初期化
     *              Drawing initialization
     *
     * @return {void}
     * @method
     * @public
     */
    begin ()
    {
        const context = this._$context;

        context._$bind(this._$buffer);

        // reset
        Util.$resetContext(context);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, this._$width, this._$height);
        context.beginPath();
    }

    /**
     * @description 表示用のcanvasを更新
     *              Update canvas for display
     *
     * @return {void}
     * @method
     * @public
     */
    updateMain ()
    {
        const context = this._$context;

        const manager = context._$frameBufferManager;
        const texture = manager.getTextureFromCurrentAttachment();

        manager.unbind();

        // reset and draw to main canvas
        Util.$resetContext(context);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, this._$width, this._$height);
        context.drawImage(texture, 0, 0, this._$width, this._$height);

        // re bind
        context._$bind(this._$buffer);
    }

    /**
     * @description 転写したBitmapDataをメインcanvasに転写
     *
     * @param  {OffscreenCanvas} canvas
     * @param  {number} width
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    drawBitmapData (canvas, width, height)
    {
        this.updateMain();
        canvas.getContext("2d").drawImage(this._$canvas, 0, 0);
    }

    /**
     * @description 表示用のcanvasを更新
     *              Update canvas for display
     *
     * @param  {string|number|null} [background_color=null]
     * @return {void}
     * @method
     * @public
     */
    setBackgroundColor (background_color = null)
    {
        if (!background_color
            || background_color === "transparent"
        ) {

            this._$context._$setColor(0, 0, 0, 0);

        } else {

            this._$context._$setColor(
                background_color[0],
                background_color[1],
                background_color[2],
                background_color[3]
            );

        }
    }

    /**
     * @description textureの最大描画可能サイズからリサイズの比率を算出して返す
     *              Calculate and return the resize ratio from the maximum drawable size of texture
     *
     * @param  {number} width
     * @param  {number} height
     * @return {number}
     * @method
     * @public
     */
    getTextureScale (width, height)
    {
        const maxSize = Math.max(width, height);
        if (maxSize > this._$maxTextureSize) {
            return this._$maxTextureSize / maxSize;
        }
        return 1;
    }

    /**
     * @param  {array} filters
     * @param  {WebGLTexture} target_texture
     * @param  {Float32Array} matrix
     * @param  {number} width
     * @param  {number} height
     * @return {WebGLTexture}
     * @private
     */
    _$applyFilter (
        filters, target_texture,
        matrix, width, height
    ) {

        const context = this._$context;
        const manager = context._$frameBufferManager;

        const currentAttachment = manager.currentAttachment;

        const buffer = manager.createCacheAttachment(width, height);
        context._$bind(buffer);

        Util.$resetContext(context);

        const radianX = $Math.atan2(matrix[1], matrix[0]);
        const radianY = $Math.atan2(-matrix[2], matrix[3]);
        if (radianX || radianY) {

            const w = target_texture.width  / 2;
            const h = target_texture.height / 2;

            const a = $Math.cos(radianX);
            const b = $Math.sin(radianX);
            const c = -$Math.sin(radianY);
            const d = $Math.cos(radianY);

            const baseMatrix = Util.$getFloat32Array6(
                1, 0, 0, 1, -w, -h
            );
            const parentMatrix = Util.$getFloat32Array6(
                a, b, c, d,
                (width  - target_texture.width)  / 2,
                (height - target_texture.height) / 2
            );
            const multiMatrix = Util.$multiplicationMatrix(
                parentMatrix, baseMatrix
            );

            context.setTransform(a, b, c, d,
                multiMatrix[4] + w,
                multiMatrix[5] + h
            );

            // pool
            Util.$poolFloat32Array6(baseMatrix);
            Util.$poolFloat32Array6(parentMatrix);
            Util.$poolFloat32Array6(multiMatrix);

        } else {

            context.setTransform(1, 0, 0, 1, 0, 0);

        }

        context.drawImage(target_texture,
            0, 0, target_texture.width, target_texture.height
        );

        // init
        context._$offsetX = 0;
        context._$offsetY = 0;

        let texture = manager.getTextureFromCurrentAttachment();
        for (let idx = 0; idx < filters.length; ++idx) {

            const parameters = filters[idx];

            const filterClass = Util.$filters[parameters[0]];
            const filter = new (filterClass.bind.apply(filterClass, parameters))();

            texture = filter._$applyFilter(context, matrix);
        }

        let offsetX = context._$offsetX;
        let offsetY = context._$offsetY;

        // reset
        context._$offsetX = 0;
        context._$offsetY = 0;

        // set offset
        texture._$offsetX = offsetX;
        texture._$offsetY = offsetY;

        // cache texture
        texture.matrix =
            matrix[0] + "_" + matrix[1] + "_"
                + matrix[2] + "_" + matrix[3];

        texture.filterState = true;
        texture.layerWidth  = width;
        texture.layerHeight = height;

        context._$bind(currentAttachment);
        manager.releaseAttachment(buffer, false);

        return texture;
    }

    /**
     * @description 配列のフィルター処理を実行
     *
     * @param  {object} object
     * @param  {WebGLTexture} texture
     * @return {void}
     * @method
     * @public
     */
    applyFilter (object, texture)
    {
        const width  = object.width;
        const height = object.height;
        const matrix = object.matrix || Util.$poolFloat32Array6(1, 0, 0, 1, 0, 0);

        const cacheKeys = Util.$getArray(object.instanceId, "f");

        let cache = this._$cacheStore.get(cacheKeys);
        if (cache) {

            if (!object.updated && cache.filterState
                && cache.layerWidth === $Math.ceil(width)
                && cache.layerHeight === $Math.ceil(height)
                && cache.matrix === matrix[0] + "_" + matrix[1] + "_" + matrix[2] + "_" + matrix[3]
            ) {
                if (!object.matrix) {
                    Util.$poolFloat32Array6(matrix);
                }

                return cache;
            }

            // set null
            this._$cacheStore.set(cacheKeys, null);

            cache.layerWidth     = 0;
            cache.layerHeight    = 0;
            cache._$offsetX      = 0;
            cache._$offsetY      = 0;
            cache.matrix         = null;
            cache.colorTransform = null;

            this
                ._$context
                .frameBuffer
                .releaseTexture(cache);
        }

        cache = this._$applyFilter(
            object.filters, texture,
            matrix, width, height
        );

        this._$cacheStore.set(cacheKeys, cache);

        Util.$poolArray(cacheKeys);

        if (!object.matrix) {
            Util.$poolFloat32Array6(matrix);
        }

        return cache;
    }

    /**
     * @description Graphicsクラスの描画処理を実行
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @public
     */
    beginGraphics (object)
    {
        const context = this._$context;

        const matrix = object.matrix;
        const colorTransform = object.colorTransform;

        const baseBounds = object.baseBounds;
        const xMin = object.xMin;
        const yMin = object.yMin;
        const xScale = object.xScale;
        const yScale = object.yScale;

        let texture = this._$cacheStore.get(object.cacheKeys);
        if (!texture) {

            const manager = context._$frameBufferManager;
            const currentAttachment = manager.currentAttachment;

            // resize
            let width  = $Math.ceil($Math.abs(baseBounds.xMax - baseBounds.xMin) * xScale);
            let height = $Math.ceil($Math.abs(baseBounds.yMax - baseBounds.yMin) * yScale);
            const textureScale = this.getTextureScale(width, height);
            if (textureScale < 1) {
                width  *= textureScale;
                height *= textureScale;
            }

            // create cache buffer
            const buffer = manager
                .createCacheAttachment(width, height, true);
            context._$bind(buffer);

            Util.$resetContext(context);
            context.setTransform(
                xScale, 0, 0, yScale,
                -baseBounds.xMin * xScale,
                -baseBounds.yMin * yScale
            );

            if (object.hasGrid) {

                const baseMatrix = Util.$getFloat32Array6(
                    object.mScale, 0, 0, object.mScale, 0, 0
                );

                const pMatrix = Util.$multiplicationMatrix(
                    baseMatrix, object.parentMatrix
                );

                Util.$poolFloat32Array6(baseMatrix);

                const aMatrixBase = object.concatMatrix;

                const aMatrix = Util.$getFloat32Array6(
                    aMatrixBase[0], aMatrixBase[1], aMatrixBase[2], aMatrixBase[3],
                    aMatrixBase[4] * object.mScale - xMin,
                    aMatrixBase[5] * object.mScale - yMin
                );
                Util.$poolFloat32Array6(aMatrixBase);

                const apMatrix = Util.$multiplicationMatrix(
                    aMatrix, pMatrix
                );
                const aOffsetX = apMatrix[4] - (matrix[4] - xMin);
                const aOffsetY = apMatrix[5] - (matrix[5] - yMin);
                Util.$poolFloat32Array6(apMatrix);

                const parentBounds = Util.$boundsMatrix(baseBounds, pMatrix);
                const parentXMax   = +parentBounds.xMax;
                const parentXMin   = +parentBounds.xMin;
                const parentYMax   = +parentBounds.yMax;
                const parentYMin   = +parentBounds.yMin;
                const parentWidth  = $Math.ceil($Math.abs(parentXMax - parentXMin));
                const parentHeight = $Math.ceil($Math.abs(parentYMax - parentYMin));

                Util.$poolBoundsObject(parentBounds);

                context.grid.enable(
                    parentXMin, parentYMin, parentWidth, parentHeight,
                    baseBounds, object.scale9Grid, object.mScale,
                    pMatrix[0], pMatrix[1], pMatrix[2], pMatrix[3], pMatrix[4], pMatrix[5],
                    aMatrix[0], aMatrix[1], aMatrix[2], aMatrix[3], aMatrix[4] - aOffsetX, aMatrix[5] - aOffsetY
                );

                Util.$poolFloat32Array6(pMatrix);
                Util.$poolFloat32Array6(aMatrix);
            }

            // plain alpha
            if (colorTransform) {
                colorTransform[3] = 1;
            }

            // execute draw
            if (object.recodes) {
                this.drawGraphics(object.recodes, colorTransform);
            }

            if (object.hasGrid) {
                context.grid.disable();
            }

            texture = manager.getTextureFromCurrentAttachment();

            if (object.useCache) {
                this._$cacheStore.set(object.cacheKeys, texture);
            }

            // release buffer
            manager.releaseAttachment(buffer, false);

            // end draw and reset current buffer
            context._$bind(currentAttachment);
        }

        let offsetX = 0;
        let offsetY = 0;

        if (object.isFilter) {

            texture = this.applyFilter(object, texture);

            offsetX = texture._$offsetX;
            offsetY = texture._$offsetY;
        }

        let radianX = 0;
        let radianY = 0;
        if (matrix && !object.isFilter) {
            radianX = $Math.atan2(matrix[1], matrix[0]);
            radianY = $Math.atan2(-matrix[2], matrix[3]);
        }

        if (radianX || radianY) {

            const tx = baseBounds.xMin * xScale;
            const ty = baseBounds.yMin * yScale;

            const cosX = $Math.cos(radianX);
            const sinX = $Math.sin(radianX);
            const cosY = $Math.cos(radianY);
            const sinY = $Math.sin(radianY);

            context.setTransform(
                cosX, sinX, -sinY, cosY,
                tx * cosX - ty * sinY + matrix[4],
                tx * sinX + ty * cosY + matrix[5]
            );

        } else {

            context.setTransform(1, 0, 0, 1, xMin - offsetX, yMin - offsetY);

        }

        // reset
        Util.$resetContext(context);

        // draw setup
        context._$globalAlpha = object.alpha || 1;
        context._$imageSmoothingEnabled = true;
        context._$globalCompositeOperation = object.blendMode
            ? object.blendMode
            : BlendMode.NORMAL;

        context.drawImage(texture,
            0, 0, texture.width, texture.height, colorTransform
        );
    }

    /**
     * @param  {object} obj
     * @param  {number} total_width
     * @param  {number} width
     * @return {number}
     * @private
     */
    getAlignOffset (obj, total_width, width)
    {
        // default
        const textFormat = obj.textFormat;
        const indent     = textFormat._$blockIndent + textFormat._$leftMargin > 0
            ? textFormat._$blockIndent + textFormat._$leftMargin
            : 0;

        switch (true) {

            // wordWrap case
            case this._$wordWrap === false && total_width > width:
                return $Math.max(0, indent);

            case textFormat._$align === TextFormatAlign.CENTER: // format CENTER
            case this._$autoSize === TextFieldAutoSize.CENTER: // autoSize CENTER
                return $Math.max(0, width / 2 - indent - textFormat._$rightMargin - totalWidth / 2);

            case textFormat._$align === TextFormatAlign.RIGHT: // format RIGHT
            case this._$autoSize === TextFieldAutoSize.RIGHT: // autoSize RIGHT
                return $Math.max(0, width - indent - total_width - textFormat._$rightMargin - 2);

            // autoSize LEFT
            // format LEFT
            default:
                return $Math.max(0, indent + 2);

        }
    }

    /**
     * @param  {object} object
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} [color_transform = null]
     * @param  {number} width
     * @return {void}
     * @method
     * @private
     */
    _$drawText (object, context, matrix, color_transform = null, width)
    {
        const textData        = object.textData;
        const limitWidth      = object.limitWidth;
        const limitHeight     = object.limitHeight;
        const textHeight      = object.textHeight;
        const verticalAlign   = object.verticalAlign;
        const autoSize        = object.autoSize;
        const scrollV         = object.scrollV;
        const thickness       = object.thickness;
        const thicknessColor  = object.thicknessColor;
        const widthTable      = object.widthTable;
        const heightTable     = object.heightTable;
        const textHeightTable = object.textHeightTable;
        const objectTable     = object.objectTable;

        // setup
        let xOffset      = 0;
        let offsetHeight = 0;
        let currentV     = 0;

        let yOffset = 0;
        if (verticalAlign !== TextFormatVerticalAlign.TOP
            && limitHeight > textHeight
        ) {

            switch (verticalAlign) {

                case TextFormatVerticalAlign.MIDDLE:
                    yOffset = (limitHeight - textHeight + 2) / 2;
                    break;

                case TextFormatVerticalAlign.BOTTOM:
                    yOffset = limitHeight - textHeight + 2;
                    break;

            }

        }

        const length = textData.length;
        for (let idx = 0; idx < length; ++idx) {

            let obj = textData[idx];
            if (obj.width === 0) {
                continue;
            }

            // check
            const offsetWidth = xOffset + obj.x;
            if (autoSize === TextFieldAutoSize.NONE
                && (offsetHeight > limitHeight || offsetWidth > limitWidth)
            ) {
                continue;
            }

            let tf = obj.textFormat;

            // color
            const rgb   = Util.$intToRGBA(obj.textFormat._$color);
            const alpha = color_transform
                ? $Math.max(0, $Math.min(rgb.A * 255 * color_transform[3] + color_transform[7], 255)) / 255
                : rgb.A;

            context.fillStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;

            if (thickness) {
                const rgb   = Util.$intToRGBA(thicknessColor);
                const alpha = color_transform
                    ? $Math.max(0, $Math.min(rgb.A * 255 * color_transform[3] + color_transform[7], 255)) / 255
                    : rgb.A;
                context.lineWidth   = thickness;
                context.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
            }

            const yIndex = obj.yIndex | 0;
            switch (obj.mode) {

                case TextMode.BREAK:
                case TextMode.WRAP:

                    currentV++;

                    if (scrollV > currentV) {
                        continue;
                    }

                    offsetHeight += textHeightTable[yIndex];
                    xOffset = this.getAlignOffset(objectTable[yIndex], widthTable[yIndex], width);
                    if (tf._$underline) {

                        const offset = obj.textFormat._$size / 12;

                        const rgb   = Util.$intToRGBA(tf._$color);
                        const alpha = color_transform
                            ? $Math.max(0, $Math.min(rgb.A * 255 * color_transform[3] + color_transform[7], 255)) / 255
                            : rgb.A;

                        context.lineWidth   = $Math.max(1, 1 / $Math.min(matrix[0], matrix[3]));
                        context.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;

                        context.beginPath();
                        context.moveTo(xOffset, yOffset + offsetHeight - offset);
                        context.lineTo(xOffset + widthTable[yIndex], yOffset + offsetHeight - offset);
                        context.stroke();

                    }

                    break;

                case TextMode.TEXT:
                    {
                        if (scrollV > currentV) {
                            continue;
                        }

                        let offsetY = offsetHeight - heightTable[0];
                        if (!object.isSafari) {
                            offsetY += 2 * (obj.textFormat._$size / 12);
                        }

                        context.beginPath();
                        context.textBaseline = "top";
                        context.font = Util.$generateFontStyle(
                            tf._$font, tf._$size, tf._$italic, tf._$bold
                        );

                        if (thickness) {
                            context.strokeText(obj.text, offsetWidth, yOffset + offsetY);
                        }

                        context.fillText(obj.text, offsetWidth, yOffset + offsetY);

                    }
                    break;

                case TextMode.IMAGE:

                    if (!obj.loaded) {
                        continue;
                    }

                    context.beginPath();
                    context.drawImage(obj.image,
                        obj.hspace, yOffset + obj.y,
                        obj.width, obj.height
                    );

                    break;

            }
        }
    }

    /**
     * @description Videoを描画
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @public
     */
    drawVideo (object)
    {
        const context = this._$context;

        const matrix         = object.matrix;
        const colorTransform = object.colorTransform;

        const manager = context._$frameBufferManager;

        let texture = manager.createTextureFromImage(
            object.imageBitmap, object.smoothing
        );

        if (object.isFilter) {

            texture = this.applyFilter(object, texture);

            // reset
            Util.$resetContext(context);

            // draw
            context._$globalAlpha = object.alpha || 1;
            context._$imageSmoothingEnabled = object.smoothing;
            context._$globalCompositeOperation = object.blendMode;

            // size
            const bounds = Util.$boundsMatrix(object.baseBounds, matrix);
            context.setTransform(1, 0, 0, 1,
                bounds.xMin - texture._$offsetX,
                bounds.yMin - texture._$offsetY
            );
            context.drawImage(texture,
                0, 0, texture.width, texture.height,
                colorTransform
            );

            // pool
            Util.$poolBoundsObject(bounds);

        } else {

            // reset
            Util.$resetContext(context);

            // draw
            context._$globalAlpha = object.alpha || 1;
            context._$imageSmoothingEnabled = object.smoothing;
            context._$globalCompositeOperation = object.blendMode;

            context.setTransform(
                matrix[0], matrix[1], matrix[2],
                matrix[3], matrix[4], matrix[5]
            );

            context.drawImage(
                texture, 0, 0,
                texture.width, texture.height, colorTransform
            );

        }

        manager.releaseTexture(texture);
    }

    /**
     * @description テキストエリアを描画
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @public
     */
    drawText (object)
    {
        const context = this._$context;

        // params
        const baseBounds     = object.baseBounds;
        const xScale         = object.xScale;
        const yScale         = object.yScale;
        const instanceId     = object.instanceId;
        const colorTransform = object.colorTransform;
        const matrix         = object.matrix;
        const xMin           = object.xMin;
        const yMin           = object.yMin;

        const cacheStore = this._$cacheStore;
        const cacheKeys  = cacheStore.generateKeys(
            instanceId, object.cacheKeys
        );

        let texture = cacheStore.get(cacheKeys);
        if (object.updated) {
            cacheStore.removeCache(instanceId);
            texture = null;
        }

        if (!texture) {

            // resize
            const lineWidth  = $Math.min(1, $Math.max(xScale, yScale));
            const baseWidth  = $Math.ceil($Math.abs(baseBounds.xMax - baseBounds.xMin) * xScale);
            const baseHeight = $Math.ceil($Math.abs(baseBounds.yMax - baseBounds.yMin) * yScale);

            // alpha reset
            if (colorTransform) {
                colorTransform[3] = 1;
            }

            // new canvas
            const canvas = new $OffscreenCanvas(
                baseWidth  + lineWidth * 2,
                baseHeight + lineWidth * 2
            );
            const ctx = canvas.getContext("2d");

            // border and background
            if (object.background || object.border) {

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(baseWidth, 0);
                ctx.lineTo(baseWidth, baseHeight);
                ctx.lineTo(0, baseHeight);
                ctx.lineTo(0, 0);

                if (object.background) {

                    const rgb   = Util.$intToRGBA(object.backgroundColor);
                    const alpha = colorTransform
                        ? $Math.max(0, $Math.min(rgb.A * 255 * colorTransform[3] + colorTransform[7], 255)) / 255
                        : rgb.A;

                    ctx.fillStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
                    ctx.fill();
                }

                if (object.border) {

                    const rgb   = Util.$intToRGBA(object.borderColor);
                    const alpha = colorTransform
                        ? $Math.max(0, $Math.min(rgb.A * 255 * colorTransform[3] + colorTransform[7], 255)) / 255
                        : rgb.A;

                    ctx.lineWidth   = lineWidth;
                    ctx.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
                    ctx.stroke();

                }

            }

            // mask start
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(2, 2);
            ctx.lineTo(baseWidth - 2, 2);
            ctx.lineTo(baseWidth - 2, baseHeight - 2);
            ctx.lineTo(2, baseHeight - 2);
            ctx.lineTo(2, 2);
            ctx.clip();

            ctx.beginPath();
            ctx.setTransform(xScale, 0, 0, yScale, 0, 0);
            this._$drawText(object, ctx, matrix, colorTransform, baseWidth / matrix[0]);
            ctx.restore();

            texture = context
                .frameBuffer
                .createTextureFromCanvas(ctx.canvas);

            // set cache
            if (Util.$useCache) {
                cacheStore.set(cacheKeys, texture);
            }

        }

        let offsetX = 0;
        let offsetY = 0;

        if (object.isFilter) {

            texture = this.applyFilter(object, texture);

            offsetX = texture._$offsetX;
            offsetY = texture._$offsetY;
        }

        let radianX = 0;
        let radianY = 0;
        if (matrix && !object.isFilter) {
            radianX = $Math.atan2(matrix[1], matrix[0]);
            radianY = $Math.atan2(-matrix[2], matrix[3]);
        }

        if (radianX || radianY) {

            const tx = baseBounds.xMin * xScale;
            const ty = baseBounds.yMin * yScale;

            const cosX = $Math.cos(radianX);
            const sinX = $Math.sin(radianX);
            const cosY = $Math.cos(radianY);
            const sinY = $Math.sin(radianY);

            context.setTransform(
                cosX, sinX, -sinY, cosY,
                tx * cosX - ty * sinY + matrix[4],
                tx * sinX + ty * cosY + matrix[5]
            );

        } else {

            context.setTransform(1, 0, 0, 1, xMin - offsetX, yMin - offsetY);

        }

        // reset
        Util.$resetContext(context);

        // draw setup
        context._$globalAlpha = object.alpha || 1;
        context._$imageSmoothingEnabled = true;
        context._$globalCompositeOperation = object.blendMode
            ? object.blendMode
            : BlendMode.NORMAL;

        context.drawImage(texture,
            0, 0, texture.width, texture.height, colorTransform
        );
    }

    /**
     * @description テキストエリアのマスクを描画
     *
     * @param  {number} width
     * @param  {number} height
     * @param  {Float32Array} matrix
     * @return {void}
     * @method
     * @public
     */
    clipText (width, height, matrix)
    {
        const context = this._$context;

        Util.$resetContext(context);
        context.setTransform(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5]
        );
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(width, 0);
        context.lineTo(width, height);
        context.lineTo(0, height);
        context.lineTo(0, 0);
        context.clip(true);
    }

    /**
     * @description Graphicsクラスのマスク描画処理を実行
     *
     * @param  {Float32Array} recodes
     * @param  {Float32Array} matrix
     * @return {void}
     * @method
     * @public
     */
    clipGraphics (recodes, matrix)
    {
        const context = this._$context;

        Util.$resetContext(context);

        context.setTransform(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5]
        );

        this.drawGraphics(recodes, null, true);

        context.clip();
    }

    /**
     * @description strokeのセットアップ
     *
     * @param {number} line_width
     * @param {number} line_cap
     * @param {number} line_join
     * @param {number} miter_limit
     * @return {void}
     * @method
     * @public
     */
    setupStroke (line_width, line_cap, line_join, miter_limit)
    {
        const context = this._$context;

        context.lineWidth = line_width;

        switch (line_cap) {

            case 0:
                context.lineCap = CapsStyle.NONE;
                break;

            case 1:
                context.lineCap = CapsStyle.ROUND;
                break;

            case 2:
                context.lineCap = CapsStyle.SQUARE;
                break;

        }

        switch (line_join) {

            case 0:
                context.lineJoin = JointStyle.BEVEL;
                break;

            case 1:
                context.lineJoin = JointStyle.MITER;
                break;

            case 2:
                context.lineJoin = JointStyle.ROUND;
                break;

        }

        context.miterLimit = miter_limit;
    }

    /**
     * @description CanvasGradientToWebGLオブジェクトを生成
     *
     * @param {number} type
     * @param {array} stops
     * @param {Float32Array} matrix
     * @param {number} spread
     * @param {number} interpolation
     * @param {number} focal
     * @param {Float32Array} [color_transform=null]
     * @return {CanvasGradientToWebGL}
     * @method
     * @public
     */
    createGradientStyle (
        type, stops, matrix,
        spread, interpolation, focal,
        color_transform = null
    ) {

        const context = this._$context;

        let spreadMethod = "pad";
        switch (spread) {

            case 0:// REFLECT
                spreadMethod = "reflect";
                break;

            case 1: // REPEAT
                spreadMethod = "repeat";
                break;

        }

        let css = null;
        if (type === 0) {

            // LINEAR
            const xy = Util.$linearGradientXY(matrix);
            css = context.createLinearGradient(
                xy[0], xy[1], xy[2], xy[3],
                interpolation ? "rgb" : "linearRGB",
                spreadMethod
            );

        } else {

            // RADIAL
            context.save();
            context.transform(
                matrix[0], matrix[1], matrix[2],
                matrix[3], matrix[4], matrix[5]
            );

            css = context.createRadialGradient(
                0, 0, 0, 0, 0, 819.2,
                interpolation ? "rgb" : "linearRGB",
                spreadMethod, focal
            );

        }

        for (let idx = 0; idx < stops.length; ++idx) {

            const color = stops[idx];

            if (!color_transform) {

                css.addColorStop(color.ratio,
                    Util.$getFloat32Array4(
                        $Math.max(0, $Math.min(color.R, 255)),
                        $Math.max(0, $Math.min(color.G, 255)),
                        $Math.max(0, $Math.min(color.B, 255)),
                        $Math.max(0, $Math.min(color.A, 255))
                    )
                );

            } else {

                css.addColorStop(color.ratio, Util.$getFloat32Array4(
                    $Math.max(0, $Math.min(color.R * color_transform[0] + color_transform[4], 255)),
                    $Math.max(0, $Math.min(color.G * color_transform[1] + color_transform[5], 255)),
                    $Math.max(0, $Math.min(color.B * color_transform[2] + color_transform[6], 255)),
                    $Math.max(0, $Math.min(color.A * color_transform[3] + color_transform[7], 255))
                ));

            }
        }

        return css;
    }

    /**
     * @description Graphicsクラスの描画を実行
     *              Execute drawing in the Graphics class
     *
     * @param  {Float32Array} recodes
     * @param  {Float32Array} [color_transform=null]
     * @param  {boolean} [is_clip=false]
     * @return {void}
     * @method
     * @public
     */
    drawGraphics (recodes, color_transform = null, is_clip = false)
    {
        const context = this._$context;

        Util.$resetContext(context);
        context.beginPath();

        const length = recodes.length;
        for (let idx = 0; idx < length; ) {

            switch (recodes[idx++]) {

                case 9: // BEGIN_PATH
                    context.beginPath();
                    break;

                case 0: // MOVE_TO
                    context.moveTo(recodes[idx++], recodes[idx++]);
                    break;

                case 2: // LINE_TO
                    context.lineTo(recodes[idx++], recodes[idx++]);
                    break;

                case 1: // CURVE_TO
                    context.quadraticCurveTo(
                        recodes[idx++], recodes[idx++],
                        recodes[idx++], recodes[idx++]
                    );
                    break;

                case 5: // FILL_STYLE
                    {
                        if (is_clip) {
                            idx += 4;
                            continue;
                        }

                        const fillStyle = context._$contextStyle;

                        fillStyle._$fillStyle[0] = recodes[idx++] / 255;
                        fillStyle._$fillStyle[1] = recodes[idx++] / 255;
                        fillStyle._$fillStyle[2] = recodes[idx++] / 255;

                        fillStyle._$fillStyle[3] = !color_transform || color_transform[3] === 1 && color_transform[7] === 0
                            ? recodes[idx++] / 255
                            : $Math.max(0, $Math.min(
                                recodes[idx++] * color_transform[3] + color_transform[7], 255)
                            ) / 255;

                        context._$style = fillStyle;
                    }
                    break;

                case 7: // END_FILL

                    if (!is_clip) {
                        context.fill();
                    }

                    break;

                case 6: // STROKE_STYLE
                    {
                        if (is_clip) {
                            idx += 8;
                            continue;
                        }

                        this.setupStroke(
                            recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++]
                        );

                        const strokeStyle = context._$contextStyle;

                        strokeStyle._$strokeStyle[0] = recodes[idx++] / 255;
                        strokeStyle._$strokeStyle[1] = recodes[idx++] / 255;
                        strokeStyle._$strokeStyle[2] = recodes[idx++] / 255;

                        strokeStyle._$strokeStyle[3] = !color_transform || color_transform[3] === 1 && color_transform[7] === 0
                            ? recodes[idx++] / 255
                            : $Math.max(0, $Math.min(
                                recodes[idx++] * color_transform[3] + color_transform[7], 255)
                        ) / 255;

                        context._$style = strokeStyle;
                    }
                    break;

                case 8: // END_STROKE
                    if (!is_clip) {
                        context.stroke();
                    }
                    break;

                case 12: // CLOSE_PATH
                    context.closePath();
                    break;

                case 3: // CUBIC
                    context.bezierCurveTo(
                        recodes[idx++], recodes[idx++],
                        recodes[idx++], recodes[idx++],
                        recodes[idx++], recodes[idx++]
                    );
                    break;

                case 4: // ARC
                    context.arc(
                        recodes[idx++], recodes[idx++], recodes[idx++],
                        0, 2 * $Math.PI
                    );
                    break;

                case 10: // GRADIENT_FILL
                    {
                        if (is_clip) {
                            idx += 1;
                            const length = recodes[idx++];
                            idx += length * 5;
                            idx += 9;
                            continue;
                        }

                        const type = recodes[idx++];

                        let stopLength = recodes[idx++];

                        const stops = Util.$getArray();
                        while (stopLength) {
                            stops.push({
                                "ratio": recodes[idx++],
                                "R": recodes[idx++],
                                "G": recodes[idx++],
                                "B": recodes[idx++],
                                "A": recodes[idx++]
                            });
                            stopLength--;
                        }

                        const matrix = Util.$getFloat32Array6(
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++], recodes[idx++]
                        );

                        context.fillStyle = this.createGradientStyle(
                            type, stops, matrix,
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            color_transform
                        );

                        context.fill();

                        // if RADIAL
                        if (type === 1) {
                            context.restore();
                        }

                        Util.$poolFloat32Array6(matrix);
                        Util.$poolArray(stops);
                    }
                    break;

                case 11: // GRADIENT_STROKE
                    {
                        if (is_clip) {
                            idx += 5;
                            const length = recodes[idx++];
                            idx += length * 5;
                            idx += 9;
                            continue;
                        }

                        this.setupStroke(
                            recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++]
                        );

                        const type = recodes[idx++];

                        let stopLength = recodes[idx++];

                        const stops = Util.$getArray();
                        while (stopLength) {
                            stops.push({
                                "ratio": recodes[idx++],
                                "R": recodes[idx++],
                                "G": recodes[idx++],
                                "B": recodes[idx++],
                                "A": recodes[idx++]
                            });
                            stopLength--;
                        }

                        const matrix = Util.$getFloat32Array6(
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++], recodes[idx++]
                        );

                        context.strokeStyle = this.createGradientStyle(
                            type, stops, matrix,
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            color_transform
                        );

                        context.stroke();

                        // if RADIAL
                        if (type === 1) {
                            context.restore();
                        }

                        Util.$poolFloat32Array6(matrix);
                        Util.$poolArray(stops);
                    }
                    break;

                case 13: // BITMAP_FILL
                    {
                        const width  = recodes[idx++];
                        const height = recodes[idx++];
                        const graphicsWidth  = recodes[idx++];
                        const graphicsHeight = recodes[idx++];
                        const bitmapLength = recodes[idx++];
                        if (is_clip) {
                            idx += bitmapLength;
                            idx += 8;
                            continue;
                        }

                        const buffer = new Uint8Array(
                            recodes.subarray(idx, bitmapLength + idx)
                        );

                        idx += bitmapLength;
                        const matrix = Util.$getFloat32Array6(
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++], recodes[idx++]
                        );

                        const repeat = recodes[idx++] ? "repeat" : "no-repeat";
                        const smooth = !!recodes[idx++];

                        context.save();

                        if (matrix[0] !== 1 || matrix[1] !== 0
                            || matrix[2] !== 0 || matrix[3] !== 1
                            || matrix[4] !== 0 || matrix[5] !== 0
                        ) {
                            context.transform(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );
                        }
                        Util.$poolFloat32Array6(matrix);

                        const manager = context._$frameBufferManager;
                        const texture = manager.createTextureFromPixels(
                            width, height, buffer, true
                        );

                        if (repeat === "no-repeat"
                            && width  === graphicsWidth
                            && height === graphicsHeight
                        ) {

                            context.drawImage(texture, 0, 0, width, height);
                            manager.releaseTexture(texture);

                        } else {

                            context.fillStyle = context.createPattern(
                                texture, repeat, color_transform
                            );

                            context._$imageSmoothingEnabled = smooth;
                            context.fill();

                        }

                        // restore
                        context.restore();
                        context._$imageSmoothingEnabled = false;

                    }
                    break;

                case 14: // BITMAP_STROKE
                    {
                        if (is_clip) {
                            idx += 4;
                            const bitmapLength = recodes[idx++];
                            idx += bitmapLength;
                            idx += 8;
                            continue;
                        }

                        context.save();

                        this.setupStroke(
                            recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++]
                        );

                        const width  = recodes[idx++];
                        const height = recodes[idx++];
                        const bitmapLength = recodes[idx++];

                        const buffer = new Uint8Array(
                            recodes.subarray(idx, bitmapLength + idx)
                        );

                        idx += bitmapLength;
                        const matrix = Util.$getFloat32Array6(
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++], recodes[idx++]
                        );

                        if (matrix[0] !== 1 || matrix[1] !== 0
                            || matrix[2] !== 0 || matrix[3] !== 1
                            || matrix[4] !== 0 || matrix[5] !== 0
                        ) {
                            context.transform(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );
                        }
                        Util.$poolFloat32Array6(matrix);

                        const repeat = recodes[idx++] ? "repeat" : "no-repeat";
                        const smooth = !!recodes[idx++];

                        const manager = context._$frameBufferManager;
                        const texture = manager.createTextureFromPixels(
                            width, height, buffer, true
                        );

                        context.strokeStyle = context.createPattern(
                            texture, repeat, color_transform
                        );

                        context._$imageSmoothingEnabled = smooth;
                        context.stroke();

                        // restore
                        context.restore();
                        context._$imageSmoothingEnabled = false;
                    }
                    break;

                default:
                    break;

            }
        }
    }

    /**
     * @description マスク処理の開始関数
     *              Mask processing start function
     *
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    startClip (x, y, width, height)
    {
        const context = this._$context;

        context._$cacheCurrentBounds.x = x;
        context._$cacheCurrentBounds.y = y;
        context._$cacheCurrentBounds.w = width;
        context._$cacheCurrentBounds.h = height;

        const manager = context._$frameBufferManager;
        const currentAttachment = manager.currentAttachment;

        context._$cacheCurrentBuffer = currentAttachment;
        const texture = currentAttachment.texture;

        // create new buffer
        context._$bind(
            manager.createCacheAttachment(width, height, true)
        );

        // draw background
        Util.$resetContext(context);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.drawImage(texture, -x, -y, texture.width, texture.height);
    }

    /**
     * @description Videoクラスのマスク処理
     *
     * @return {void}
     * @method
     * @public
     */
    clipVideo (width, height, matrix)
    {
        const context = this._$context;

        Util.$resetContext(context);
        context.setTransform(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5]
        );

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(width, 0);
        context.lineTo(width, height);
        context.lineTo(0, height);
        context.lineTo(0, 0);
        context.clip(true);
    }

    /**
     * @description フィルター、ブレンドモードの事後処理
     *
     * @param  {number} instance_id
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @param  {object} object
     * @return {void}
     * @method
     * @public
     */
    postDraw (instance_id, matrix, color_transform, object)
    {
        const context = this._$context;

        // cache
        const cacheKeys = Util.$getArray(instance_id, "f");

        const cacheStore = this._$cacheStore;
        const manager = context._$frameBufferManager;

        // cache or new texture
        let texture = null;
        if (object.isUpdated) {

            texture = manager.getTextureFromCurrentAttachment();

            const cacheTexture = cacheStore.get(cacheKeys);
            if (cacheTexture) {
                cacheStore.set(cacheKeys, null);
                manager.releaseTexture(cacheTexture);
            }

        } else {

            texture = cacheStore.get(cacheKeys);

        }

        // blend only
        if (!object.canApply) {
            texture._$offsetX = 0;
            texture._$offsetY = 0;
        }

        // set cache offset
        let offsetX = texture._$offsetX;
        let offsetY = texture._$offsetY;

        // execute filter
        if (object.isUpdated && object.canApply) {

            // cache clear
            let cache = cacheStore.get(cacheKeys);
            if (cache) {

                // reset cache params
                cacheStore.set(cacheKeys, null);
                cache.layerWidth     = 0;
                cache.layerHeight    = 0;
                cache._$offsetX      = 0;
                cache._$offsetY      = 0;
                cache.matrix         = null;
                cache.colorTransform = null;
                manager.releaseTexture(cache);

                cache  = null;
            }

            // apply filter
            const length = object.filters.length;
            if (length) {

                // init
                context._$offsetX = 0;
                context._$offsetY = 0;

                texture = this._$applyFilter(
                    object.filters, texture, matrix,
                    object.layerWidth, object.layerHeight
                );

                offsetX = context._$offsetX;
                offsetY = context._$offsetY;

                // reset
                context._$offsetX = 0;
                context._$offsetY = 0;

                // set offset
                texture._$offsetX = offsetX;
                texture._$offsetY = offsetY;

            }
        }

        // update cache params
        if (object.isUpdated) {

            texture.filterState = object.canApply;

            // cache texture
            const mat = object.baseMatrix;
            texture.matrix = mat[0] + "_" + mat[1] + "_"
                + mat[2] + "_" + mat[3];

            texture.layerWidth  = object.layerWidth;
            texture.layerHeight = object.layerHeight;
        }

        // cache texture
        cacheStore.set(cacheKeys, texture);
        Util.$poolArray(cacheKeys);

        // set current buffer
        if (object.isUpdated) {
            context._$restoreAttachment();
        }

        // set
        Util.$resetContext(context);

        context._$globalAlpha = Util.$clamp(
            color_transform[3] + color_transform[7] / 255, 0, 1
        );
        context._$globalCompositeOperation = object.blendMode;

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.drawImage(texture,
            -offsetX + object.position.dx,
            -offsetY + object.position.dy,
            texture.width, texture.height,
            color_transform
        );
    }

    /**
     * @description 処理を実行
     *              Execute process
     *
     * @return {void}
     * @method
     * @public
     */
    execute ()
    {
        state = "active";

        while (queue.length) {

            if (this._$wait) {
                continue;
            }

            const object = queue.shift();
            switch (object.command) {

                case "initialize":
                    this.initialize(
                        object.canvas, object.samples, object.devicePixelRatio
                    );
                    break;

                case "resize":
                    this.resize(object.width, object.height);
                    break;

                case "begin":
                    this.begin();
                    break;

                case "updateMain":
                    this.updateMain();
                    break;

                case "setBackgroundColor":
                    this.setBackgroundColor(object.backgroundColor);
                    break;

                case "beginGraphics":
                    this.beginGraphics(object);
                    break;

                case "clipGraphics":
                    this.clipGraphics(
                        object.recodes, object.matrix
                    );
                    break;

                case "save":
                    this._$context.save();
                    break;

                case "restore":
                    this._$context.restore();
                    break;

                case "startClip":
                    this.startClip(
                        object.x, object.y,
                        object.width, object.height
                    );
                    break;

                case "enterClip":
                    this._$context._$enterClip();
                    break;

                case "leaveClip":
                    this._$context._$leaveClip();
                    break;

                case "beginClipDef":
                    this._$context._$beginClipDef();
                    break;

                case "endClipDef":
                    this._$context._$endClipDef();
                    break;

                case "updateContainerClipFlag":
                    this
                        ._$context
                        ._$mask
                        ._$containerClip = object.flag;
                    break;

                case "drawContainerClip":
                    this._$context._$drawContainerClip();
                    break;

                case "postDraw":
                    this.postDraw(
                        object.instanceId,
                        object.matrix,
                        object.colorTransform,
                        object.object
                    );
                    break;

                case "drawText":
                    this.drawText(object);
                    break;

                case "drawVideo":
                    this.drawVideo(object);
                    break;

                case "clipText":
                    this.clipText(object.width, object.height, object.matrix);
                    break;

                case "clipVideo":
                    this.clipVideo(object.width, object.height, object.matrix);
                    break;

                case "startLayer":
                    this._$context._$startLayer(object.position);
                    break;

                case "endLayer":
                    this._$context._$endLayer();
                    break;

                case "saveCurrentMask":
                    this._$context._$saveCurrentMask();
                    break;

                case "restoreCurrentMask":
                    this._$context._$restoreCurrentMask();
                    break;

                case "saveAttachment":
                    this._$context._$saveAttachment(
                        object.width, object.height, object.multisample
                    );
                    break;

                case "restoreAttachment":
                    this._$context._$restoreAttachment();
                    break;

                case "cacheClear":
                    this._$cacheStore.reset();
                    break;

                case "drawBitmapData":
                    this.drawBitmapData(
                        object.canvas, object.width, object.height
                    );
                    break;

                default:
                    break;

            }
        }

        state = "deactivate";
    }

}
const command = new CommandController();

/**
 * @public
 */
this.addEventListener("message", function (event)
{
    queue.push(event.data);
    if (state === "deactivate") {
        command.execute();
    }
});