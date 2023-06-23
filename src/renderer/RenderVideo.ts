import { RenderDisplayObject } from "./RenderDisplayObject";
import { Rectangle } from "../next2d/geom/Rectangle";
import type { BoundsImpl } from "../interface/BoundsImpl";
import type { FrameBufferManager } from "../webgl/FrameBufferManager";
import type { AttachmentImpl } from "../interface/AttachmentImpl";
import type { CanvasToWebGLContext } from "../webgl/CanvasToWebGLContext";
import type { PropertyVideoMessageImpl } from "../interface/PropertyVideoMessageImpl";
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
    $OffscreenCanvas, $getFloat32Array6
} from "../util/RenderUtil";
import { $videos } from "./RenderGlobal";

/**
 * @class
 */
export class RenderVideo extends RenderDisplayObject
{
    private _$imageBitmap: ImageBitmap | null;
    private _$context: OffscreenCanvasRenderingContext2D | null;
    private _$smoothing: boolean;

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

        // cache current buffer
        const manager: FrameBufferManager = context.frameBuffer;
        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;
        if (!currentAttachment
            || xMin > currentAttachment.width
            || yMin > currentAttachment.height
        ) {
            return;
        }

        if (0 > xMin + width || 0 > yMin + height) {

            if (this._$filters
                && this._$filters.length
                && this._$canApply(this._$filters)
            ) {

                const xScale: number = +$Math.sqrt(
                    multiMatrix[0] * multiMatrix[0]
                    + multiMatrix[1] * multiMatrix[1]
                );

                const yScale: number = +$Math.sqrt(
                    multiMatrix[2] * multiMatrix[2]
                    + multiMatrix[3] * multiMatrix[3]
                );

                let rect: Rectangle = new Rectangle(0, 0, width, height);
                for (let idx: number = 0; idx < this._$filters.length ; ++idx) {
                    rect = this._$filters[idx]
                        ._$generateFilterRect(rect, xScale, yScale);
                }

                if (0 > rect.x + rect.width || 0 > rect.y + rect.height) {
                    return;
                }

            } else {
                return;
            }

        }

        this._$context.drawImage(this._$imageBitmap, 0, 0);

        let texture: WebGLTexture = manager
            .textureManager
            ._$createFromElement(
                this._$imageBitmap.width,
                this._$imageBitmap.height,
                this._$context.canvas,
                this._$smoothing
            );

        if (this._$filters
            && this._$filters.length
            && this._$canApply(this._$filters)
        ) {

            const xScale: number = +$Math.sqrt(
                multiMatrix[0] * multiMatrix[0]
                + multiMatrix[1] * multiMatrix[1]
            );
            const yScale: number = +$Math.sqrt(
                multiMatrix[2] * multiMatrix[2]
                + multiMatrix[3] * multiMatrix[3]
            );

            if (xScale !== 1 || yScale !== 1) {

                const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

                // create cache buffer
                const attachment: AttachmentImpl = manager
                    .createCacheAttachment(width, height, false);
                context._$bind(attachment);

                const parentMatrix: Float32Array = $getFloat32Array6(
                    xScale, 0, 0, yScale,
                    width / 2, height / 2
                );

                const baseMatrix: Float32Array = $getFloat32Array6(
                    1, 0, 0, 1,
                    0 - texture.width / 2,
                    0 - texture.height / 2
                );

                const scaleMatrix: Float32Array = $multiplicationMatrix(
                    parentMatrix, baseMatrix
                );

                $poolFloat32Array6(parentMatrix);
                $poolFloat32Array6(baseMatrix);

                context.reset();
                context.setTransform(
                    scaleMatrix[0], scaleMatrix[1],
                    scaleMatrix[2], scaleMatrix[3],
                    scaleMatrix[4], scaleMatrix[5]
                );
                context.drawImage(texture,
                    0, 0, texture.width, texture.height
                );

                manager.releaseTexture(texture);
                $poolFloat32Array6(scaleMatrix);

                texture = manager.getTextureFromCurrentAttachment();

                // release buffer
                manager.releaseAttachment(attachment, false);

                // end draw and reset current buffer
                context._$bind(currentAttachment);
            }

            // draw filter
            texture = this._$drawFilter(
                context, texture, multiMatrix,
                this._$filters, width, height
            );

            // draw
            context.reset();
            context.globalAlpha = alpha;
            context.imageSmoothingEnabled = this._$smoothing;
            context.globalCompositeOperation = this._$blendMode;

            // size
            const baseBounds: BoundsImpl = this._$getBounds();
            const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
            $poolBoundsObject(baseBounds);

            context.setTransform(1, 0, 0, 1,
                bounds.xMin - texture._$offsetX,
                bounds.yMin - texture._$offsetY
            );
            $poolBoundsObject(bounds);

            context.drawImage(texture,
                0, 0, texture.width, texture.height,
                color_transform
            );

        } else {

            // draw
            context.reset();
            context.globalAlpha = alpha;
            context.imageSmoothingEnabled = this._$smoothing;
            context.globalCompositeOperation = this._$blendMode;

            context.setTransform(
                multiMatrix[0], multiMatrix[1], multiMatrix[2],
                multiMatrix[3], multiMatrix[4], multiMatrix[5]
            );

            context.drawImage(texture,
                0, 0, texture.width, texture.height,
                color_transform
            );

            manager.releaseTexture(texture);
        }

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