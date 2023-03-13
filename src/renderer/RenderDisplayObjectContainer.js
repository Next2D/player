/**
 * @class
 */
class RenderDisplayObjectContainer extends RenderGraphics
{
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
        this._$children = [];
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
        let multiMatrix = matrix;

        const rawMatrix = this._$matrix;
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        if (this._$recodes && this._$canDraw) {
            super._$clip(context, multiMatrix);
        }

        const instances = Util.$renderPlayer._$instances;
        const children  = this._$children;
        const length    = children.length;
        for (let idx = 0; idx < length; ++idx) {

            const id = children[idx];
            if (instances.has(id)) {
                continue;
            }

            const instance = instances.get(id);

            // mask instance
            if (instance._$isMask) {
                continue;
            }

            instance._$clip(context, multiMatrix);
            instance._$updated = false;

        }

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
        // not draw
        if (!this._$visible) {
            return ;
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

        // not draw
        const alpha = Util.$clamp(multiColor[3] + multiColor[7] / 255, 0, 1, 0);
        if (!alpha) {
            return ;
        }

        // not draw
        const children = this._$children;
        const length = children.length;
        if (!length && (!this._$recodes || !this._$canDraw)) {
            return ;
        }

        // pre data
        const preData = this._$preDraw(context, matrix);
        if (!preData) {
            return ;
        }

        // use cache
        if (preData.isFilter && !preData.isUpdated) {
            this._$postDraw(context, matrix, multiColor, preData);
            return ;
        }

        let preMatrix = preData.matrix;
        const preColorTransform = preData.isFilter ? preData.color : multiColor;

        // if graphics draw
        if (this._$recodes && this._$canDraw && this._$maxAlpha > 0) {
            super._$draw(context, preMatrix, preColorTransform);
        }

        // init clip params
        let shouldClip        = true;
        let clipDepth         = null;
        const clipMatrix      = Util.$getArray();
        const instanceMatrix  = Util.$getArray();
        const clipStack       = Util.$getArray();
        const shouldClips     = Util.$getArray();

        // draw children
        const instances = Util.$renderPlayer._$instances;
        const isLayer   = context._$isLayer;
        for (let idx = 0; idx < length; ++idx) {

            const id = children[idx];
            if (!instances.has(id)) {
                continue;
            }

            const instance = instances.get(id);

            // mask instance
            if (instance._$isMask) {
                continue;
            }

            // not layer mode
            const blendMode = instance._$blendMode;
            if ((blendMode === BlendMode.ALPHA || blendMode === BlendMode.ERASE)
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
                        Util.$poolFloat32Array6(preMatrix);
                        preMatrix = clipMatrix.pop();
                    }

                }

                // clear
                clipDepth  = clipStack.length ? clipStack.pop() : null;
                shouldClip = shouldClips.pop();
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

                    const adjMatrix = instance._$startClip(context, preMatrix);
                    if (adjMatrix === false) { // fixed
                        shouldClip = false;
                        continue;
                    }

                    if (adjMatrix) {
                        clipMatrix.push(preMatrix);
                        preMatrix = adjMatrix;
                    }

                }

                continue;
            }

            // mask start
            let maskInstance = null;
            if (instance._$maskId > -1) {
                maskInstance = instances.get(instance._$maskId);
            }

            if (maskInstance) {

                maskInstance._$updated = false;

                const mScale = Util.$renderPlayer._$matrix[0];
                const playerMatrix = Util.$getFloat32Array6(
                    mScale, 0, 0, mScale, 0, 0
                );
                const maskMatrix = Util.$multiplicationMatrix(
                    playerMatrix, instance._$maskMatrix
                );
                Util.$poolFloat32Array6(playerMatrix);

                if (context._$isLayer) {
                    const currentPosition = context._$getCurrentPosition();
                    maskMatrix[4] -= currentPosition.xMin;
                    maskMatrix[5] -= currentPosition.yMin;
                }

                if (context._$cacheCurrentBuffer) {
                    maskMatrix[4] -= context._$cacheCurrentBounds.x;
                    maskMatrix[5] -= context._$cacheCurrentBounds.y;
                }

                if (!maskInstance._$shouldClip(maskMatrix)) {
                    continue;
                }

                let adjMatrix = maskInstance._$startClip(context, maskMatrix);

                context.save();

                if (adjMatrix === false) { // fixed
                    context.restore();
                    continue;
                }

                if (adjMatrix) {

                    instanceMatrix.push(preMatrix);

                    if (this !== maskInstance._$parent) {
                        const maskTargetParentMatrix = this._$matrix;
                        adjMatrix[0] = $Math.abs(preMatrix[0]) * $Math.sign(maskTargetParentMatrix[0]);
                        adjMatrix[1] = $Math.abs(preMatrix[1]) * $Math.sign(maskTargetParentMatrix[1]);
                        adjMatrix[2] = $Math.abs(preMatrix[2]) * $Math.sign(maskTargetParentMatrix[2]);
                        adjMatrix[3] = $Math.abs(preMatrix[3]) * $Math.sign(maskTargetParentMatrix[3]);
                        adjMatrix[4] = preMatrix[4] - context._$cacheCurrentBounds.x;
                        adjMatrix[5] = preMatrix[5] - context._$cacheCurrentBounds.y;
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
                    Util.$poolFloat32Array6(preMatrix);
                    preMatrix = instanceMatrix.pop();
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
        Util.$poolArray(clipMatrix);
        Util.$poolArray(instanceMatrix);
        Util.$poolArray(clipStack);
        Util.$poolArray(shouldClips);

        // filter and blend
        if (preData.isFilter) {
            return this._$postDraw(context, matrix, multiColor, preData);
        }

        Util.$poolFloat32Array6(preMatrix);
        Util.$poolPreObject(preData);

        if (multiColor !== color_transform) {
            Util.$poolFloat32Array8(multiColor);
        }
    }

    /**
     * @param  {array} [matrix=null]
     * @return {object}
     * @private
     */
    _$getLayerBounds (matrix = null)
    {
        let multiMatrix = Util.$MATRIX_ARRAY_IDENTITY;

        const rawMatrix = this._$matrix;
        if (matrix) {

            multiMatrix = matrix;

            if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
                || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
                || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
            ) {
                multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
            }
        }

        const isGraphics = this._$recodes;
        const children   = this._$children;
        const length     = children.length;

        // size zero
        if (!length && !isGraphics) {
            const bounds = Util.$getBoundsObject(
                multiMatrix[4], 0 - multiMatrix[4],
                multiMatrix[5], 0 - multiMatrix[5]
            );
            if (matrix && multiMatrix !== matrix) {
                Util.$poolFloat32Array6(multiMatrix);
            }
            return bounds;
        }

        // data init
        const no   = $Number.MAX_VALUE;
        let xMin = no;
        let xMax = 0 - no;
        let yMin = no;
        let yMax = 0 - no;

        if (isGraphics) {
            const baseBounds = Util.$getBoundsObject(
                this._$xMin, this._$xMax,
                this._$yMin, this._$yMax
            );

            const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
            xMin   = bounds.xMin;
            xMax   = bounds.xMax;
            yMin   = bounds.yMin;
            yMax   = bounds.yMax;
            Util.$poolBoundsObject(bounds);
            Util.$poolBoundsObject(baseBounds);
        }

        const instances = Util.$renderPlayer._$instances;
        for (let idx = 0; idx < length; ++idx) {

            const id = children[idx];
            if (!instances.has(id)) {
                continue;
            }

            const bounds = instances.get(id)._$getLayerBounds(multiMatrix);

            xMin = $Math.min(xMin, bounds.xMin);
            xMax = $Math.max(xMax, bounds.xMax);
            yMin = $Math.min(yMin, bounds.yMin);
            yMax = $Math.max(yMax, bounds.yMax);

            Util.$poolBoundsObject(bounds);

        }

        if (matrix && multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }

        // end
        if (!matrix) {
            return Util.$getBoundsObject(xMin, xMax, yMin, yMax);
        }

        const filters = this._$filters;
        if (!filters) {
            return Util.$getBoundsObject(xMin, xMax, yMin, yMax);
        }

        let rect = new Rectangle(xMin, yMin, xMax - xMin, yMax - yMin);
        for (let idx = 0; idx < filters.length; ++idx) {
            rect = filters[idx]._$generateFilterRect(rect, null, null, true);
        }

        xMin = rect._$x;
        xMax = rect._$x + rect._$width;
        yMin = rect._$y;
        yMax = rect._$y + rect._$height;

        return Util.$getBoundsObject(xMin, xMax, yMin, yMax);
    }

    /**
     * @param   {Float32Array} [matrix=null]
     * @returns {object}
     * @method
     * @private
     */
    _$getBounds (matrix = null)
    {
        let multiMatrix = Util.$MATRIX_ARRAY_IDENTITY;
        if (matrix) {

            multiMatrix = matrix;

            const rawMatrix = this._$matrix;
            if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
                || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
                || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
            ) {
                multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
            }
        }

        const isGraphics = this._$recodes;
        const children   = this._$children;
        const length     = children.length;

        // size zero
        if (!length && !isGraphics) {
            const bounds = Util.$getBoundsObject(
                multiMatrix[4], 0 - multiMatrix[4],
                multiMatrix[5], 0 - multiMatrix[5]
            );
            if (matrix && multiMatrix !== matrix) {
                Util.$poolFloat32Array6(multiMatrix);
            }
            return bounds;
        }

        // data init
        const no = $Number.MAX_VALUE;
        let xMin = no;
        let xMax = 0 - no;
        let yMin = no;
        let yMax = 0 - no;

        if (isGraphics) {
            const baseBounds = Util.$getBoundsObject(
                this._$xMin, this._$xMax,
                this._$yMin, this._$yMax
            );

            const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
            xMin   = bounds.xMin;
            xMax   = bounds.xMax;
            yMin   = bounds.yMin;
            yMax   = bounds.yMax;
            Util.$poolBoundsObject(bounds);
            Util.$poolBoundsObject(baseBounds);
        }

        const instances = Util.$renderPlayer._$instances;
        for (let idx = 0; idx < length; ++idx) {

            const id = children[idx];
            if (!instances.has(id)) {
                continue;
            }

            const bounds = instances.get(id)._$getBounds(multiMatrix);

            xMin = $Math.min(xMin, bounds.xMin);
            xMax = $Math.max(xMax, bounds.xMax);
            yMin = $Math.min(yMin, bounds.yMin);
            yMax = $Math.max(yMax, bounds.yMax);

            Util.$poolBoundsObject(bounds);

        }

        if (matrix && multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }

        // end
        return Util.$getBoundsObject(xMin, xMax, yMin, yMax);
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {object}
     * @private
     */
    _$preDraw (context, matrix)
    {
        const originMatrix = this._$matrix;
        const multiMatrix  = Util.$multiplicationMatrix(matrix, originMatrix);

        // size zero
        if (!multiMatrix[0] && !multiMatrix[1]
            || !multiMatrix[2] && !multiMatrix[3]
        ) {
            return false;
        }

        // return object
        const object = Util.$getPreObject();

        // setup
        object.matrix = multiMatrix;

        // check
        const filters   = this._$filters;
        const blendMode = this._$blendMode;
        if (blendMode !== BlendMode.NORMAL || filters && filters.length > 0) {

            // check size
            const baseBounds = this._$getBounds(null);
            const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
            const xMax   = +bounds.xMax;
            const xMin   = +bounds.xMin;
            const yMax   = +bounds.yMax;
            const yMin   = +bounds.yMin;

            // pool
            Util.$poolBoundsObject(baseBounds);
            Util.$poolBoundsObject(bounds);

            const width  = $Math.abs(xMax - xMin);
            const height = $Math.abs(yMax - yMin);
            if (0 >= width || 0 >= height) {
                return false;
            }

            if (0 > xMin + width || 0 > yMin + height) {
                return false;
            }

            const currentAttachment = context
                .frameBuffer
                .currentAttachment;

            if (xMin > currentAttachment.width
                || yMin > currentAttachment.height
            ) {
                return false;
            }

            // set origin position
            object.basePosition.x = originMatrix[4];
            object.basePosition.y = originMatrix[5];

            // check after size
            let baseLayerBounds = this._$getLayerBounds(null);
            const layerBounds = Util.$boundsMatrix(baseLayerBounds, multiMatrix);

            // filter size
            let layerWidth  = $Math.abs(layerBounds.xMax - layerBounds.xMin);
            let layerHeight = $Math.abs(layerBounds.yMax - layerBounds.yMin);
            Util.$poolBoundsObject(layerBounds);

            if (layerWidth === width && layerHeight === height) {
                Util.$poolBoundsObject(baseLayerBounds);
                baseLayerBounds = null;
            }

            // move size
            let tx = multiMatrix[4] - $Math.floor(xMin);
            let ty = multiMatrix[5] - $Math.floor(yMin);

            let moveBounds = null;
            if (baseLayerBounds) {

                const layerMatrix = Util.$getFloat32Array6(
                    multiMatrix[0], multiMatrix[1],
                    multiMatrix[2], multiMatrix[3],
                    0, 0
                );
                moveBounds = Util.$boundsMatrix(baseLayerBounds, layerMatrix);

                // pool
                Util.$poolBoundsObject(baseLayerBounds);
                Util.$poolFloat32Array6(layerMatrix);

                tx += 0 - $Math.floor(moveBounds.xMin) - tx;
                ty += 0 - $Math.floor(moveBounds.yMin) - ty;
            }

            let dx = $Math.floor(xMin);
            let dy = $Math.floor(yMin);
            let originX = xMin;
            let originY = yMin;

            if (moveBounds) {
                dx -= 0 - $Math.floor(moveBounds.xMin) - (multiMatrix[4] - dx);
                dy -= 0 - $Math.floor(moveBounds.yMin) - (multiMatrix[5] - dy);

                originX -= 0 - moveBounds.xMin - (multiMatrix[4] - originX);
                originY -= 0 - moveBounds.yMin - (multiMatrix[5] - originY);

                Util.$poolBoundsObject(moveBounds);
            }

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
                Util.$poolPreObject(object);
                return false;
            }

            // start layer
            context._$startLayer(
                Util.$getBoundsObject(originX, 0, originY, 0)
            );

            // check cache
            object.canApply = this._$canApply(filters);
            let updated = this._$isFilterUpdated(
                layerWidth, layerHeight, multiMatrix, filters,
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
            object.color       = Util.$getFloat32Array8();
            object.baseMatrix  = multiMatrix;
            object.filters     = filters;
            object.blendMode   = blendMode;
            object.layerWidth  = layerWidth;
            object.layerHeight = layerHeight;
            object.matrix      = Util.$getFloat32Array6(
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
    _$postDraw (context, matrix, color_transform, object)
    {
        // cache
        const cacheKeys = Util.$getArray(this._$instanceId, "f");

        const cacheStore = Util.$cacheStore();
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

                for (let idx = 0; idx < length; ++idx) {
                    texture = object
                        .filters[idx]
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
            const mat = object.baseMatrix;
            texture.matrix = `${mat[0]}_${mat[1]}_${mat[2]}_${mat[3]}`;

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
            0 - offsetX + object.position.dx,
            0 - offsetY + object.position.dy,
            texture.width, texture.height,
            color_transform
        );

        // end blend
        context._$endLayer();

        // reset
        context._$restoreCurrentMask();

        // object pool
        Util.$poolFloat32Array8(object.color);
        Util.$poolFloat32Array6(object.matrix);
        Util.$poolFloat32Array6(object.baseMatrix);
        Util.$poolPreObject(object);
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
        // reset
        this._$children.length = 0;
        this._$recodes = null;

        super._$remove();

        Util.$containers.push(this);
    }
}