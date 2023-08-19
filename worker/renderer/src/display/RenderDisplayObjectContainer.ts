import { RenderGraphics } from "./RenderGraphics";
import type { RenderDisplayObjectImpl } from "../interface/RenderDisplayObjectImpl";
import type { FilterArrayImpl } from "../interface/FilterArrayImpl";
import type { BlendModeImpl } from "../interface/BlendModeImpl";
import type { BoundsImpl } from "../interface/BoundsImpl";
import type { AttachmentImpl } from "../interface/AttachmentImpl";
import type { ParentImpl } from "../interface/ParentImpl";
import type { PreObjectImpl } from "../interface/PreObjectImpl";
import type {
    CanvasToWebGLContext,
    FrameBufferManager
} from "@next2d/webgl";
import {
    $containers,
    $renderPlayer
} from "../RenderGlobal";
import {
    $cacheStore,
    $boundsMatrix,
    $clamp,
    $getArray,
    $getBoundsObject,
    $getFloat32Array6,
    $getFloat32Array8,
    $getPreObject,
    $Math,
    $MATRIX_ARRAY_IDENTITY,
    $multiplicationColor,
    $multiplicationMatrix,
    $Number,
    $poolBoundsObject,
    $poolFloat32Array6,
    $poolFloat32Array8,
    $poolPreObject,
    $devicePixelRatio
} from "@next2d/share";

/**
 * @class
 */
export class RenderDisplayObjectContainer extends RenderGraphics
{
    private _$children: Int32Array;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {Int32Array}
         * @private
         */
        this._$children = new Int32Array();
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

        let multiMatrix: Float32Array = matrix;
        const rawMatrix: Float32Array = this._$matrix;
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        if (this._$recodes && this._$canDraw) {
            super._$clip(context, multiMatrix);
        }

        const instances: Map<number, RenderDisplayObjectImpl<any>> = $renderPlayer.instances;
        const children: Int32Array = this._$children;
        for (let idx: number = 0; idx < this._$children.length; ++idx) {

            const id: number = children[idx];
            if (!instances.has(id)) {
                continue;
            }

            const instance: RenderDisplayObjectImpl<any> | void = instances.get(id);

            // mask instance
            if (!instance || instance._$isMask) {
                continue;
            }

            instance._$clip(context, multiMatrix);
            instance._$updated = false;

        }

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

        // not draw
        if (!this._$visible) {
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

        // not draw
        const alpha: number = $clamp(multiColor[3] + multiColor[7] / 255, 0, 1, 0);
        if (!alpha) {
            return ;
        }

        // not draw
        const children: Int32Array = this._$children;
        const length: number = children.length;
        if (!length && (!this._$recodes || !this._$canDraw)) {
            return ;
        }

        // pre data
        const preObject: PreObjectImpl | null = this._$preDraw(context, matrix);
        if (!preObject) {
            return ;
        }

        // use cache
        if (preObject.isLayer && !preObject.isUpdated) {
            this._$postDraw(context, matrix, multiColor, preObject);
            return ;
        }

        const preMatrix: Float32Array = preObject.matrix as NonNullable<Float32Array>;
        const preColorTransform: Float32Array = preObject.isLayer && preObject.color
            ? preObject.color
            : multiColor;

        // if graphics draw
        if (this._$recodes && this._$canDraw && this._$maxAlpha > 0) {
            super._$draw(context, preMatrix, preColorTransform);
        }

        // init clip params
        let shouldClip: boolean = true;
        let clipDepth: number   = 0;

        // draw children
        const instances: Map<number, RenderDisplayObjectImpl<any>> = $renderPlayer.instances;
        const isLayer: boolean  = context.isLayer;
        for (let idx: number = 0; idx < length; ++idx) {

            const id: number = children[idx];
            if (!instances.has(id)) {
                continue;
            }

            const instance: RenderDisplayObjectImpl<any> = instances.get(id);

            // mask instance
            if (instance._$isMask) {
                continue;
            }

            // not layer mode
            const blendMode: BlendModeImpl = instance._$blendMode;
            if ((blendMode === "alpha" || blendMode === "erase")
                && !isLayer
            ) {
                continue;
            }

            // mask end
            if (clipDepth
                && (instance._$depth > clipDepth || instance._$clipDepth > 0)
            ) {

                context.restore();

                if (shouldClip) {
                    context._$leaveClip();
                }

                // clear
                clipDepth  = 0;
                shouldClip = true;
            }

            // mask size 0
            if (!shouldClip) {
                continue;
            }

            // mask start
            if (instance._$clipDepth > 0) {

                clipDepth  = instance._$clipDepth;
                shouldClip = instance._$shouldClip(preMatrix);

                if (shouldClip) {
                    context.save();
                    shouldClip = instance._$startClip(context, preMatrix);
                }

                continue;
            }

            // mask start
            const maskInstance: RenderDisplayObjectImpl<any> | null = instance._$maskId > -1 && instances.has(instance._$maskId)
                ? instances.get(instance._$maskId)
                : null;

            if (maskInstance) {

                maskInstance._$updated = false;

                let maskMatrix: Float32Array;

                if (this._$instanceId === maskInstance._$parentId) {

                    maskMatrix = preMatrix;

                } else {

                    maskMatrix = $MATRIX_ARRAY_IDENTITY;

                    let parent: ParentImpl<any> | void = instances.get(maskInstance._$parentId);
                    while (parent || parent._$instanceId !== parent._$parentId) {

                        maskMatrix = $multiplicationMatrix(
                            parent._$matrix,
                            maskMatrix
                        );

                        parent = instances.get(parent._$parentId);
                    }

                    const mScale: number = $renderPlayer.scaleX;
                    const playerMatrix: Float32Array = $getFloat32Array6(
                        mScale, 0, 0, mScale, 0, 0
                    );

                    maskMatrix = $multiplicationMatrix(
                        playerMatrix, maskMatrix
                    );
                    $poolFloat32Array6(playerMatrix);

                    if (context.isLayer) {
                        const currentPosition: BoundsImpl = context.getCurrentPosition();
                        maskMatrix[4] -= currentPosition.xMin;
                        maskMatrix[5] -= currentPosition.yMin;
                    }
                }

                if (!maskInstance._$shouldClip(maskMatrix)) {
                    continue;
                }

                const result: boolean = maskInstance._$startClip(context, maskMatrix);

                context.save();

                if (!result) { // fixed
                    context.restore();
                    continue;
                }
            }

            instance._$draw(context, preMatrix, preColorTransform);
            instance._$updated = false;

            // mask end
            if (maskInstance) {
                context.restore();
                context._$leaveClip();
            }
        }

        // end mask
        if (clipDepth) {
            context.restore();

            if (shouldClip) {
                context._$leaveClip();
            }
        }

        // filter and blend
        if (preObject.isLayer) {
            return this._$postDraw(context, matrix, multiColor, preObject);
        }

        if (preObject.matrix !== matrix) {
            $poolFloat32Array6(preObject.matrix as NonNullable<Float32Array>);
        }

        if (multiColor !== color_transform) {
            $poolFloat32Array8(multiColor);
        }

        $poolPreObject(preObject);
    }

    /**
     * @param  {Float32Array} multi_matrix
     * @return {object}
     * @private
     */
    _$getLayerBounds (multi_matrix: Float32Array): BoundsImpl
    {
        const isGraphics: boolean  = !!this._$recodes;
        const children: Int32Array = this._$children;
        const length: number       = children.length;

        // size zero
        if (!length && !isGraphics) {
            return $getBoundsObject(0, 0, 0, 0);
        }

        // data init
        const no: number = $Number.MAX_VALUE;
        let xMin: number = no;
        let xMax: number = -no;
        let yMin: number = no;
        let yMax: number = -no;

        if (isGraphics) {

            const baseBounds: BoundsImpl = $getBoundsObject(
                this._$xMin, this._$xMax,
                this._$yMin, this._$yMax
            );
            const bounds: BoundsImpl = $boundsMatrix(baseBounds, multi_matrix);
            $poolBoundsObject(baseBounds);

            xMin   = +bounds.xMin;
            xMax   = +bounds.xMax;
            yMin   = +bounds.yMin;
            yMax   = +bounds.yMax;
            $poolBoundsObject(bounds);
        }

        const instances: Map<number, RenderDisplayObjectImpl<any>> = $renderPlayer.instances;
        for (let idx: number = 0; idx < children.length; ++idx) {

            const id: number = children[idx];
            if (!instances.has(id)) {
                continue;
            }

            const instance = instances.get(id);

            let multiMatrix = multi_matrix;
            const rawMatrix: Float32Array = instance._$matrix;
            if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
                || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
                || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
            ) {
                multiMatrix = $multiplicationMatrix(multi_matrix, rawMatrix);
            }

            const bounds: BoundsImpl = instance._$getLayerBounds(multiMatrix);

            xMin = $Math.min(xMin, bounds.xMin);
            xMax = $Math.max(xMax, bounds.xMax);
            yMin = $Math.min(yMin, bounds.yMin);
            yMax = $Math.max(yMax, bounds.yMax);

            $poolBoundsObject(bounds);

            if (multiMatrix !== multi_matrix) {
                $poolFloat32Array6(multiMatrix);
            }
        }

        if (!this._$filters || !this._$filters.length) {
            return $getBoundsObject(xMin, xMax, yMin, yMax);
        }

        let filterBounds: BoundsImpl = $getBoundsObject(
            0, xMax - xMin,
            0, yMax - yMin
        );

        let xScale: number = +$Math.sqrt(
            multi_matrix[0] * multi_matrix[0]
            + multi_matrix[1] * multi_matrix[1]
        );
        let yScale: number = +$Math.sqrt(
            multi_matrix[2] * multi_matrix[2]
            + multi_matrix[3] * multi_matrix[3]
        );

        xScale /= $devicePixelRatio;
        yScale /= $devicePixelRatio;

        xScale *= 2;
        yScale *= 2;
        for (let idx: number = 0; idx < this._$filters.length; ++idx) {
            filterBounds = this._$filters[idx]
                ._$generateFilterRect(filterBounds, xScale, yScale);
        }

        xMax += filterBounds.xMax - (xMax - xMin);
        yMax += filterBounds.yMax - (yMax - yMin);
        xMin += filterBounds.xMin;
        yMin += filterBounds.yMin;

        $poolBoundsObject(filterBounds);

        return $getBoundsObject(xMin, xMax, yMin, yMax);
    }

    /**
     * @param   {Float32Array} [matrix=null]
     * @returns {object}
     * @method
     * @private
     */
    _$getBounds (matrix: Float32Array | null = null): BoundsImpl
    {
        let multiMatrix: Float32Array = $MATRIX_ARRAY_IDENTITY;
        if (matrix) {

            multiMatrix = matrix;

            const rawMatrix: Float32Array = this._$matrix;
            if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
                || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
                || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
            ) {
                multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
            }
        }

        const isGraphics: boolean  = !!this._$recodes;
        const children: Int32Array = this._$children;
        const length: number       = children.length;

        // size zero
        if (!length && !isGraphics) {

            const bounds: BoundsImpl = $getBoundsObject(
                multiMatrix[4], -multiMatrix[4],
                multiMatrix[5], -multiMatrix[5]
            );

            if (matrix && multiMatrix !== matrix) {
                $poolFloat32Array6(multiMatrix);
            }

            return bounds;
        }

        // data init
        const no = $Number.MAX_VALUE;
        let xMin = no;
        let xMax = -no;
        let yMin = no;
        let yMax = -no;

        if (isGraphics) {

            const baseBounds: BoundsImpl = $getBoundsObject(
                this._$xMin, this._$xMax,
                this._$yMin, this._$yMax
            );
            $poolBoundsObject(baseBounds);

            const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
            xMin = bounds.xMin;
            xMax = bounds.xMax;
            yMin = bounds.yMin;
            yMax = bounds.yMax;
            $poolBoundsObject(bounds);
        }

        const instances: Map<number, RenderDisplayObjectImpl<any>> = $renderPlayer.instances;
        for (let idx: number = 0; idx < children.length; ++idx) {

            const id: number = children[idx];
            if (!instances.has(id)) {
                continue;
            }

            const bounds: BoundsImpl = instances
                .get(id)
                ._$getBounds(multiMatrix);

            xMin = $Math.min(xMin, bounds.xMin);
            xMax = $Math.max(xMax, bounds.xMax);
            yMin = $Math.min(yMin, bounds.yMin);
            yMax = $Math.max(yMax, bounds.yMax);

            $poolBoundsObject(bounds);

        }

        if (matrix && multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
        }

        // end
        return $getBoundsObject(xMin, xMax, yMin, yMax);
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {object}
     * @private
     */
    _$preDraw (
        context: CanvasToWebGLContext,
        matrix: Float32Array
    ): PreObjectImpl | null {

        let multiMatrix: Float32Array = matrix;
        const rawMatrix: Float32Array = this._$matrix;
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        // size zero
        if (!multiMatrix[0] && !multiMatrix[1]
            || !multiMatrix[2] && !multiMatrix[3]
        ) {
            return null;
        }

        // return object
        const object: PreObjectImpl = $getPreObject();

        // setup
        object.matrix = multiMatrix;

        // check
        const blendMode: BlendModeImpl = this._$blendMode;
        if (blendMode !== "normal"
            || this._$filters && this._$filters.length > 0
        ) {

            // check size
            const baseBounds: BoundsImpl = this._$getBounds(null);
            const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
            $poolBoundsObject(baseBounds);

            const xMax: number = +bounds.xMax;
            const xMin: number = +bounds.xMin;
            const yMax: number = +bounds.yMax;
            const yMin: number = +bounds.yMin;
            $poolBoundsObject(bounds);

            const width: number  = $Math.ceil($Math.abs(xMax - xMin));
            const height: number = $Math.ceil($Math.abs(yMax - yMin));
            if (0 >= width || 0 >= height) {
                $poolPreObject(object);
                if (multiMatrix !== matrix) {
                    $poolFloat32Array6(multiMatrix);
                }
                return null;
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

            object.canApply = this._$canApply(this._$filters);
            let filterBounds: BoundsImpl = $getBoundsObject(0, width, 0, height);
            if (object.canApply && this._$filters) {
                for (let idx: number = 0; idx < this._$filters.length ; ++idx) {
                    filterBounds = this._$filters[idx]
                        ._$generateFilterRect(filterBounds, xScale, yScale);
                }
            }

            const currentAttachment: AttachmentImpl | null = context
                .frameBuffer
                .currentAttachment;

            if (!currentAttachment
                || !currentAttachment.texture
                || xMin - filterBounds.xMin > currentAttachment.width
                || yMin - filterBounds.yMin > currentAttachment.height
            ) {
                $poolBoundsObject(filterBounds);
                $poolPreObject(object);
                if (multiMatrix !== matrix) {
                    $poolFloat32Array6(multiMatrix);
                }
                return null;
            }

            if (0 > xMin + filterBounds.xMax || 0 > yMin + filterBounds.yMax) {
                $poolBoundsObject(filterBounds);
                $poolPreObject(object);
                if (multiMatrix !== matrix) {
                    $poolFloat32Array6(multiMatrix);
                }
                return null;
            }

            // move size
            let tx: number = multiMatrix[4] - xMin;
            let ty: number = multiMatrix[5] - yMin;

            // start layer
            context._$startLayer(
                $getBoundsObject(xMin, xMax, yMin, yMax)
            );

            // check cache
            const updated: boolean = this._$isFilterUpdated(
                multiMatrix, this._$filters, object.canApply
            );

            const layerBounds: BoundsImpl = this._$getLayerBounds(multiMatrix);

            const layerWidth: number  = $Math.ceil($Math.abs(layerBounds.xMax - layerBounds.xMin));
            const layerHeight: number = $Math.ceil($Math.abs(layerBounds.yMax - layerBounds.yMin));
            $poolBoundsObject(layerBounds);

            const sw = layerWidth  - filterBounds.xMax + filterBounds.xMin;
            const sh = layerHeight - filterBounds.yMax + filterBounds.yMin;

            tx += sw;
            ty += sh;

            object.sw = sw;
            object.sh = sh;
            if (updated) {
                context._$saveAttachment(
                    $Math.ceil(width  + sw),
                    $Math.ceil(height + sh),
                    true
                );
            }

            // setup
            object.isLayer   = true;
            object.isUpdated = updated;
            object.filters   = this._$filters;
            object.blendMode = blendMode;
            object.color     = $getFloat32Array8();
            object.matrix    = $getFloat32Array6(
                multiMatrix[0], multiMatrix[1],
                multiMatrix[2], multiMatrix[3],
                tx, ty
            );

            if (multiMatrix !== matrix) {
                $poolFloat32Array6(multiMatrix);
            }

            $poolBoundsObject(filterBounds);
        }

        return object;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$postDraw (
        context: CanvasToWebGLContext,
        matrix: Float32Array,
        color_transform: Float32Array,
        object: PreObjectImpl
    ): void {

        context.drawInstacedArray();

        // cache
        const cacheKeys: any[] = $getArray(this._$instanceId, "f");

        const manager: FrameBufferManager = context.frameBuffer;
        const multiMatrix: Float32Array = object.matrix as NonNullable<Float32Array>;

        let offsetX: number = 0;
        let offsetY: number = 0;
        let texture: WebGLTexture | null = $cacheStore.get(cacheKeys);

        if (!texture || object.isUpdated) {

            // remove
            if (texture) {
                $cacheStore.set(cacheKeys, null);
            }

            texture = manager
                .getTextureFromCurrentAttachment();

            const filters: FilterArrayImpl | null = object.filters;
            let filterState = false;
            if (filters && filters.length) {

                for (let idx: number = 0; idx < filters.length; ++idx) {
                    texture = filters[idx]
                        ._$applyFilter(context, matrix);
                }

                // update
                filterState = true;
                offsetX = context._$offsetX;
                offsetY = context._$offsetY;

                // reset
                context._$offsetX = 0;
                context._$offsetY = 0;
            }

            texture.filterState = filterState;
            texture.matrix = `${multiMatrix[0]}_`
                + `${multiMatrix[1]}_`
                + `${multiMatrix[2]}_`
                + `${multiMatrix[3]}`;

            texture.offsetX = offsetX;
            texture.offsetY = offsetY;

            $cacheStore.set(cacheKeys, texture);

            context._$restoreAttachment();
        }

        if (texture.offsetX) {
            offsetX = texture.offsetX;
        }

        if (texture.offsetY) {
            offsetY = texture.offsetY;
        }

        // set
        context.reset();
        context.globalAlpha = $clamp(
            color_transform[3] + color_transform[7] / 255, 0, 1
        );
        context.globalCompositeOperation = object.blendMode;

        const bounds: BoundsImpl = context.getCurrentPosition();

        context.setTransform(
            1, 0, 0, 1,
            bounds.xMin - offsetX - object.sw,
            bounds.yMin - offsetY - object.sh
        );

        context.drawImage(texture,
            0, 0, texture.width, texture.height,
            color_transform
        );

        // end blend
        context._$endLayer();

        // end blend
        context._$endLayer();

        // object pool
        $poolFloat32Array6(object.matrix as NonNullable<Float32Array>);
        $poolPreObject(object);

        // reset
        context.cachePosition = null;
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
        // reset
        this._$children = new Int32Array();
        this._$recodes  = null;

        super._$remove();

        $containers.push(this);
    }
}