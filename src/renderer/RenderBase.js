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
         * @type {boolean}
         * @default false
         * @private
         */
        this._$wait = false;
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

        const gl = canvas.getContext("webgl2", {
            "stencil": true,
            "premultipliedAlpha": true,
            "antialias": false,
            "depth": false,
            "preserveDrawingBuffer": true
        });

        const player = Util.$renderPlayer;
        player._$samples = samples;
        player._$canvas  = canvas;

        const context = new CanvasToWebGLContext(gl, samples);
        player._$context = context;
        player._$cacheStore._$context = context;
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
        const player = Util.$renderPlayer;

        if (!background_color
            || background_color === "transparent"
        ) {

            player._$context._$setColor(0, 0, 0, 0);

        } else {

            player._$context._$setColor(
                background_color[0],
                background_color[1],
                background_color[2],
                background_color[3]
            );

        }
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

                case "setProperty":
                    {
                        const instances = Util.$renderPlayer._$instances;
                        if (!instances.has(object.instanceId)) {
                            continue;
                        }

                        instances.get(object.instanceId)._$update(object);
                    }
                    break;

                case "setChildren":
                    {
                        const instances = Util.$renderPlayer._$instances;
                        if (!instances.has(object.instanceId)) {
                            continue;
                        }
                        instances.get(object.instanceId)._$children = object.children;
                    }
                    break;

                case "doChanged":
                    {
                        const instances = Util.$renderPlayer._$instances;
                        if (!instances.has(object.instanceId)) {
                            continue;
                        }
                        instances.get(object.instanceId)._$updated = true;
                    }
                    break;

                case "remove":
                    {
                        const instances = Util.$renderPlayer._$instances;
                        if (!instances.has(object.instanceId)) {
                            continue;
                        }

                        const instance = instances.get(object.instanceId);
                        instance._$remove();

                        instances.delete(object.instanceId);
                    }
                    break;

                case "createShape":
                    Util.$renderPlayer._$createShape(object);
                    break;

                case "createDisplayObjectContainer":
                    Util.$renderPlayer._$createDisplayObjectContainer(object);
                    break;

                case "resize":
                    Util.$renderPlayer._$resize(
                        object.width,
                        object.height,
                        object.scale,
                        object.tx,
                        object.ty
                    );
                    break;

                case "initialize":
                    this.initialize(
                        object.canvas, object.samples, object.devicePixelRatio
                    );
                    break;

                case "setBackgroundColor":
                    this.setBackgroundColor(object.backgroundColor);
                    break;

                case "setStage":
                    Util.$renderPlayer._$setStage(
                        object.instanceId
                    );
                    break;

                case "play":
                    Util.$renderPlayer._$frameRate = object.frameRate;
                    Util.$renderPlayer.play();
                    break;

                case "stop":
                    Util.$renderPlayer.stop();
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