/**
 * @class
 */
class RenderShape extends RenderGraphics
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {Rectangle|null}
         * @default null
         * @private
         */
        this._$scale9Grid = null;
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

        // size
        const baseBounds = this._$getBounds();

        const bounds = Util.$boundsMatrix(baseBounds, matrix);
        let width    = $Math.ceil($Math.abs(bounds.xMax - bounds.xMin));
        let height   = $Math.ceil($Math.abs(bounds.yMax - bounds.yMin));
        Util.$poolBoundsObject(baseBounds);
        Util.$poolBoundsObject(bounds);

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

        context.setTransform(
            multiMatrix[0], multiMatrix[1], multiMatrix[2],
            multiMatrix[3], multiMatrix[4], multiMatrix[5]
        );

        this._$runCommand(context, this._$recodes, null, true);

        context.clip();

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

        const alpha = Util.$clamp(multiColor[3] + multiColor[7] / 255, 0, 1, 0);
        if (!alpha) {
            if (multiColor !== color_transform) {
                Util.$poolFloat32Array8(multiColor);
            }
            return ;
        }

        const filters   = this._$filters;
        const blendMode = this._$blendMode;

        let multiMatrix = matrix;
        const rawMatrix = this._$matrix;
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        // set grid data
        let hasGrid = this._$scale9Grid !== null;

        // 9スライスを有効にしたオブジェクトが回転・傾斜成分を含む場合は
        // 9スライスは無効になる
        if (hasGrid) {
            hasGrid = hasGrid
                && $Math.abs(rawMatrix[1]) < 0.001
                && $Math.abs(rawMatrix[2]) < 0.0001;
        }

        // size
        const baseBounds = Util.$getBoundsObject(
            this._$xMin, this._$xMax,
            this._$yMin, this._$yMax
        );

        const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
        const xMax   = bounds.xMax;
        const xMin   = bounds.xMin;
        const yMax   = bounds.yMax;
        const yMin   = bounds.yMin;
        Util.$poolBoundsObject(bounds);

        const width  = $Math.ceil($Math.abs(xMax - xMin));
        const height = $Math.ceil($Math.abs(yMax - yMin));
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

        // cache current buffer
        const manager = context._$frameBufferManager;
        const currentAttachment = manager.currentAttachment;
        if (xMin > currentAttachment.width || yMin > currentAttachment.height) {
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

        // get cache
        const keys = Util.$getArray(xScale, yScale);

        let uniqueId = this._$instanceId;
        if (!hasGrid
            && this._$loaderInfoId > -1
            && this._$characterId > -1
        ) {
            uniqueId = `${this._$loaderInfoId}@${this._$characterId}`;
        }

        const cacheStore = Util.$cacheStore();
        const cacheKeys  = cacheStore.generateKeys(
            uniqueId, keys, multiColor
        );

        Util.$poolArray(keys);

        let texture = cacheStore.get(cacheKeys);
        if (!texture) {

            // resize
            let width  = $Math.ceil($Math.abs(baseBounds.xMax - baseBounds.xMin) * xScale);
            let height = $Math.ceil($Math.abs(baseBounds.yMax - baseBounds.yMin) * yScale);
            const textureScale = context._$getTextureScale(width, height);
            if (textureScale < 1) {
                width  *= textureScale;
                height *= textureScale;
            }

            // create cache buffer
            const buffer = manager
                .createCacheAttachment(width, height, true);
            context._$bind(buffer);

            // reset
            Util.$resetContext(context);
            context.setTransform(
                xScale, 0, 0, yScale,
                -baseBounds.xMin * xScale,
                -baseBounds.yMin * yScale
            );

            if (hasGrid) {

                const player = Util.$renderPlayer;
                const mScale = player._$matrix[0];

                const baseMatrix = Util.$getFloat32Array6(
                    mScale, 0, 0, mScale, 0, 0
                );

                const pMatrix = Util.$multiplicationMatrix(
                    baseMatrix, rawMatrix
                );

                Util.$poolFloat32Array6(baseMatrix);

                const aMatrixBase = displayObject
                    ._$parent
                    ._$transform
                    .concatenatedMatrix
                    ._$matrix;
                Util.$poolFloat32Array6(aMatrixBase);

                const aMatrix = Util.$getFloat32Array6(
                    aMatrixBase[0], aMatrixBase[1], aMatrixBase[2], aMatrixBase[3],
                    aMatrixBase[4] * mScale - xMin,
                    aMatrixBase[5] * mScale - yMin
                );

                const apMatrix = Util.$multiplicationMatrix(
                    aMatrix, pMatrix
                );
                const aOffsetX = apMatrix[4] - (multiMatrix[4] - xMin);
                const aOffsetY = apMatrix[5] - (multiMatrix[5] - yMin);
                Util.$poolFloat32Array6(apMatrix);

                const parentBounds = Util.$boundsMatrix(baseBounds, pMatrix);
                const parentXMax   = +parentBounds.xMax;
                const parentXMin   = +parentBounds.xMin;
                const parentYMax   = +parentBounds.yMax;
                const parentYMin   = +parentBounds.yMin;
                const parentWidth  = $Math.ceil($Math.abs(parentXMax - parentXMin));
                const parentHeight = $Math.ceil($Math.abs(parentYMax - parentYMin));

                Util.$poolBoundsObject(parentBounds);

                context.grid.enable(
                    parentXMin, parentYMin, parentWidth, parentHeight,
                    baseBounds, this._$scale9Grid, mScale,
                    pMatrix[0], pMatrix[1], pMatrix[2], pMatrix[3], pMatrix[4], pMatrix[5],
                    aMatrix[0], aMatrix[1], aMatrix[2], aMatrix[3], aMatrix[4] - aOffsetX, aMatrix[5] - aOffsetY
                );

                Util.$poolFloat32Array6(pMatrix);
                Util.$poolFloat32Array6(aMatrix);
            }

            // plain alpha
            multiColor[3] = 1;
            this._$runCommand(context, this._$recodes, multiColor, false);

            if (hasGrid) {
                context.grid.disable();
            }

            texture = manager.getTextureFromCurrentAttachment();

            // set cache
            if (Util.$useCache) {
                cacheStore.set(cacheKeys, texture);
            }

            // release buffer
            manager.releaseAttachment(buffer, false);

            // end draw and reset current buffer
            context._$bind(currentAttachment);
        }

        let drawFilter = false;
        let offsetX = 0;
        let offsetY = 0;
        if (filters && filters.length
            && this._$canApply(filters)
        ) {

            drawFilter = true;

            texture = this._$drawFilter(
                context, texture, multiMatrix,
                filters, width, height
            );

            offsetX = texture._$offsetX;
            offsetY = texture._$offsetY;
        }

        const radianX = drawFilter ? 0 : $Math.atan2(multiMatrix[1], multiMatrix[0]);
        const radianY = drawFilter ? 0 : $Math.atan2(-multiMatrix[2], multiMatrix[3]);
        if (radianX || radianY) {

            const tx = baseBounds.xMin * xScale;
            const ty = baseBounds.yMin * yScale;

            const cosX = $Math.cos(radianX);
            const sinX = $Math.sin(radianX);
            const cosY = $Math.cos(radianY);
            const sinY = $Math.sin(radianY);

            context.setTransform(
                cosX, sinX, -sinY, cosY,
                tx * cosX - ty * sinY + multiMatrix[4],
                tx * sinX + ty * cosY + multiMatrix[5]
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
            0, 0, texture.width, texture.height, multiColor
        );

        // pool
        Util.$poolArray(cacheKeys);
        Util.$poolBoundsObject(baseBounds);

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }

        if (multiColor !== color_transform) {
            Util.$poolFloat32Array8(multiColor);
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
        this._$xMin    = 0;
        this._$yMin    = 0;
        this._$xMax    = 0;
        this._$yMax    = 0;
        this._$recodes = null;

        super._$remove();

        Util.$shapes.push(this);
    }
}