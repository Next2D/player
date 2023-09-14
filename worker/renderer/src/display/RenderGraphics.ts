import { RenderDisplayObject } from "./RenderDisplayObject";
import type { GridImpl } from "../interface/GridImpl";
import type { BlendModeImpl } from "../interface/BlendModeImpl";
import type { FilterArrayImpl } from "../interface/FilterArrayImpl";
import type { BoundsImpl } from "../interface/BoundsImpl";
import type { AttachmentImpl } from "../interface/AttachmentImpl";
import type { SpreadMethodImpl } from "../interface/SpreadMethodImpl";
import type { PropertyMessageMapImpl } from "../interface/PropertyMessageMapImpl";
import type { ColorStopImpl } from "../interface/ColorStopImpl";
import type { CachePositionImpl } from "../interface/CachePositionImpl";
import type { ShapeModeImpl } from "../interface/ShapeModeImpl";
import type {
    CanvasToWebGLContext,
    CanvasGradientToWebGL,
    FrameBufferManager
} from "@next2d/webgl";
import { $renderPlayer } from "../RenderGlobal";
import {
    $cacheStore,
    $clamp,
    $getBoundsObject,
    $boundsMatrix,
    $Math,
    $poolBoundsObject,
    $Infinity,
    $Number,
    $getArray,
    $poolArray,
    $getFloat32Array6,
    $getFloat32Array4,
    $multiplicationMatrix,
    $poolFloat32Array6,
    $getInt32Array4,
    $linearGradientXY,
    $getFloat32Array8
} from "@next2d/share";

/**
 * @class
 */
export class RenderGraphics extends RenderDisplayObject
{
    public _$recodes: Float32Array | null;
    public _$maxAlpha: number;
    public _$canDraw: boolean;
    private _$uniqueKey: string;
    private _$cacheKeys: string[];
    private _$cacheParams: number[];
    public _$bitmapId: number;
    public _$mode: ShapeModeImpl;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$recodes = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$maxAlpha = 0;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$canDraw = false;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$uniqueKey = "";

        /**
         * @type {array}
         * @private
         */
        this._$cacheKeys = $getArray();

        /**
         * @type {array}
         * @private
         */
        this._$cacheParams = $getArray(0, 0, 0);

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$bitmapId = 0;

        /**
         * @type {string}
         * @default "shape"
         * @private
         */
        this._$mode = "shape";
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

        if (!this._$recodes) {
            return ;
        }

        // size
        const baseBounds: BoundsImpl = this._$getBounds();

        const bounds: BoundsImpl = $boundsMatrix(baseBounds, matrix);
        $poolBoundsObject(baseBounds);

        const width: number    = $Math.ceil($Math.abs(bounds.xMax - bounds.xMin));
        const height: number   = $Math.ceil($Math.abs(bounds.yMax - bounds.yMin));
        $poolBoundsObject(bounds);

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

        context.reset();
        context.setTransform(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5]
        );

        this._$runCommand(context, this._$recodes, null, true);

        context.clip();
    }

    /**
     * @return {string}
     * @method
     * @private
     */
    _$createCacheKey (): string
    {
        if (!this._$recodes) {
            return "";
        }

        let hash = 0;
        for (let idx: number = 0; idx < this._$recodes.length; idx++) {

            const chr: number = this._$recodes[idx];

            hash  = (hash << 5) - hash + chr;
            hash |= 0;
        }

        return `${hash}`;
    }

    /**
     * @return {WebGLTexture | null}
     * @method
     * @private
     */
    _$createBitmapTexture (
        context: CanvasToWebGLContext,
        position: CachePositionImpl,
        x_scale: number,
        y_scale: number,
        width: number,
        height: number
    ): WebGLTexture | null {

        if (this._$mode !== "bitmap") {
            return null;
        }

        context.drawInstacedArray();

        const manager: FrameBufferManager = context.frameBuffer;
        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

        const attachment: AttachmentImpl = manager
            .createCacheAttachment(width, height);

        context._$bind(attachment);

        context.reset();

        const parentMatrix: Float32Array = $getFloat32Array6(
            x_scale, 0, 0, y_scale,
            width / 2, height / 2
        );

        const texture: WebGLTexture = context.getTextureFromRect(position);

        const baseMatrix: Float32Array = $getFloat32Array6(
            1, 0, 0, 1,
            -texture.width / 2,
            -texture.height / 2
        );

        const scaleMatrix = $multiplicationMatrix(
            parentMatrix, baseMatrix
        );
        $poolFloat32Array6(parentMatrix);
        $poolFloat32Array6(baseMatrix);

        context.setTransform(
            scaleMatrix[0], scaleMatrix[1],
            scaleMatrix[2], scaleMatrix[3],
            scaleMatrix[4], scaleMatrix[5]
        );

        context.drawImage(texture, 0, 0, texture.width, texture.height);

        const bitmapTexture: WebGLTexture = manager.getTextureFromCurrentAttachment();
        context._$bind(currentAttachment);

        manager.releaseAttachment(attachment);
        manager.textureManager.release(texture);

        return bitmapTexture;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @param  {string} [blend_mode=BlendMode.NORMAL]
     * @param  {array}  [filters=null]
     * @return {void}
     * @method
     * @private
     */
    _$draw (
        context: CanvasToWebGLContext,
        matrix: Float32Array,
        color_transform: Float32Array,
        blend_mode: BlendModeImpl = "normal",
        filters: FilterArrayImpl | null = null
    ): void {

        if (!this._$visible
            || !this._$recodes
            || !this._$maxAlpha
            || !this._$canDraw
        ) {
            return ;
        }

        const alpha: number = $clamp(color_transform[3] + color_transform[7] / 255, 0, 1, 0);
        if (!alpha) {
            return ;
        }

        const rawMatrix: Float32Array = this._$matrix;

        // set grid data
        let hasGrid: boolean = this._$scale9Grid !== null;

        // 9スライスを有効にしたオブジェクトが回転・傾斜成分を含む場合は
        // 9スライスは無効になる
        if (hasGrid) {
            hasGrid = hasGrid
                && $Math.abs(rawMatrix[1]) < 0.001
                && $Math.abs(rawMatrix[2]) < 0.0001;
        }

        // size
        const baseBounds: BoundsImpl = $getBoundsObject(
            this._$xMin, this._$xMax,
            this._$yMin, this._$yMax
        );

        const bounds: BoundsImpl = $boundsMatrix(baseBounds, matrix);
        const xMax: number = bounds.xMax;
        const xMin: number = bounds.xMin;
        const yMax: number = bounds.yMax;
        const yMin: number = bounds.yMin;
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

        let xScale: number = +$Math.sqrt(
            matrix[0] * matrix[0]
            + matrix[1] * matrix[1]
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
            matrix[2] * matrix[2]
            + matrix[3] * matrix[3]
        );
        if (!$Number.isInteger(yScale)) {
            const value: string = yScale.toString();
            const index: number = value.indexOf("e");
            if (index !== -1) {
                yScale = +value.slice(0, index);
            }
            yScale = +yScale.toFixed(4);
        }

        const canApply: boolean = filters !== null
            && filters.length > 0
            && this._$canApply(filters);

        let filterBounds: BoundsImpl = $getBoundsObject(0, width, 0, height);
        if (canApply && filters) {
            for (let idx: number = 0; idx < filters.length ; ++idx) {
                filterBounds = filters[idx]
                    ._$generateFilterRect(filterBounds, xScale, yScale);
            }
        }

        // cache current buffer
        const manager: FrameBufferManager = context.frameBuffer;
        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;
        if (!currentAttachment
            || xMin - filterBounds.xMin > currentAttachment.width
            || yMin - filterBounds.yMin > currentAttachment.height
        ) {
            $poolBoundsObject(filterBounds);
            return;
        }

        if (0 > xMin + filterBounds.xMax || 0 > yMin + filterBounds.yMax) {
            $poolBoundsObject(filterBounds);
            return;
        }

        $poolBoundsObject(filterBounds);

        // get cache
        if (this._$uniqueKey === "") {
            if (!hasGrid
                && this._$loaderInfoId > -1
                && this._$characterId > -1
            ) {
                this._$uniqueKey = `${this._$loaderInfoId}@${this._$characterId}`;
            } else {
                this._$uniqueKey = this._$createCacheKey();
            }
        }

        if (this._$mode === "bitmap") {

            if (!this._$cacheKeys.length) {
                this._$cacheKeys = $cacheStore.generateKeys(this._$uniqueKey);
            }

        } else {

            if (!this._$cacheKeys.length
                || this._$cacheParams[0] !== xScale
                || this._$cacheParams[1] !== yScale
                || this._$cacheParams[2] !== color_transform[7]
            ) {

                const keys: number[] = $getArray();
                keys[0] = xScale;
                keys[1] = yScale;

                this._$cacheKeys = $cacheStore.generateKeys(
                    this._$uniqueKey, keys, color_transform
                );

                $poolArray(keys);

                this._$cacheParams[0] = xScale;
                this._$cacheParams[1] = yScale;
                this._$cacheParams[2] = color_transform[7];
            }
        }

        context.cachePosition = $cacheStore.get(this._$cacheKeys);
        if (!context.cachePosition) {

            const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

            if (currentAttachment && currentAttachment.mask) {
                context.stopStencil();
            }

            let width: number  = 0;
            let height: number = 0;
            if (this._$mode === "shape") {

                width  = $Math.ceil($Math.abs(baseBounds.xMax - baseBounds.xMin) * xScale);
                height = $Math.ceil($Math.abs(baseBounds.yMax - baseBounds.yMin) * yScale);

                // resize
                const textureScale: number = context._$getTextureScale(width, height);
                if (textureScale < 1) {
                    width  *= textureScale;
                    height *= textureScale;
                }

            } else {
                width  = $Math.ceil($Math.abs(baseBounds.xMax - baseBounds.xMin));
                height = $Math.ceil($Math.abs(baseBounds.yMax - baseBounds.yMin));
            }

            // create cache position
            context.cachePosition = manager.createCachePosition(width, height);
            context.bindRenderBuffer(context.cachePosition);

            // reset
            context.reset();

            if (this._$mode === "shape") {
                context.setTransform(
                    xScale, 0, 0, yScale,
                    -baseBounds.xMin * xScale,
                    -baseBounds.yMin * yScale
                );
            } else {
                context.setTransform(
                    1, 0, 0, 1,
                    -baseBounds.xMin,
                    -baseBounds.yMin
                );
            }

            if (hasGrid) {

                const mScale: number = $renderPlayer.scaleX;

                const baseMatrix: Float32Array = $getFloat32Array6(
                    mScale, 0, 0, mScale, 0, 0
                );

                const pMatrix: Float32Array = $multiplicationMatrix(
                    baseMatrix, rawMatrix
                );

                $poolFloat32Array6(baseMatrix);

                const aMatrixBase: Float32Array = this._$matrixBase as NonNullable<Float32Array>;
                const aMatrix = $getFloat32Array6(
                    aMatrixBase[0], aMatrixBase[1],
                    aMatrixBase[2], aMatrixBase[3],
                    aMatrixBase[4] * mScale - xMin,
                    aMatrixBase[5] * mScale - yMin
                );

                const apMatrix: Float32Array = $multiplicationMatrix(
                    aMatrix, pMatrix
                );

                const aOffsetX: number = apMatrix[4] - (matrix[4] - xMin);
                const aOffsetY: number = apMatrix[5] - (matrix[5] - yMin);
                $poolFloat32Array6(apMatrix);

                const parentBounds: BoundsImpl = $boundsMatrix(baseBounds, pMatrix);
                const parentXMax: number   = +parentBounds.xMax;
                const parentXMin: number   = +parentBounds.xMin;
                const parentYMax: number   = +parentBounds.yMax;
                const parentYMin: number   = +parentBounds.yMin;
                const parentWidth: number  = $Math.ceil($Math.abs(parentXMax - parentXMin));
                const parentHeight: number = $Math.ceil($Math.abs(parentYMax - parentYMin));

                $poolBoundsObject(parentBounds);

                context.grid.enable(
                    parentXMin, parentYMin, parentWidth, parentHeight,
                    baseBounds, this._$scale9Grid as NonNullable<GridImpl>, mScale,
                    pMatrix[0], pMatrix[1], pMatrix[2], pMatrix[3], pMatrix[4], pMatrix[5],
                    aMatrix[0], aMatrix[1], aMatrix[2], aMatrix[3], aMatrix[4] - aOffsetX, aMatrix[5] - aOffsetY
                );

                $poolFloat32Array6(pMatrix);
                $poolFloat32Array6(aMatrix);
            }

            this._$runCommand(context, this._$recodes, color_transform, false);

            if (hasGrid) {
                context.grid.disable();
            }

            manager.transferTexture(context.cachePosition);

            // set cache
            $cacheStore.set(this._$cacheKeys, context.cachePosition);

            // end draw and reset current buffer
            context._$bind(currentAttachment);
        }

        let offsetX: number = 0;
        let offsetY: number = 0;
        if (canApply && filters) {

            const bitmapTexture: WebGLTexture | null = this._$createBitmapTexture(
                context, context.cachePosition,
                xScale, yScale, width, height
            );

            const position: CachePositionImpl = this._$drawFilter(
                context, matrix, filters,
                width, height, bitmapTexture
            );

            if (position.offsetX) {
                offsetX = position.offsetX;
            }

            if (position.offsetY) {
                offsetY = position.offsetY;
            }

            // update
            context.cachePosition = position;
        }

        if (!canApply && this._$mode === "bitmap") {

            context.setTransform(
                matrix[0], matrix[1],
                matrix[2], matrix[3],
                baseBounds.xMin * matrix[0] + baseBounds.yMin * matrix[2] + matrix[4],
                baseBounds.xMin * matrix[1] + baseBounds.yMin * matrix[3] + matrix[5]
            );

        } else {

            const radianX: number = $Math.atan2(matrix[1], matrix[0]);
            const radianY: number = $Math.atan2(-matrix[2], matrix[3]);
            if (!canApply && (radianX || radianY)) {

                const tx: number = baseBounds.xMin * xScale;
                const ty: number = baseBounds.yMin * yScale;

                const cosX: number = $Math.cos(radianX);
                const sinX: number = $Math.sin(radianX);
                const cosY: number = $Math.cos(radianY);
                const sinY: number = $Math.sin(radianY);

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
        }

        // draw
        if (context.cachePosition) {

            context.globalAlpha = alpha;
            context.imageSmoothingEnabled = this._$mode === "shape";
            context.globalCompositeOperation = blend_mode;

            context.drawInstance(
                xMin - offsetX, yMin - offsetY, xMax, yMax,
                color_transform
            );

            // cache position clear
            context.cachePosition = null;
        }

        // pool
        $poolBoundsObject(baseBounds);
    }

    /**
     * @description strokeのセットアップ
     *
     * @param  {CanvasToWebGLContext} context
     * @param  {number} line_width
     * @param  {number} line_cap
     * @param  {number} line_join
     * @param  {number} miter_limit
     * @return {void}
     * @method
     * @public
     */
    setupStroke (
        context: CanvasToWebGLContext,
        line_width: number, line_cap: number,
        line_join: number, miter_limit: number
    ): void {

        context.lineWidth = line_width;

        switch (line_cap) {

            case 0:
                context.lineCap = "none";
                break;

            case 1:
                context.lineCap = "round";
                break;

            case 2:
                context.lineCap = "square";
                break;

        }

        switch (line_join) {

            case 0:
                context.lineJoin = "bevel";
                break;

            case 1:
                context.lineJoin = "miter";
                break;

            case 2:
                context.lineJoin = "round";
                break;

        }

        context.miterLimit = miter_limit;
    }

    /**
     * @description CanvasGradientToWebGLオブジェクトを生成
     *
     * @param  {CanvasToWebGLContext} context
     * @param  {number} type
     * @param  {array} stops
     * @param  {Float32Array} matrix
     * @param  {number} spread
     * @param  {number} interpolation
     * @param  {number} focal
     * @param  {Float32Array} [color_transform=null]
     * @return {CanvasGradientToWebGL}
     * @method
     * @public
     */
    createGradientStyle (
        context: CanvasToWebGLContext,
        type: number, stops: ColorStopImpl[],
        matrix: Float32Array,
        spread: number, interpolation: number, focal: number,
        color_transform: Float32Array | null = null
    ): CanvasGradientToWebGL {

        let spreadMethod: SpreadMethodImpl = "pad";
        switch (spread) {

            case 0:// REFLECT
                spreadMethod = "reflect";
                break;

            case 1: // REPEAT
                spreadMethod = "repeat";
                break;

        }

        let css: CanvasGradientToWebGL;
        if (type === 0) {

            // LINEAR
            const xy: Float32Array = $linearGradientXY(matrix);
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

        for (let idx: number = 0; idx < stops.length; ++idx) {

            const color: ColorStopImpl = stops[idx];

            let alpha: number = color.A;
            if (color_transform) {
                if (color_transform[3] !== 1 || color_transform[7] !== 0) {
                    alpha = $Math.max(0, $Math.min(color.A * color_transform[3] + color_transform[7], 255)) | 0;
                }
            }

            css.addColorStop(color.ratio, $getInt32Array4(
                color.R, color.G, color.B, alpha
            ));
        }

        return css;
    }

    /**
     * @description Graphicsクラスの描画を実行
     *              Execute drawing in the Graphics class
     *
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} recodes
     * @param  {Float32Array} [color_transform=null]
     * @param  {boolean} [is_clip=false]
     * @return {void}
     * @method
     * @public
     */
    _$runCommand (
        context: CanvasToWebGLContext,
        recodes: Float32Array,
        color_transform: Float32Array | null = null,
        is_clip: boolean = false
    ): void {

        // reset
        context.reset();
        context.beginPath();

        const length: number = recodes.length;
        for (let idx: number = 0; idx < length; ) {

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

                        const color: Float32Array = $getFloat32Array4();
                        color[0] = recodes[idx++] / 255;
                        color[1] = recodes[idx++] / 255;
                        color[2] = recodes[idx++] / 255;
                        color[3] = recodes[idx++] / 255;

                        if (color_transform !== null) {
                            if (color_transform[3] !== 1 || color_transform[7] !== 0) {
                                color[3] = $Math.max(0, $Math.min(
                                    color[3] * color_transform[3] + color_transform[7], 255)
                                ) / 255;
                            }
                        }

                        context.fillStyle = color;
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
                            context,
                            recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++]
                        );

                        const color = $getFloat32Array4();

                        color[0] = recodes[idx++] / 255;
                        color[1] = recodes[idx++] / 255;
                        color[2] = recodes[idx++] / 255;
                        color[3] = recodes[idx++] / 255;

                        if (color_transform !== null) {
                            if (color_transform[3] !== 1 || color_transform[7] !== 0) {
                                color[3] = $Math.max(0, $Math.min(
                                    color[3] * color_transform[3] + color_transform[7], 255)
                                ) / 255;
                            }
                        }

                        context.strokeStyle = color;
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
                    context.arc(recodes[idx++], recodes[idx++], recodes[idx++]);
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

                        const type: number = recodes[idx++];

                        let stopLength: number = recodes[idx++];
                        const stops: ColorStopImpl[] = $getArray();
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

                        const matrix: Float32Array = $getFloat32Array6(
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++], recodes[idx++]
                        );

                        context.fillStyle = this.createGradientStyle(
                            context, type, stops, matrix,
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            color_transform
                        );

                        context.fill();

                        // if RADIAL
                        if (type === 1) {
                            context.restore();
                        }

                        $poolFloat32Array6(matrix);
                        $poolArray(stops);
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
                            context,
                            recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++]
                        );

                        const type: number = recodes[idx++];

                        let stopLength: number = recodes[idx++];

                        const stops: ColorStopImpl[] = $getArray();
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

                        const matrix: Float32Array = $getFloat32Array6(
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++], recodes[idx++]
                        );

                        context.strokeStyle = this.createGradientStyle(
                            context, type, stops, matrix,
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            color_transform
                        );

                        context.stroke();

                        // if RADIAL
                        if (type === 1) {
                            context.restore();
                        }

                        $poolFloat32Array6(matrix);
                        $poolArray(stops);
                    }
                    break;

                case 13: // BITMAP_FILL
                    {
                        const width: number          = recodes[idx++];
                        const height: number         = recodes[idx++];
                        const graphicsWidth: number  = recodes[idx++];
                        const graphicsHeight: number = recodes[idx++];
                        const bitmapLength: number   = recodes[idx++];
                        if (is_clip) {
                            idx += bitmapLength;
                            idx += 8;
                            continue;
                        }

                        const buffer: Uint8Array = new Uint8Array(
                            recodes.subarray(idx, bitmapLength + idx)
                        );

                        idx += bitmapLength;
                        const matrix: Float32Array = $getFloat32Array6(
                            recodes[idx++], recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++], recodes[idx++]
                        );

                        const repeat: boolean = !!recodes[idx++];
                        const smooth: boolean = !!recodes[idx++];

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
                        $poolFloat32Array6(matrix);

                        const manager: FrameBufferManager = context.frameBuffer;
                        const texture: WebGLTexture = manager.createTextureFromPixels(
                            width, height, buffer, true
                        );

                        if (!repeat
                            && width  === graphicsWidth
                            && height === graphicsHeight
                        ) {

                            context.drawImage(texture, 0, 0, width, height);
                            manager.releaseTexture(texture);

                        } else {

                            context.fillStyle = context.createPattern(
                                texture, repeat, color_transform || $getFloat32Array8()
                            );

                            context.imageSmoothingEnabled = smooth;
                            context.fill();

                        }

                        // restore
                        context.restore();
                        context.imageSmoothingEnabled = false;

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
                            context,
                            recodes[idx++], recodes[idx++],
                            recodes[idx++], recodes[idx++]
                        );

                        const width: number  = recodes[idx++];
                        const height: number = recodes[idx++];
                        const bitmapLength: number = recodes[idx++];

                        const buffer: Uint8Array = new Uint8Array(
                            recodes.subarray(idx, bitmapLength + idx)
                        );

                        idx += bitmapLength;
                        const matrix: Float32Array = $getFloat32Array6(
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
                        $poolFloat32Array6(matrix);

                        const repeat: boolean = !!recodes[idx++];
                        const smooth: boolean = !!recodes[idx++];

                        const manager: FrameBufferManager = context.frameBuffer;
                        const texture: WebGLTexture = manager.createTextureFromPixels(
                            width, height, buffer, true
                        );

                        context.strokeStyle = context.createPattern(
                            texture, repeat, color_transform || $getFloat32Array8()
                        );

                        context.imageSmoothingEnabled = smooth;
                        context.stroke();

                        // restore
                        context.restore();
                        context.imageSmoothingEnabled = false;
                    }
                    break;

                default:
                    break;

            }
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
    _$update (object: PropertyMessageMapImpl<any>): void
    {
        super._$update(object);

        if (object.recodes) {

            this._$recodes  = object.recodes;
            this._$xMin     = object.xMin;
            this._$yMin     = object.yMin;
            this._$xMax     = object.xMax;
            this._$yMax     = object.yMax;
            this._$maxAlpha = object.maxAlpha;
            this._$canDraw  = object.canDraw;

            $cacheStore.removeCache(this._$instanceId);

            if (this._$loaderInfoId > -1
                && this._$characterId > -1
            ) {
                $cacheStore.removeCache(
                    `${this._$loaderInfoId}@${this._$characterId}`
                );
            }
        }
    }
}