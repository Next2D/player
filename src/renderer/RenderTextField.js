/**
 * @class
 */
class RenderTextField extends RenderDisplayObject
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$renew = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$background = false;

        /**
         * @type {number}
         * @default 0xffffff
         * @private
         */
        this._$backgroundColor = 0xffffff;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$border = false;

        /**
         * @type {number}
         * @default 0x000000
         * @private
         */
        this._$borderColor = 0x000000;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$textData = null;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$textAreaActive = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$thickness = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$thicknessColor = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$limitWidth = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$limitHeight = 0;

        /**
         * @type {string}
         * @default TextFieldAutoSize.NONE
         * @private
         */
        this._$autoSize = TextFieldAutoSize.NONE;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$widthTable = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$heightTable = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$objectTable = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$textHeightTable = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$xMin = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$yMin = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$xMax = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$yMax = 0;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$maxScrollV = null;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$textHeight = null;

        /**
         * @type {string}
         * @default TextFormatVerticalAlign.TOP
         * @private
         */
        this._$verticalAlign = TextFormatVerticalAlign.TOP;
    }

    /**
     * @description 表示オブジェクトの幅を示します（ピクセル単位）。
     *              Indicates the width of the display object, in pixels.
     *
     * @member {number}
     * @public
     */
    get width ()
    {
        const bounds = Util.$boundsMatrix(
            this._$getBounds(null),
            this._$matrix
        );

        const width = $Math.abs(bounds.xMax - bounds.xMin);
        Util.$poolBoundsObject(bounds);

        switch (true) {

            case width === 0:
            case width === $Infinity:
            case width === -$Infinity:
                return 0;

            default:
                return width;

        }
    }

    /**
     * @description 表示オブジェクトの高さを示します（ピクセル単位）。
     *              Indicates the height of the display object, in pixels.
     *
     * @member {number}
     * @public
     */
    get height ()
    {
        const bounds = Util.$boundsMatrix(
            this._$getBounds(null),
            this._$matrix
        );

        const height = $Math.abs(bounds.yMax - bounds.yMin);

        // object pool
        Util.$poolBoundsObject(bounds);

        switch (height) {

            case 0:
            case $Infinity:
            case -$Infinity:
                return 0;

            default:
                return height;

        }
    }

    /**
     * @description scrollV の最大値です。
     *              The maximum value of scrollV.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get maxScrollV ()
    {
        if (this._$maxScrollV === null) {

            this._$maxScrollV = 1;

            const length    = this._$textHeightTable.length;
            const maxHeight = this.height;

            if (maxHeight > this._$textHeight) {
                return this._$maxScrollV;
            }

            let textHeight = 0;

            let idx = 0;
            while (length > idx) {

                textHeight += this._$textHeightTable[idx];
                if (textHeight > maxHeight) {
                    break;
                }

                this._$maxScrollV++;
            }
        }
        return this._$maxScrollV;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {void}
     * @method
     * @private
     */
    _$clip (context, matrix)
    {
        // size
        const bounds = this._$getBounds();
        const xMax   = bounds.xMax;
        const xMin   = bounds.xMin;
        const yMax   = bounds.yMax;
        const yMin   = bounds.yMin;
        Util.$poolBoundsObject(bounds);

        let width  = $Math.ceil($Math.abs(xMax - xMin));
        let height = $Math.ceil($Math.abs(yMax - yMin));
        if (!width || !height) {
            return;
        }

        let multiMatrix = matrix;
        const rawMatrix = this._$matrix;
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

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

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @return {void}
     * @method
     * @private
     */
    _$draw (context, matrix, color_transform)
    {
        if (!this._$visible || this._$textAreaActive) {
            return ;
        }

        if (!this._$background && !this._$border && 2 > this._$textData.length) {
            return;
        }

        let multiColor = color_transform;
        const rawColor = this._$colorTransform;
        if (rawColor[0] !== 1 || rawColor[1] !== 1
            || rawColor[2] !== 1 || rawColor[3] !== 1
            || rawColor[4] !== 0 || rawColor[5] !== 0
            || rawColor[6] !== 0 || rawColor[7] !== 0
        ) {
            multiColor = Util.$multiplicationColor(color_transform, rawColor);
        }

        const alpha = Util.$clamp(multiColor[3] + multiColor[7] / 255, 0 ,1);
        if (!alpha) {
            return ;
        }

        let multiMatrix = matrix;
        const rawMatrix = this._$matrix;
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        const baseBounds = this._$getBounds(null);

        baseBounds.xMin -= this._$thickness;
        baseBounds.xMax += this._$thickness;
        baseBounds.yMin -= this._$thickness;
        baseBounds.yMax += this._$thickness;

        const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
        const xMax   = +bounds.xMax;
        const xMin   = +bounds.xMin;
        const yMax   = +bounds.yMax;
        const yMin   = +bounds.yMin;
        Util.$poolBoundsObject(bounds);

        let width  = $Math.ceil($Math.abs(xMax - xMin));
        let height = $Math.ceil($Math.abs(yMax - yMin));
        switch (true) {

            case width === 0:
            case height === 0:
            case width === -$Infinity:
            case height === -$Infinity:
            case width === $Infinity:
            case height === $Infinity:
                return;

            default:
                break;

        }

        if (0 > xMin + width || 0 > yMin + height) {
            return;
        }

        // cache current buffer
        const currentAttachment = context.frameBuffer.currentAttachment;
        if (xMin > currentAttachment.width
            || yMin > currentAttachment.height
        ) {
            return;
        }

        let xScale = +$Math.sqrt(
            multiMatrix[0] * multiMatrix[0]
            + multiMatrix[1] * multiMatrix[1]
        );
        if (!$Number.isInteger(xScale)) {
            const value = xScale.toString();
            const index = value.indexOf("e");
            if (index !== -1) {
                xScale = +value.slice(0, index);
            }
            xScale = +xScale.toFixed(4);
        }

        let yScale = +$Math.sqrt(
            multiMatrix[2] * multiMatrix[2]
            + multiMatrix[3] * multiMatrix[3]
        );
        if (!$Number.isInteger(yScale)) {
            const value = yScale.toString();
            const index = value.indexOf("e");
            if (index !== -1) {
                yScale = +value.slice(0, index);
            }
            yScale = +yScale.toFixed(4);
        }

        const filters = this._$filters;
        if (0 > xMin + width || 0 > yMin + height) {

            if (filters && filters.length && this._$canApply(filters)) {

                let rect = new Rectangle(0, 0, width, height);
                for (let idx = 0; idx < filters.length ; ++idx) {
                    rect = filters[idx]._$generateFilterRect(rect, xScale, yScale);
                }

                if (0 > rect.x + rect.width || 0 > rect.y + rect.height) {
                    return;
                }

            } else {
                return;
            }

        }

        const blendMode = this._$blendMode;
        const keys = Util.$getArray(xScale, yScale);

        const instanceId = this._$instanceId;

        const cacheStore = Util.$cacheStore();
        const cacheKeys  = cacheStore.generateKeys(
            instanceId, keys
        );

        let texture = cacheStore.get(cacheKeys);

        // texture is small or renew
        if (this._$renew) {
            cacheStore.removeCache(instanceId);
            texture = null;
        }

        if (!texture) {

            // resize
            const lineWidth  = $Math.min(1, $Math.max(xScale, yScale));
            const baseWidth  = $Math.ceil($Math.abs(baseBounds.xMax - baseBounds.xMin) * xScale);
            const baseHeight = $Math.ceil($Math.abs(baseBounds.yMax - baseBounds.yMin) * yScale);

            this._$renew = false;

            // alpha reset
            color_transform[3] = 1;

            // new canvas
            const canvas = new OffscreenCanvas(
                baseWidth  + lineWidth * 2,
                baseHeight + lineWidth * 2
            );
            const ctx = canvas.getContext("2d");

            // border and background
            if (this._$background || this._$border) {

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(baseWidth, 0);
                ctx.lineTo(baseWidth, baseHeight);
                ctx.lineTo(0, baseHeight);
                ctx.lineTo(0, 0);

                if (this._$background) {

                    const rgb   = Util.$intToRGBA(this._$backgroundColor);
                    const alpha = $Math.max(0, $Math.min(
                        rgb.A * 255 * color_transform[3] + color_transform[7], 255)
                    ) / 255;

                    ctx.fillStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
                    ctx.fill();
                }

                if (this._$border) {

                    const rgb   = Util.$intToRGBA(this._$borderColor);
                    const alpha = $Math.max(0, $Math.min(
                        rgb.A * 255 * color_transform[3] + color_transform[7], 255)
                    ) / 255;

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
            this._$doDraw(ctx, matrix, color_transform, baseWidth / matrix[0]);
            ctx.restore();

            texture = context
                .frameBuffer
                .createTextureFromCanvas(ctx.canvas);

            // set cache
            if (Util.$useCache) {
                cacheStore.set(cacheKeys, texture);
            }

            // destroy cache
            cacheStore.destroy(ctx);

        }

        let drawFilter = false;
        let offsetX = 0;
        let offsetY = 0;
        if (filters && filters.length
            && this._$canApply(filters)
        ) {

            drawFilter = true;

            texture = this._$drawFilter(
                context, texture, matrix,
                filters, width, height
            );

            offsetX = texture._$offsetX;
            offsetY = texture._$offsetY;
        }

        const radianX = drawFilter ? 0 : $Math.atan2(matrix[1], matrix[0]);
        const radianY = drawFilter ? 0 : $Math.atan2(-matrix[2], matrix[3]);
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

            context.setTransform(1, 0, 0, 1,
                xMin - offsetX, yMin - offsetY
            );

        }

        // reset
        Util.$resetContext(context);

        // draw
        context._$globalAlpha = alpha;
        context._$imageSmoothingEnabled = true;
        context._$globalCompositeOperation = blendMode;

        context.drawImage(texture,
            0, 0, texture.width, texture.height, color_transform
        );

        // get cache
        Util.$poolArray(cacheKeys);
        Util.$poolBoundsObject(baseBounds);

        // pool
        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }

        if (multiColor !== color_transform) {
            Util.$poolFloat32Array8(multiColor);
        }
    }

    /**
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @param  {number} width
     * @return {void}
     * @method
     * @private
     */
    _$doDraw (context, matrix, color_transform, width)
    {
        // init
        const textData = this._$textData;

        const limitWidth  = this.width;
        const limitHeight = this.height;

        // setup
        let xOffset      = 0;
        let offsetHeight = 0;
        let currentV     = 0;

        let yOffset = 0;
        if (this._$verticalAlign !== TextFormatVerticalAlign.TOP
            && this.height > this.textHeight
        ) {

            switch (this._$verticalAlign) {

                case TextFormatVerticalAlign.MIDDLE:
                    yOffset = (this.height - this.textHeight + 2) / 2;
                    break;

                case TextFormatVerticalAlign.BOTTOM:
                    yOffset = this.height - this.textHeight + 2;
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
            if (this._$autoSize === TextFieldAutoSize.NONE
                && (offsetHeight > limitHeight || offsetWidth > limitWidth)
            ) {
                continue;
            }

            let tf = obj.textFormat;

            // color
            const rgb   = Util.$intToRGBA(obj.textFormat._$color);
            const alpha = $Math.max(0, $Math.min(
                rgb.A * 255 * color_transform[3] + color_transform[7], 255)
            ) / 255;

            context.fillStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;

            if (this._$thickness) {
                const rgb   = Util.$intToRGBA(this._$thicknessColor);
                const alpha = $Math.max(0, $Math.min(
                    rgb.A * 255 * color_transform[3] + color_transform[7], 255)
                ) / 255;
                context.lineWidth   = this._$thickness;
                context.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
            }

            const yIndex = obj.yIndex | 0;
            switch (obj.mode) {

                case TextMode.BREAK:
                case TextMode.WRAP:

                    currentV++;

                    if (this.scrollV > currentV) {
                        continue;
                    }

                    offsetHeight += this._$textHeightTable[yIndex];

                    xOffset = this._$getAlignOffset(this._$objectTable[yIndex], width);
                    if (tf._$underline) {

                        const offset = obj.textFormat._$size / 12;

                        const rgb   = Util.$intToRGBA(tf._$color);
                        const alpha = $Math.max(0, $Math.min(
                            rgb.A * 255 * color_transform[3] + color_transform[7], 255)
                        ) / 255;

                        context.lineWidth   = $Math.max(1, 1 / $Math.min(matrix[0], matrix[3]));
                        context.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;

                        context.beginPath();
                        context.moveTo(xOffset, yOffset + offsetHeight - offset);
                        context.lineTo(xOffset + this._$widthTable[yIndex], yOffset + offsetHeight - offset);
                        context.stroke();

                    }

                    break;

                case TextMode.TEXT:
                    {
                        if (this.scrollV > currentV) {
                            continue;
                        }

                        let offsetY = offsetHeight - this._$heightTable[0];
                        if (!Util.$isSafari) {
                            offsetY += 2 * (obj.textFormat._$size / 12);
                        }

                        context.beginPath();
                        context.textBaseline = "top";
                        context.font = Util.$generateFontStyle(
                            tf._$font, tf._$size, tf._$italic, tf._$bold
                        );

                        if (this._$thickness) {
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
     * @param  {object} obj
     * @param  {number} total_width
     * @param  {number} width
     * @return {number}
     * @private
     */
    _$getAlignOffset (obj, total_width, width)
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
                return $Math.max(0, width / 2 - indent - textFormat._$rightMargin - total_width / 2);

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
     * @description Playerから登録を削除
     *
     * @return {void}
     * @method
     * @private
     */
    _$remove ()
    {
        this._$xMin     = 0;
        this._$yMin     = 0;
        this._$xMax     = 0;
        this._$yMax     = 0;
        this._$textData = null;

        super._$remove();

        Util.$textFields.push(this);
    }

    /**
     * @description 情報を更新
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$updateProperty (object)
    {
        // update property
        this._$renew    = true;
        this._$textData = object.textData;
        this._$wordWrap = object.wordWrap;

        // format
        this._$limitWidth      = object.limitWidth;
        this._$limitHeight     = object.limitHeight;
        this._$autoSize        = object.autoSize;
        this._$widthTable      = object.widthTable;
        this._$heightTable     = object.heightTable;
        this._$objectTable     = object.objectTable;
        this._$textHeightTable = object.textHeightTable;
        this._$scrollV         = object.scrollV;
        this._$textHeight      = object.textHeight;
        this._$verticalAlign   = object.verticalAlign;

        // color
        if ("border" in object) {
            this._$border = object.border;
            this._$borderColor = object.borderColor;
        }

        if ("background" in object) {
            this._$background = object.background;
            this._$backgroundColor = object.backgroundColor;
        }

        if ("thickness" in object) {
            this._$thickness = object.thickness;
            this._$thicknessColor = object.thicknessColor;
        }
    }

    /**
     * @description 描画情報を更新
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$update (object)
    {
        super._$update(object);

        if (object.textData) {
            this._$updateProperty(object);
        }
    }
}