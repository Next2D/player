import { RenderDisplayObject } from "./RenderDisplayObject";
import { Rectangle } from "../player/next2d/geom/Rectangle";
import type { TextDataImpl } from "../interface/TextDataImpl";
import type { PropertyTextMessageImpl } from "../interface/PropertyTextMessageImpl";
import type { TextFieldAutoSizeImpl } from "../interface/TextFieldAutoSizeImpl";
import type { TextFormatVerticalAlignImpl } from "../interface/TextFormatVerticalAlignImpl";
import type { BoundsImpl } from "../interface/BoundsImpl";
import type { CanvasToWebGLContext } from "../webgl/CanvasToWebGLContext";
import type { FrameBufferManager } from "../webgl/FrameBufferManager";
import type { AttachmentImpl } from "../interface/AttachmentImpl";
import type { CacheStore } from "../player/util/CacheStore";
import type { RGBAImpl } from "../interface/RGBAImpl";
import type { TextFormatImpl } from "../interface/TextFormatImpl";
import {
    $isSafari,
    $renderPlayer,
    $textFields
} from "./RenderGlobal";
import {
    $boundsMatrix,
    $clamp,
    $generateFontStyle,
    $getArray,
    $Infinity,
    $intToRGBA,
    $Math,
    $multiplicationColor,
    $multiplicationMatrix,
    $Number,
    $poolArray,
    $poolBoundsObject,
    $poolFloat32Array6,
    $poolFloat32Array8
} from "../player/util/RenderUtil";

/**
 * @class
 */
export class RenderTextField extends RenderDisplayObject
{
    private _$background: boolean;
    private _$backgroundColor: number;
    private _$border: boolean;
    private _$borderColor: number;
    private readonly _$textData: TextDataImpl<any>[];
    private _$textAreaActive: boolean;
    private _$thickness: number;
    private _$thicknessColor: number;
    private _$limitWidth: number;
    private _$limitHeight: number;
    private _$autoSize: TextFieldAutoSizeImpl;
    private readonly _$widthTable: number[];
    private readonly _$heightTable: number[];
    private readonly _$objectTable: TextDataImpl<any>[];
    private readonly _$textHeightTable: number[];
    private _$scrollV: number;
    private _$maxScrollV: number | null;
    private _$textHeight: number;
    private _$verticalAlign: TextFormatVerticalAlignImpl;
    private _$wordWrap: boolean;

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
         * @type {boolean}
         * @default false
         * @private
         */
        this._$wordWrap = false;

        /**
         * @type {array}
         * @private
         */
        this._$textData = $getArray();

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
        this._$autoSize = "none";

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$widthTable = $getArray();

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$heightTable = $getArray();

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$objectTable = $getArray();

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$textHeightTable = $getArray();

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
         * @default 1
         * @private
         */
        this._$scrollV = 1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$textHeight = 0;

        /**
         * @type {string}
         * @default TextFormatVerticalAlign.TOP
         * @private
         */
        this._$verticalAlign = "top";
    }

    /**
     * @description 表示オブジェクトの幅を示します（ピクセル単位）。
     *              Indicates the width of the display object, in pixels.
     *
     * @member {number}
     * @public
     */
    get width (): number
    {
        const bounds: BoundsImpl = $boundsMatrix(
            this._$getBounds(null),
            this._$matrix
        );

        const width: number = $Math.abs(bounds.xMax - bounds.xMin);
        $poolBoundsObject(bounds);

        switch (true) {

            case width === 0:
            case width === $Infinity:
            case width === 0 - $Infinity:
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
    get height (): number
    {
        const bounds: BoundsImpl = $boundsMatrix(
            this._$getBounds(null),
            this._$matrix
        );

        const height: number = $Math.abs(bounds.yMax - bounds.yMin);

        // object pool
        $poolBoundsObject(bounds);

        switch (height) {

            case 0:
            case $Infinity:
            case 0 - $Infinity:
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
    get maxScrollV (): number
    {
        if (this._$maxScrollV === null) {

            this._$maxScrollV = 1;

            const length: number    = this._$textHeightTable.length;
            const maxHeight: number = this.height;

            if (maxHeight > this._$textHeight) {
                return this._$maxScrollV;
            }

            let textHeight: number = 0;

            let idx: number = 0;
            while (length > idx) {

                textHeight += this._$textHeightTable[idx++];
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
    _$clip (
        context: CanvasToWebGLContext,
        matrix: Float32Array
    ): void {

        // size
        const bounds: BoundsImpl = this._$getBounds();
        const xMax: number = bounds.xMax;
        const xMin: number = bounds.xMin;
        const yMax: number = bounds.yMax;
        const yMin: number = bounds.yMin;
        $poolBoundsObject(bounds);

        const width: number  = $Math.ceil($Math.abs(xMax - xMin));
        const height: number = $Math.ceil($Math.abs(yMax - yMin));
        if (!width || !height) {
            return;
        }

        let multiMatrix: Float32Array = matrix;
        const rawMatrix: Float32Array = this._$matrix;
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        context.reset();
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
        context.clip();

        if (multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
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
    _$draw (
        context: CanvasToWebGLContext,
        matrix: Float32Array,
        color_transform: Float32Array
    ): void {

        if (!this._$visible || this._$textAreaActive) {
            return ;
        }

        if (!this._$background && !this._$border
            && 2 > this._$textData.length
        ) {
            return;
        }

        let multiColor: Float32Array = color_transform;
        const rawColor: Float32Array = this._$colorTransform;
        if (rawColor[0] !== 1 || rawColor[1] !== 1
            || rawColor[2] !== 1 || rawColor[3] !== 1
            || rawColor[4] !== 0 || rawColor[5] !== 0
            || rawColor[6] !== 0 || rawColor[7] !== 0
        ) {
            multiColor = $multiplicationColor(color_transform, rawColor);
        }

        const alpha: number = $clamp(multiColor[3] + multiColor[7] / 255, 0 ,1);
        if (!alpha) {
            return ;
        }

        let multiMatrix: Float32Array = matrix;
        const rawMatrix: Float32Array = this._$matrix;
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        const baseBounds: BoundsImpl = this._$getBounds(null);
        baseBounds.xMin -= this._$thickness;
        baseBounds.xMax += this._$thickness;
        baseBounds.yMin -= this._$thickness;
        baseBounds.yMax += this._$thickness;

        const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
        const xMax   = +bounds.xMax;
        const xMin   = +bounds.xMin;
        const yMax   = +bounds.yMax;
        const yMin   = +bounds.yMin;
        $poolBoundsObject(bounds);

        const width: number  = $Math.ceil($Math.abs(xMax - xMin));
        const height: number = $Math.ceil($Math.abs(yMax - yMin));
        switch (true) {

            case width === 0:
            case height === 0:
            case width === 0 - $Infinity:
            case height === 0 - $Infinity:
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
        const manager: FrameBufferManager = context.frameBuffer;
        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;
        if (!currentAttachment
            || xMin > currentAttachment.width
            || yMin > currentAttachment.height
        ) {
            return;
        }

        let xScale: number = +$Math.sqrt(
            multiMatrix[0] * multiMatrix[0]
            + multiMatrix[1] * multiMatrix[1]
        );
        if (!$Number.isInteger(xScale)) {
            const value: string = xScale.toString();
            const index: number = value.indexOf("e");
            if (index !== -1) {
                xScale = +value.slice(0, index);
            }
            xScale = +xScale.toFixed(4);
        }

        let yScale: number = +$Math.sqrt(
            multiMatrix[2] * multiMatrix[2]
            + multiMatrix[3] * multiMatrix[3]
        );
        if (!$Number.isInteger(yScale)) {
            const value: string = yScale.toString();
            const index: number = value.indexOf("e");
            if (index !== -1) {
                yScale = +value.slice(0, index);
            }
            yScale = +yScale.toFixed(4);
        }

        if (0 > xMin + width || 0 > yMin + height) {

            if (this._$filters
                && this._$filters.length
                && this._$canApply(this._$filters)
            ) {

                let rect: Rectangle = new Rectangle(0, 0, width, height);
                for (let idx = 0; idx < this._$filters.length ; ++idx) {
                    rect = this._$filters[idx]._$generateFilterRect(rect, xScale, yScale);
                }

                if (0 > rect.x + rect.width || 0 > rect.y + rect.height) {
                    return;
                }

            } else {
                return;
            }

        }

        const keys: number[] = $getArray(xScale, yScale);

        const instanceId: number = this._$instanceId;

        const cacheStore: CacheStore = $renderPlayer.cacheStore;
        const cacheKeys: string[] = cacheStore.generateKeys(
            instanceId, keys
        );
        $poolArray(keys);

        let texture: WebGLTexture | null = cacheStore.get(cacheKeys);

        // texture is small or renew
        if (this._$isUpdated()) {
            cacheStore.removeCache(instanceId);
            texture = null;
        }

        if (!texture) {

            // resize
            const lineWidth: number  = $Math.min(1, $Math.max(xScale, yScale));
            const baseWidth: number  = $Math.ceil($Math.abs(baseBounds.xMax - baseBounds.xMin) * xScale);
            const baseHeight: number = $Math.ceil($Math.abs(baseBounds.yMax - baseBounds.yMin) * yScale);

            // alpha reset
            multiColor[3] = 1;

            // new canvas
            const canvas: OffscreenCanvas = new OffscreenCanvas(
                baseWidth  + lineWidth * 2,
                baseHeight + lineWidth * 2
            );
            const ctx: OffscreenCanvasRenderingContext2D | null = canvas.getContext("2d");
            if (!ctx) {
                return ;
            }

            // border and background
            if (this._$background || this._$border) {

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(baseWidth, 0);
                ctx.lineTo(baseWidth, baseHeight);
                ctx.lineTo(0, baseHeight);
                ctx.lineTo(0, 0);

                if (this._$background) {

                    const color: RGBAImpl = $intToRGBA(this._$backgroundColor);
                    const alpha: number = $Math.max(0, $Math.min(
                        color.A * 255 * color_transform[3] + color_transform[7], 255)
                    ) / 255;

                    ctx.fillStyle = `rgba(${color.R},${color.G},${color.B},${alpha})`;
                    ctx.fill();
                }

                if (this._$border) {

                    const color: RGBAImpl = $intToRGBA(this._$borderColor);
                    const alpha: number = $Math.max(0, $Math.min(
                        color.A * 255 * color_transform[3] + color_transform[7], 255)
                    ) / 255;

                    ctx.lineWidth   = lineWidth;
                    ctx.strokeStyle = `rgba(${color.R},${color.G},${color.B},${alpha})`;
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
            this._$doDraw(ctx, matrix, color_transform, baseWidth / xScale);
            ctx.restore();

            texture = manager.createTextureFromCanvas(ctx.canvas);

            // set cache
            cacheStore.set(cacheKeys, texture);

        }

        let drawFilter: boolean = false;
        let offsetX: number = 0;
        let offsetY: number = 0;
        if (this._$filters
            && this._$filters.length
            && this._$canApply(this._$filters)
        ) {

            drawFilter = true;

            texture = this._$drawFilter(
                context, texture, multiMatrix,
                this._$filters, width, height
            );

            offsetX = texture._$offsetX;
            offsetY = texture._$offsetY;
        }

        const radianX: number = $Math.atan2(multiMatrix[1], multiMatrix[0]);
        const radianY: number = $Math.atan2(0 - multiMatrix[2], multiMatrix[3]);
        if (!drawFilter && (radianX || radianY)) {

            const tx: number = baseBounds.xMin * xScale;
            const ty: number = baseBounds.yMin * yScale;

            const cosX: number = $Math.cos(radianX);
            const sinX: number = $Math.sin(radianX);
            const cosY: number = $Math.cos(radianY);
            const sinY: number = $Math.sin(radianY);

            context.setTransform(
                cosX, sinX, 0 - sinY, cosY,
                tx * cosX - ty * sinY + multiMatrix[4],
                tx * sinX + ty * cosY + multiMatrix[5]
            );

        } else {

            context.setTransform(1, 0, 0, 1,
                xMin - offsetX, yMin - offsetY
            );

        }

        // draw
        context.reset();
        context.globalAlpha = alpha;
        context.imageSmoothingEnabled = true;
        context.globalCompositeOperation = this._$blendMode;

        context.drawImage(texture,
            0, 0, texture.width, texture.height, multiColor
        );

        // get cache
        $poolArray(cacheKeys);
        $poolBoundsObject(baseBounds);

        // pool
        if (multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
        }

        if (multiColor !== color_transform) {
            $poolFloat32Array8(multiColor);
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
    _$doDraw (
        context: OffscreenCanvasRenderingContext2D,
        matrix: Float32Array,
        color_transform: Float32Array,
        width: number
    ): void {

        const limitWidth: number  = this.width;
        const limitHeight: number = this.height;

        // setup
        let xOffset: number      = 0;
        let offsetHeight: number = 0;
        let currentV: number     = 0;

        let yOffset: number = 0;
        if (this._$verticalAlign !== "top"
            && this.height > this._$textHeight
        ) {

            switch (this._$verticalAlign) {

                case "middle":
                    yOffset = (this.height - this._$textHeight + 2) / 2;
                    break;

                case "bottom":
                    yOffset = this.height - this._$textHeight + 2;
                    break;

            }

        }

        const length: number = this._$textData.length;
        for (let idx: number = 0; idx < length; ++idx) {

            const obj: TextDataImpl<any> = this._$textData[idx];
            if (obj.width === 0) {
                continue;
            }

            // check
            const offsetWidth: number = xOffset + obj.x;
            if (this._$autoSize === "none"
                && (offsetHeight > limitHeight || offsetWidth > limitWidth)
            ) {
                continue;
            }

            const tf: TextFormatImpl = obj.textFormat;

            // color
            const color: RGBAImpl = $intToRGBA(obj.textFormat._$color);
            const alpha: number = $Math.max(0, $Math.min(
                color.A * 255 * color_transform[3] + color_transform[7], 255)
            ) / 255;

            context.fillStyle = `rgba(${color.R},${color.G},${color.B},${alpha})`;

            if (this._$thickness) {
                const color: RGBAImpl = $intToRGBA(this._$thicknessColor);
                const alpha: number = $Math.max(0, $Math.min(
                    color.A * 255 * color_transform[3] + color_transform[7], 255)
                ) / 255;
                context.lineWidth   = this._$thickness;
                context.strokeStyle = `rgba(${color.R},${color.G},${color.B},${alpha})`;
            }

            const yIndex: number = obj.yIndex;
            switch (obj.mode) {

                case "break":
                case "wrap":

                    currentV++;

                    if (this._$scrollV > currentV) {
                        continue;
                    }

                    offsetHeight += this._$textHeightTable[yIndex];

                    xOffset = this._$getAlignOffset(this._$objectTable[yIndex], width);
                    if (tf._$underline) {

                        const offset: number = obj.textFormat._$size / 12;

                        const color: RGBAImpl = $intToRGBA(tf._$color);
                        const alpha: number = $Math.max(0, $Math.min(
                            color.A * 255 * color_transform[3] + color_transform[7], 255)
                        ) / 255;

                        context.lineWidth   = $Math.max(1, 1 / $Math.min(matrix[0], matrix[3]));
                        context.strokeStyle = `rgba(${color.R},${color.G},${color.B},${alpha})`;

                        context.beginPath();
                        context.moveTo(xOffset, yOffset + offsetHeight - offset);
                        context.lineTo(xOffset + this._$widthTable[yIndex], yOffset + offsetHeight - offset);
                        context.stroke();

                    }

                    break;

                case "text":
                    {
                        if (this._$scrollV > currentV) {
                            continue;
                        }

                        let offsetY = offsetHeight - this._$heightTable[0];
                        if (!$isSafari) {
                            offsetY += 2 * (obj.textFormat._$size / 12);
                        }

                        context.beginPath();
                        context.textBaseline = "top";
                        context.font = $generateFontStyle(
                            tf._$font, tf._$size, tf._$italic, tf._$bold
                        );

                        if (this._$thickness) {
                            context.strokeText(obj.text, offsetWidth, yOffset + offsetY);
                        }

                        context.fillText(obj.text, offsetWidth, yOffset + offsetY);

                    }
                    break;

                case "image":

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
     * @param  {number} width
     * @return {number}
     * @private
     */
    _$getAlignOffset (
        obj: TextDataImpl<any>,
        width: number
    ): number {

        // default
        const totalWidth: number = this._$widthTable[obj.yIndex];
        const textFormat: TextFormatImpl = obj.textFormat;
        const indent: number = textFormat._$blockIndent + textFormat._$leftMargin > 0
            ? textFormat._$blockIndent + textFormat._$leftMargin
            : 0;

        switch (true) {

            // wordWrap case
            case !this._$wordWrap && totalWidth > width:
                return $Math.max(0, indent);

            case textFormat._$align === "center": // format CENTER
            case this._$autoSize === "center": // autoSize CENTER
                return $Math.max(0, width / 2 - indent - textFormat._$rightMargin - totalWidth / 2);

            case textFormat._$align === "right": // format RIGHT
            case this._$autoSize === "right": // autoSize RIGHT
                return $Math.max(0, width - indent - totalWidth - textFormat._$rightMargin - 2);

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
    _$remove (): void
    {
        this._$xMin     = 0;
        this._$yMin     = 0;
        this._$xMax     = 0;
        this._$yMax     = 0;

        // array reset
        this._$textData.length        = 0;
        this._$widthTable.length      = 0;
        this._$heightTable.length     = 0;
        this._$objectTable.length     = 0;
        this._$textHeightTable.length = 0;

        this._$textAreaActive = false;

        super._$remove();

        $textFields.push(this);
    }

    /**
     * @description 情報を更新
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$updateProperty (object: PropertyTextMessageImpl): void
    {
        // update property
        this._$textAreaActive = !!object.textAreaActive;

        // set array
        this._$textData.push(...object.textData);
        this._$widthTable.push(...object.widthTable);
        this._$heightTable.push(...object.heightTable);
        this._$objectTable.push(...object.objectTable);
        this._$textHeightTable.push(...object.textHeightTable);

        // format
        this._$wordWrap = object.wordWrap;
        this._$limitWidth      = object.limitWidth;
        this._$limitHeight     = object.limitHeight;
        this._$autoSize        = object.autoSize;
        this._$scrollV         = object.scrollV;
        this._$textHeight      = object.textHeight;
        this._$verticalAlign   = object.verticalAlign;

        // color
        this._$border = object.border;
        if (this._$border) {
            this._$borderColor = object.borderColor as NonNullable<number>;
        }

        this._$background = object.background;
        if (this._$background) {
            this._$backgroundColor = object.backgroundColor as NonNullable<number>;
        }

        if ("thickness" in object) {
            this._$thickness = object.thickness;
            this._$thicknessColor = object.thicknessColor as NonNullable<number>;
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
    _$update (object: PropertyTextMessageImpl): void
    {
        super._$update(object);

        this._$textAreaActive = !!object.textAreaActive;

        this._$xMin = object.xMin as NonNullable<number>;
        this._$yMin = object.yMin as NonNullable<number>;
        this._$xMax = object.xMax as NonNullable<number>;
        this._$yMax = object.yMax as NonNullable<number>;

        if (object.textData) {
            this._$updateProperty(object);
        }
    }
}