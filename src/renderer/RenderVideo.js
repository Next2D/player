/**
 * @class
 */
class RenderVideo extends RenderDisplayObject
{
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
         * @type {boolean}
         * @default true
         * @private
         */
        this._$smoothing = true;

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
        let width  = this._$xMax;
        let height = this._$yMax;
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
            multiMatrix[0], multiMatrix[1], multiMatrix[2],
            multiMatrix[3], multiMatrix[4], multiMatrix[5]
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
        if (!this._$visible || !this._$imageBitmap) {
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

        let multiMatrix = matrix;
        const rawMatrix = this._$matrix;
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        // default bounds
        const baseBounds = this._$getBounds();
        const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
        const xMax   = +bounds.xMax;
        const xMin   = +bounds.xMin;
        const yMax   = +bounds.yMax;
        const yMin   = +bounds.yMin;
        Util.$poolBoundsObject(bounds);
        Util.$poolBoundsObject(baseBounds);

        let width  = $Math.ceil($Math.abs(xMax - xMin));
        let height = $Math.ceil($Math.abs(yMax - yMin));
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
        const manager = context._$frameBufferManager;
        const currentAttachment = manager.currentAttachment;
        if (xMin > currentAttachment.width
            || yMin > currentAttachment.height
        ) {
            return;
        }

        const filters = this._$filters || this.filters;
        if (0 > xMin + width || 0 > yMin + height) {

            if (filters && filters.length && this._$canApply(filters)) {

                const xScale = +$Math.sqrt(
                    multiMatrix[0] * multiMatrix[0]
                    + multiMatrix[1] * multiMatrix[1]
                );

                const yScale = +$Math.sqrt(
                    multiMatrix[2] * multiMatrix[2]
                    + multiMatrix[3] * multiMatrix[3]
                );

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

        const blendMode = this._$blendMode || this.blendMode;

        let texture = manager.createTextureFromImage(
            this._$imageBitmap, this._$smoothing
        );

        if (filters && filters.length
            && this._$canApply(filters)
        ) {

            const xScale = +$Math.sqrt(
                multiMatrix[0] * multiMatrix[0]
                + multiMatrix[1] * multiMatrix[1]
            );
            const yScale = +$Math.sqrt(
                multiMatrix[2] * multiMatrix[2]
                + multiMatrix[3] * multiMatrix[3]
            );

            if (xScale !== 1 || yScale !== 1) {
                const currentAttachment = manager.currentAttachment;

                // create cache buffer
                const buffer = manager
                    .createCacheAttachment(width, height, false);
                context._$bind(buffer);

                Util.$resetContext(context);

                const parentMatrix = Util.$getFloat32Array6(
                    xScale, 0, 0, yScale,
                    width / 2, height / 2
                );

                const baseMatrix = Util.$getFloat32Array6(
                    1, 0, 0, 1,
                    0 - texture.width / 2,
                    0 - texture.height / 2
                );

                const scaleMatrix = Util.$multiplicationMatrix(
                    parentMatrix, baseMatrix
                );

                Util.$poolFloat32Array6(parentMatrix);
                Util.$poolFloat32Array6(baseMatrix);

                context.setTransform(
                    scaleMatrix[0], scaleMatrix[1],
                    scaleMatrix[2], scaleMatrix[3],
                    scaleMatrix[4], scaleMatrix[5]
                );
                context.drawImage(texture,
                    0, 0, texture.width, texture.height
                );

                manager.releaseTexture(texture);
                Util.$poolFloat32Array6(scaleMatrix);

                texture = manager.getTextureFromCurrentAttachment();

                // release buffer
                manager.releaseAttachment(buffer, false);

                // end draw and reset current buffer
                context._$bind(currentAttachment);
            }

            // draw filter
            texture = this._$drawFilter(
                context, texture, multiMatrix,
                filters, width, height
            );

            // reset
            Util.$resetContext(context);

            // draw
            context._$globalAlpha = alpha;
            context._$imageSmoothingEnabled = this._$smoothing;
            context._$globalCompositeOperation = blendMode;

            // size
            const baseBounds = this._$getBounds();
            const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
            context.setTransform(1, 0, 0, 1,
                bounds.xMin - texture._$offsetX,
                bounds.yMin - texture._$offsetY
            );

            context.drawImage(texture,
                0, 0, texture.width, texture.height,
                color_transform
            );

            // pool
            Util.$poolBoundsObject(bounds);
            Util.$poolBoundsObject(baseBounds);

        } else {

            // reset
            Util.$resetContext(context);

            // draw
            context._$globalAlpha = alpha;
            context._$imageSmoothingEnabled = this._$smoothing;
            context._$globalCompositeOperation = blendMode;

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
        this._$xMin        = 0;
        this._$yMin        = 0;
        this._$xMax        = 0;
        this._$yMax        = 0;
        this._$imageBitmap = null;
        this.smoothing     = true;

        super._$remove();

        Util.$renderPlayer._$videos--;
        Util.$videos.push(this);
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
        this._$xMin        = object.xMin;
        this._$yMin        = object.yMin;
        this._$xMax        = object.xMax;
        this._$yMax        = object.yMax;
        this._$imageBitmap = object.imageBitmap;
        this._$smoothing   = object.smoothing;
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
        this._$updateProperty(object);
    }
}