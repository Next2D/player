import { RenderGraphics } from "./RenderGraphics";
import { Rectangle } from "../next2d/geom/Rectangle";
import type { CanvasToWebGLContext } from "../webgl/CanvasToWebGLContext";
import type { RenderDisplayObjectImpl } from "../interface/RenderDisplayObjectImpl";
import type { PreObjectImpl } from "../interface/PreObjectImpl";
import type { FilterArrayImpl } from "../interface/FilterArrayImpl";
import type { BlendModeImpl } from "../interface/BlendModeImpl";
import type { BoundsImpl } from "../interface/BoundsImpl";
import type { AttachmentImpl } from "../interface/AttachmentImpl";
import type { CacheStore } from "../util/CacheStore";
import type { FrameBufferManager } from "../webgl/FrameBufferManager";
import type { DisplayObjectImpl } from "../interface/DisplayObjectImpl";
import type { ParentImpl } from "../interface/ParentImpl";
import {
    $containers,
    $renderPlayer
} from "./RenderGlobal";
import {
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
    $poolArray,
    $poolBoundsObject,
    $poolFloat32Array6,
    $poolFloat32Array8,
    $poolPreObject
} from "../util/RenderUtil";

/**
 * @class
 */
export class RenderDisplayObjectContainer extends RenderGraphics
{
    private readonly _$children: number[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {array}
         * @private
         */
        this._$children = $getArray();
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
        const children: number[] = this._$children;
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
        const children: number[] = this._$children;
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
        if (preObject.isFilter && !preObject.isUpdated) {
            this._$postDraw(context, matrix, multiColor, preObject);
            return ;
        }

        let preMatrix: Float32Array = preObject.matrix as NonNullable<Float32Array>;
        const preColorTransform: Float32Array = preObject.isFilter && preObject.color
            ? preObject.color
            : multiColor;

        // if graphics draw
        if (this._$recodes && this._$canDraw && this._$maxAlpha > 0) {
            super._$draw(context, preMatrix, preColorTransform);
        }

        // init clip params
        let shouldClip: boolean = true;
        let clipDepth: number   = 0;

        const clipMatrix: Float32Array[]     = $getArray();
        const instanceMatrix: Float32Array[] = $getArray();
        const clipStack: number[]            = $getArray();
        const shouldClips: boolean[]         = $getArray();

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
                && (instance._$placeId > clipDepth || instance._$clipDepth > 0)
            ) {

                context.restore();

                if (shouldClip) {
                    context._$leaveClip();

                    if (clipMatrix.length) {
                        const matrix: Float32Array | void = clipMatrix.pop();
                        if (matrix) {
                            $poolFloat32Array6(preMatrix);
                            preMatrix = matrix;
                        }
                    }

                }

                // clear
                clipDepth  = clipStack.length ? clipStack.pop() || 0 : 0;
                shouldClip = !!shouldClips.pop();
            }

            // mask size 0
            if (!shouldClip) {
                continue;
            }

            // mask start
            if (instance._$clipDepth > 0) {

                context.save();

                if (clipDepth) {
                    clipStack.push(clipDepth);
                }

                shouldClips.push(shouldClip);

                clipDepth  = instance._$clipDepth;
                shouldClip = instance._$shouldClip(preMatrix);
                if (shouldClip) {

                    const adjMatrix: Float32Array | boolean | null
                        = instance._$startClip(context, preMatrix);

                    if (adjMatrix === false) { // fixed
                        shouldClip = false;
                        continue;
                    }

                    if (adjMatrix instanceof Float32Array) {
                        clipMatrix.push(preMatrix);
                        preMatrix = adjMatrix;
                    }

                }

                continue;
            }

            // mask start
            const maskInstance: DisplayObjectImpl<any> | null = instance._$maskId > -1 && instances.has(instance._$maskId)
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

                    if (context.cacheBounds) {
                        maskMatrix[4] -= context.cacheBounds.xMin;
                        maskMatrix[5] -= context.cacheBounds.yMin;
                    }
                }

                if (!maskInstance._$shouldClip(maskMatrix)) {
                    continue;
                }

                const adjMatrix: Float32Array | boolean | null = maskInstance._$startClip(context, maskMatrix);

                context.save();

                if (adjMatrix === false) { // fixed
                    context.restore();
                    continue;
                }

                if (adjMatrix instanceof Float32Array) {

                    instanceMatrix.push(preMatrix);

                    if (this !== maskInstance._$parent) {
                        const rawMatrix: Float32Array = this._$matrix;
                        adjMatrix[0] = $Math.abs(preMatrix[0]) * $Math.sign(rawMatrix[0]);
                        adjMatrix[1] = $Math.abs(preMatrix[1]) * $Math.sign(rawMatrix[1]);
                        adjMatrix[2] = $Math.abs(preMatrix[2]) * $Math.sign(rawMatrix[2]);
                        adjMatrix[3] = $Math.abs(preMatrix[3]) * $Math.sign(rawMatrix[3]);
                        adjMatrix[4] = preMatrix[4] - context.cacheBounds.xMin;
                        adjMatrix[5] = preMatrix[5] - context.cacheBounds.yMin;
                    }

                    preMatrix = adjMatrix;
                }

            }

            instance._$draw(context, preMatrix, preColorTransform);
            instance._$updated = false;

            // mask end
            if (maskInstance) {

                context.restore();

                context._$leaveClip();

                if (instanceMatrix.length) {
                    const matrix: Float32Array | void = instanceMatrix.pop();
                    if (matrix) {
                        $poolFloat32Array6(preMatrix);
                        preMatrix = matrix;
                    }
                }

            }
        }

        // end mask
        if (clipDepth) {

            context.restore();

            if (shouldClips.pop()) {
                context._$leaveClip();
            }

        }

        // object pool
        $poolArray(clipMatrix);
        $poolArray(instanceMatrix);
        $poolArray(clipStack);
        $poolArray(shouldClips);

        // filter and blend
        if (preObject.isFilter) {
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
     * @param  {array} [matrix=null]
     * @return {object}
     * @private
     */
    _$getLayerBounds (matrix = null)
    {
        let multiMatrix: Float32Array = $MATRIX_ARRAY_IDENTITY;
        if (matrix) {

            multiMatrix = matrix;

            const rawMatrix: Float32Array = this._$matrix;
            if (rawMatrix !== $MATRIX_ARRAY_IDENTITY) {
                multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
            }
        }

        const isGraphics: boolean = !!this._$recodes;
        const children: number[]  = this._$children;
        const length: number      = children.length;

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
            const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
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

            const bounds: BoundsImpl = instances
                .get(id)
                ._$getLayerBounds(multiMatrix);

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
        if (!matrix) {
            return $getBoundsObject(xMin, xMax, yMin, yMax);
        }

        if (!this._$filters) {
            return $getBoundsObject(xMin, xMax, yMin, yMax);
        }

        let rect: Rectangle = new Rectangle(xMin, yMin, xMax - xMin, yMax - yMin);
        for (let idx: number = 0; idx < this._$filters.length; ++idx) {
            rect = this._$filters[idx]
                ._$generateFilterRect(rect, 0, 0);
        }

        xMin = rect.x;
        xMax = rect.x + rect.width;
        yMin = rect.y;
        yMax = rect.y + rect.height;

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

        const isGraphics: boolean = !!this._$recodes;
        const children: number[]  = this._$children;
        const length: number      = children.length;

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

            const width: number  = $Math.abs(xMax - xMin);
            const height: number = $Math.abs(yMax - yMin);
            if (0 >= width || 0 >= height) {
                $poolPreObject(object);
                return null;
            }

            if (0 > xMin + width || 0 > yMin + height) {
                $poolPreObject(object);
                return null;
            }

            const currentAttachment: AttachmentImpl | null = context
                .frameBuffer
                .currentAttachment;

            if (!currentAttachment
                || !currentAttachment.texture
                || xMin > currentAttachment.width
                || yMin > currentAttachment.height
            ) {
                $poolPreObject(object);
                return null;
            }

            // set origin position
            object.basePosition.x = rawMatrix[4];
            object.basePosition.y = rawMatrix[5];

            // check after size
            const baseLayerBounds: BoundsImpl = this._$getLayerBounds(null);
            const layerBounds: BoundsImpl = $boundsMatrix(baseLayerBounds, multiMatrix);

            // filter size
            let layerWidth: number  = $Math.abs(layerBounds.xMax - layerBounds.xMin);
            let layerHeight: number = $Math.abs(layerBounds.yMax - layerBounds.yMin);
            $poolBoundsObject(layerBounds);

            // move size
            let tx: number = multiMatrix[4] - $Math.floor(xMin);
            let ty: number = multiMatrix[5] - $Math.floor(yMin);

            let dx: number = $Math.floor(xMin);
            let dy: number = $Math.floor(yMin);
            let originX: number = xMin;
            let originY: number = yMin;

            if (layerWidth !== width || layerHeight !== height) {

                const layerMatrix: Float32Array = $getFloat32Array6(
                    multiMatrix[0], multiMatrix[1],
                    multiMatrix[2], multiMatrix[3],
                    0, 0
                );

                const moveBounds: BoundsImpl = $boundsMatrix(baseLayerBounds, layerMatrix);

                // pool
                $poolFloat32Array6(layerMatrix);

                tx += -$Math.floor(moveBounds.xMin) - tx;
                ty += -$Math.floor(moveBounds.yMin) - ty;

                dx -= -$Math.floor(moveBounds.xMin) - (multiMatrix[4] - dx);
                dy -= -$Math.floor(moveBounds.yMin) - (multiMatrix[5] - dy);

                originX -= -moveBounds.xMin - (multiMatrix[4] - originX);
                originY -= -moveBounds.yMin - (multiMatrix[5] - originY);

                $poolBoundsObject(moveBounds);
            }

            $poolBoundsObject(baseLayerBounds);

            // set position
            object.position.dx = dx > 0 ? dx : 0;
            object.position.dy = dy > 0 ? dy : 0;

            // resize
            if (layerWidth + originX > currentAttachment.texture.width) {
                layerWidth -= layerWidth - currentAttachment.texture.width + originX;
            }

            if (layerHeight + originY > currentAttachment.texture.height) {
                layerHeight -= layerHeight - currentAttachment.texture.height + originY;
            }

            if (0 > dx) {
                tx += dx;
                layerWidth += originX;
            }

            if (0 > dy) {
                ty += dy;
                layerHeight += originY;
            }

            if (0 >= layerWidth || 0 >= layerHeight // size (-)
                || !layerWidth || !layerHeight // NaN or Infinity
            ) {
                $poolPreObject(object);
                return null;
            }

            // start layer
            context._$startLayer(
                $getBoundsObject(originX, 0, originY, 0)
            );

            // check cache
            object.canApply = this._$canApply(this._$filters);
            const updated: boolean = this._$isFilterUpdated(
                layerWidth, layerHeight, multiMatrix, this._$filters,
                object.canApply, object.basePosition.x, object.basePosition.y
            );

            // current mask cache
            context._$saveCurrentMask();

            if (updated) {
                context._$saveAttachment(
                    $Math.ceil(layerWidth),
                    $Math.ceil(layerHeight),
                    false
                );
            }

            // setup
            object.isFilter    = true;
            object.isUpdated   = updated;
            object.color       = $getFloat32Array8();
            object.baseMatrix  = multiMatrix;
            object.filters     = this._$filters;
            object.blendMode   = blendMode;
            object.layerWidth  = layerWidth;
            object.layerHeight = layerHeight;
            object.matrix      = $getFloat32Array6(
                multiMatrix[0], multiMatrix[1],
                multiMatrix[2], multiMatrix[3],
                tx, ty
            );
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

        // cache
        const cacheKeys: any[] = $getArray(this._$instanceId, "f");

        const cacheStore: CacheStore = $renderPlayer.cacheStore;
        const manager: FrameBufferManager = context.frameBuffer;

        // cache or new texture
        let texture: WebGLTexture | null;
        if (object.isUpdated) {

            texture = manager.getTextureFromCurrentAttachment();

            const cacheTexture: WebGLTexture | void = cacheStore.get(cacheKeys);
            if (cacheTexture) {
                cacheStore.set(cacheKeys, null);
                manager.releaseTexture(cacheTexture);
            }

        } else {

            texture = cacheStore.get(cacheKeys);
            if (!texture) {
                throw new Error("the texture is null.");
            }

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
            const cache: WebGLTexture | void = cacheStore.get(cacheKeys);
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
            }

            // apply filter
            const filters: FilterArrayImpl | null = object.filters;
            if (filters && filters.length) {

                // init
                context._$offsetX = 0;
                context._$offsetY = 0;

                for (let idx: number = 0; idx < filters.length; ++idx) {
                    texture = filters[idx]
                        ._$applyFilter(context, matrix);
                }

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
            const matrix: Float32Array | null = object.baseMatrix;
            if (matrix) {
                texture.matrix = `${matrix[0]}_${matrix[1]}_${matrix[2]}_${matrix[3]}`;
            }

            texture.layerWidth  = object.layerWidth;
            texture.layerHeight = object.layerHeight;
        }

        // cache texture
        cacheStore.set(cacheKeys, texture);
        $poolArray(cacheKeys);

        // set current buffer
        if (object.isUpdated) {
            context._$restoreAttachment();
        }

        // set
        context.reset();
        context.globalAlpha = $clamp(
            color_transform[3] + color_transform[7] / 255, 0, 1
        );
        context.globalCompositeOperation = object.blendMode;

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.drawImage(texture,
            -offsetX + object.position.dx,
            -offsetY + object.position.dy,
            texture.width, texture.height,
            color_transform
        );

        // end blend
        context._$endLayer();

        // reset
        context._$restoreCurrentMask();

        // object pool
        if (object.baseMatrix !== matrix) {
            $poolFloat32Array6(object.baseMatrix as NonNullable<Float32Array>);
        }
        $poolFloat32Array6(object.matrix as NonNullable<Float32Array>);
        $poolPreObject(object);
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
        this._$children.length = 0;
        this._$recodes = null;

        super._$remove();

        $containers.push(this);
    }
}