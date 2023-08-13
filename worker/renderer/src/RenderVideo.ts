import { RenderDisplayObject } from "./RenderDisplayObject";
import { $renderPlayer, $videos } from "./RenderGlobal";
import type { BoundsImpl } from "./interface/BoundsImpl";
import type { AttachmentImpl } from "./interface/AttachmentImpl";
import type { PropertyVideoMessageImpl } from "./interface/PropertyVideoMessageImpl";
import type { FilterArrayImpl } from "./interface/FilterArrayImpl";
import type { CachePositionImpl } from "./interface/CachePositionImpl";
import type {
    CanvasToWebGLContext,
    FrameBufferManager
} from "@next2d/webgl";
import {
    $boundsMatrix,
    $clamp,
    $Infinity,
    $Math,
    $multiplicationColor,
    $multiplicationMatrix,
    $poolBoundsObject,
    $poolFloat32Array6,
    $poolFloat32Array8,
    $OffscreenCanvas,
    $getBoundsObject,
    $getArray,
    CacheStore,
    $Number,
    $poolArray,
    $getFloat32Array6
} from "@next2d/share";

/**
 * @class
 */
export class RenderVideo extends RenderDisplayObject
{
    private _$imageBitmap: ImageBitmap | null;
    private _$context: OffscreenCanvasRenderingContext2D | null;
    private _$smoothing: boolean;
    private _$cacheKeys: string[];
    private _$cacheParams: number[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {ImageBitmap}
         * @default null
         * @private
         */
        this._$imageBitmap = null;

        /**
         * @type {OffscreenCanvasRenderingContext2D}
         * @default null
         * @private
         */
        this._$context = null;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$smoothing = true;

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

        const width: number  = this._$xMax;
        const height: number = this._$yMax;
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
            multiMatrix[0], multiMatrix[1], multiMatrix[2],
            multiMatrix[3], multiMatrix[4], multiMatrix[5]
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

        if (!this._$visible
            || !this._$imageBitmap
            || !this._$context
        ) {
            return ;
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

        const alpha: number = $clamp(multiColor[3] + multiColor[7] / 255, 0, 1, 0);
        if (!alpha) {
            if (multiColor !== color_transform) {
                $poolFloat32Array8(multiColor);
            }
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

        // default bounds
        const baseBounds: BoundsImpl = this._$getBounds();
        $poolBoundsObject(baseBounds);

        const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
        const xMax: number   = +bounds.xMax;
        const xMin: number   = +bounds.xMin;
        const yMax: number   = +bounds.yMax;
        const yMin: number   = +bounds.yMin;
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

        const filters: FilterArrayImpl | null = this._$filters;
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

        const cacheStore: CacheStore = $renderPlayer.cacheStore;
        if (!this._$cacheKeys.length
            || this._$cacheParams[0] !== xScale
            || this._$cacheParams[1] !== yScale
            || this._$cacheParams[2] !== color_transform[7]
        ) {
            const keys: number[] = $getArray();
            keys[0] = xScale;
            keys[1] = yScale;

            this._$cacheKeys = cacheStore.generateKeys(
                this._$instanceId, keys, color_transform
            );

            $poolArray(keys);

            this._$cacheParams[0] = xScale;
            this._$cacheParams[1] = yScale;
            this._$cacheParams[2] = color_transform[7];
        }

        context.cachePosition = cacheStore.get(this._$cacheKeys);
        if (!context.cachePosition) {

            const width: number  = $Math.ceil($Math.abs(this._$xMax - this._$xMin));
            const height: number = $Math.ceil($Math.abs(this._$yMax - this._$yMin));

            const position: CachePositionImpl = manager
                .createCachePosition(width, height);

            context.cachePosition = position;
            cacheStore.set(this._$cacheKeys, position);
        }

        this._$context.drawImage(this._$imageBitmap, 0, 0);

        const texture: WebGLTexture = manager
            .textureManager
            ._$createFromElement(
                this._$imageBitmap.width,
                this._$imageBitmap.height,
                this._$context.canvas,
                this._$smoothing
            );

        let offsetX: number = 0;
        let offsetY: number = 0;
        if (canApply && filters) {

            const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

            const attachment: AttachmentImpl = manager
                .createCacheAttachment(width, height);

            context._$bind(attachment);

            context.reset();

            const parentMatrix: Float32Array = $getFloat32Array6(
                xScale, 0, 0, yScale,
                width / 2, height / 2
            );

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

            const videoTexture: WebGLTexture = manager.getTextureFromCurrentAttachment();
            context._$bind(currentAttachment);

            manager.releaseAttachment(attachment);

            // release
            context.drawTextureFromRect(texture, context.cachePosition);

            const position: CachePositionImpl = this._$drawFilter(
                context, multiMatrix, filters,
                width, height, videoTexture
            );

            if (position.offsetX) {
                offsetX = position.offsetX;
            }

            if (position.offsetY) {
                offsetY = position.offsetY;
            }

            // update
            context.cachePosition = position;

            context.setTransform(1, 0, 0, 1,
                xMin - offsetX, yMin - offsetY
            );

        } else {

            context.drawTextureFromRect(texture, context.cachePosition);

            context.setTransform(
                multiMatrix[0], multiMatrix[1], multiMatrix[2],
                multiMatrix[3], multiMatrix[4], multiMatrix[5]
            );

        }

        // draw
        if (context.cachePosition) {

            context.globalAlpha = alpha;
            context.imageSmoothingEnabled = true;
            context.globalCompositeOperation = this._$blendMode;

            context.drawInstance(
                xMin - offsetX, yMin - offsetY, xMax, yMax,
                color_transform
            );

            // cache position clear
            context.cachePosition = null;
        }

        // pool
        if (multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
        }

        if (multiColor !== color_transform) {
            $poolFloat32Array8(multiColor);
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
        this._$xMin        = 0;
        this._$yMin        = 0;
        this._$xMax        = 0;
        this._$yMax        = 0;
        this._$context     = null;
        this._$imageBitmap = null;
        this._$smoothing   = true;

        super._$remove();

        $videos.push(this);
    }

    /**
     * @description 情報を更新
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$updateProperty (object: PropertyVideoMessageImpl)
    {
        this._$xMin        = object.xMin as NonNullable<number>;
        this._$yMin        = object.yMin as NonNullable<number>;
        this._$xMax        = object.xMax as NonNullable<number>;
        this._$yMax        = object.yMax as NonNullable<number>;
        this._$imageBitmap = object.imageBitmap as NonNullable<ImageBitmap>;
        this._$smoothing   = object.smoothing as NonNullable<boolean>;

        if (!this._$context && this._$imageBitmap) {
            const canvas: OffscreenCanvas = new $OffscreenCanvas(
                this._$imageBitmap.width,
                this._$imageBitmap.height
            );
            this._$context = canvas.getContext("2d");
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
    _$update (object: PropertyVideoMessageImpl): void
    {
        super._$update(object);
        this._$updateProperty(object);
    }
}