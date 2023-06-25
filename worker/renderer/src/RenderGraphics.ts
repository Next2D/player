import { RenderDisplayObject } from "./RenderDisplayObject";
import { Rectangle } from "@next2d/geom";
import { CanvasToWebGLContext } from "@next2d/webgl";
import {
    BlendModeImpl,
    FilterArrayImpl,
    BoundsImpl,
    AttachmentImpl,
    SpreadMethodImpl,
    PropertyMessageMapImpl,
    ColorStopImpl
} from "@next2d/interface";
import {
    CanvasGradientToWebGL,
    FrameBufferManager
} from "@next2d/webgl";
import { $renderPlayer } from "./RenderGlobal";
import {
    CacheStore,
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
    $multiplicationMatrix,
    $poolFloat32Array6,
    $getFloat32Array4,
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

        context.setTransform(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5]
        );

        this._$runCommand(context, this._$recodes, null, true);

        context.clip();
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
        const xMax: number   = bounds.xMax;
        const xMin: number   = bounds.xMin;
        const yMax: number   = bounds.yMax;
        const yMin: number   = bounds.yMin;
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

        if (0 > xMin + width || 0 > yMin + height) {

            if (filters && filters.length && this._$canApply(filters)) {

                let rect: Rectangle = new Rectangle(0, 0, width, height);
                for (let idx: number = 0; idx < filters.length ; ++idx) {
                    rect = filters[idx]
                        ._$generateFilterRect(rect, xScale, yScale);
                }

                if (0 > rect.x + rect.width || 0 > rect.y + rect.height) {
                    return;
                }

            } else {
                return;
            }

        }

        // get cache
        const keys: any[] = $getArray(xScale, yScale);

        let uniqueId: string = `${this._$instanceId}`;
        if (!hasGrid
            && this._$loaderInfoId > -1
            && this._$characterId > -1
        ) {
            uniqueId = `${this._$loaderInfoId}@${this._$characterId}`;
        }

        const cacheStore: CacheStore = $renderPlayer.cacheStore;
        const cacheKeys: string[] = cacheStore.generateKeys(
            uniqueId, keys, color_transform
        );

        $poolArray(keys);

        let texture: WebGLTexture | null = cacheStore.get(cacheKeys);
        if (!texture) {

            // resize
            let width: number  = $Math.ceil($Math.abs(baseBounds.xMax - baseBounds.xMin) * xScale);
            let height: number = $Math.ceil($Math.abs(baseBounds.yMax - baseBounds.yMin) * yScale);
            const textureScale = context._$getTextureScale(width, height);
            if (textureScale < 1) {
                width  *= textureScale;
                height *= textureScale;
            }

            // create cache buffer
            const attachment: AttachmentImpl = manager
                .createCacheAttachment(width, height, true);
            context._$bind(attachment);

            // reset
            context.reset();
            context.setTransform(
                xScale, 0, 0, yScale,
                0 - baseBounds.xMin * xScale,
                0 - baseBounds.yMin * yScale
            );

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
                    baseBounds, this._$scale9Grid as NonNullable<Rectangle>, mScale,
                    pMatrix[0], pMatrix[1], pMatrix[2], pMatrix[3], pMatrix[4], pMatrix[5],
                    aMatrix[0], aMatrix[1], aMatrix[2], aMatrix[3], aMatrix[4] - aOffsetX, aMatrix[5] - aOffsetY
                );

                $poolFloat32Array6(pMatrix);
                $poolFloat32Array6(aMatrix);
            }

            // plain alpha
            color_transform[3] = 1;
            this._$runCommand(context, this._$recodes, color_transform, false);

            if (hasGrid) {
                context.grid.disable();
            }

            texture = manager.getTextureFromCurrentAttachment();

            // set cache
            cacheStore.set(cacheKeys, texture);

            // release buffer
            manager.releaseAttachment(attachment, false);

            // end draw and reset current buffer
            context._$bind(currentAttachment);
        }

        let drawFilter: boolean = false;
        let offsetX: number = 0;
        let offsetY: number = 0;
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

        const radianX: number = $Math.atan2(matrix[1], matrix[0]);
        const radianY: number = $Math.atan2(0 - matrix[2], matrix[3]);
        if (!drawFilter && (radianX || radianY)) {

            const tx: number = baseBounds.xMin * xScale;
            const ty: number = baseBounds.yMin * yScale;

            const cosX: number = $Math.cos(radianX);
            const sinX: number = $Math.sin(radianX);
            const cosY: number = $Math.cos(radianY);
            const sinY: number = $Math.sin(radianY);

            context.setTransform(
                cosX, sinX, 0 - sinY, cosY,
                tx * cosX - ty * sinY + matrix[4],
                tx * sinX + ty * cosY + matrix[5]
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
        context.globalCompositeOperation = blend_mode;

        context.drawImage(texture,
            0, 0, texture.width, texture.height, color_transform
        );

        // pool
        $poolArray(cacheKeys);
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

            css.addColorStop(color.ratio, $getFloat32Array4(
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

            const cacheStore: CacheStore = $renderPlayer.cacheStore;
            cacheStore.removeCache(this._$instanceId);

            if (this._$loaderInfoId > -1
                && this._$characterId > -1
            ) {
                cacheStore.removeCache(
                    `${this._$loaderInfoId}@${this._$characterId}`
                );
            }
        }
    }
}