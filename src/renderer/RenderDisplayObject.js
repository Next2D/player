/**
 * @class
 */
class RenderDisplayObject
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$instanceId = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$loaderInfoId = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$characterId = -1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$clipDepth = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$depth = 0;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isMask = false;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$updated = true;

        /**
         * @type {Float32Array}
         * @private
         */
        this._$matrix = Util.$getFloat32Array6(1, 0, 0, 1, 0, 0);

        /**
         * @type {Float32Array}
         * @private
         */
        this._$colorTransform = Util.$getFloat32Array8(1, 1, 1, 1, 0, 0, 0, 0);

        /**
         * @type {string}
         * @default BlendMode.NORMAL
         * @private
         */
        this._$blendMode = BlendMode.NORMAL;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$filters = null;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$visible = true;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$maskId = -1;

        /**
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$maskMatrix = null;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isMask = false;

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
         * @type {Rectangle|null}
         * @default null
         * @private
         */
        this._$scale9Grid = null;

        /**
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$matrixBase = null;
    }

    /**
     * @param  {Float32Array} matrix
     * @return {boolean}
     * @method
     * @private
     */
    _$shouldClip (matrix)
    {
        if (this instanceof RenderTextField) {
            if (!this._$textWidth || !this._$textHeight) {
                return false;
            }
            return true;
        }

        const bounds = this._$getBounds(matrix);
        const width  = $Math.abs(bounds.xMax - bounds.xMin);
        const height = $Math.abs(bounds.yMax - bounds.yMin);
        Util.$poolBoundsObject(bounds);

        // size 0
        if (!width || !height) {
            return false;
        }
        return true;
    }

    /**
     * @param   {Float32Array}  [matrix=null]
     * @returns {object}
     * @private
     */
    _$getLayerBounds (matrix = null)
    {
        const baseBounds = this._$getBounds(matrix);

        const filters = this._$filters;
        if (!filters) {
            return baseBounds;
        }

        const length = filters.length;
        if (!length) {
            return baseBounds;
        }

        let rect = new Rectangle(
            baseBounds.xMin,
            baseBounds.yMin,
            baseBounds.xMax - baseBounds.xMin,
            baseBounds.yMax - baseBounds.yMin
        );
        Util.$poolBoundsObject(baseBounds);

        for (let idx = 0; idx < length; ++idx) {
            rect = filters[idx]._$generateFilterRect(rect, null, null, true);
        }

        const xMin = rect._$x;
        const xMax = rect._$x + rect._$width;
        const yMin = rect._$y;
        const yMax = rect._$y + rect._$height;

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
        const baseBounds = Util.$getBoundsObject(
            this._$xMin, this._$xMax,
            this._$yMin, this._$yMax
        );
        if (!matrix) {
            return baseBounds;
        }

        let multiMatrix = matrix;

        const rawMatrix = this._$matrix;
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
        Util.$poolBoundsObject(baseBounds);

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }

        return bounds;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {Float32Array|boolean|null}
     * @method
     * @private
     */
    _$startClip (context, matrix)
    {
        let clipMatrix = null;

        // ネストしてない初回のマスクだけ実行
        // ネストしてる場合は初回に作られたbufferを流用
        if (!context._$cacheCurrentBuffer) {

            let multiMatrix = matrix;
            const rawMatrix = this._$matrix;
            if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
                || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
                || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
            ) {
                multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
            }

            const baseBounds = this._$getBounds(null);
            const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
            Util.$poolBoundsObject(baseBounds);

            clipMatrix = context._$startClip(matrix, bounds);
            Util.$poolBoundsObject(bounds);

            if (multiMatrix !== matrix) {
                Util.$poolFloat32Array6(multiMatrix);
            }

            if (!clipMatrix) {
                return false;
            }

        }

        // start clip
        context._$enterClip();

        // mask start
        context._$beginClipDef();

        let containerClip = false;
        if (this instanceof RenderDisplayObjectContainer) {
            containerClip = true;
            context._$updateContainerClipFlag(true);
        }

        this._$clip(context, clipMatrix || matrix);
        this._$updated = false;

        // container clip
        if (containerClip) {

            // update flag
            context._$updateContainerClipFlag(false);

            // execute clip
            context._$drawContainerClip();
        }

        // mask end
        context._$endClipDef();

        return clipMatrix;
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
        this._$updated   = true;
        this._$visible   = object.visible;
        this._$isMask    = object.isMask;
        this._$depth     = object.depth;
        this._$clipDepth = object.clipDepth;

        this._$maskId = object.maskId;
        if (this._$maskId > -1) {
            this._$maskMatrix = object.maskMatrix;
        }

        this._$matrix[0] = "a"  in object ? object.a  : 1;
        this._$matrix[1] = "b"  in object ? object.b  : 0;
        this._$matrix[2] = "c"  in object ? object.c  : 0;
        this._$matrix[3] = "d"  in object ? object.d  : 1;
        this._$matrix[4] = "tx" in object ? object.tx : 0;
        this._$matrix[5] = "ty" in object ? object.ty : 0;

        this._$colorTransform[0] = "f0" in object ? object.f0 : 1;
        this._$colorTransform[1] = "f1" in object ? object.f1 : 1;
        this._$colorTransform[2] = "f2" in object ? object.f2 : 1;
        this._$colorTransform[3] = "f3" in object ? object.f3 : 1;
        this._$colorTransform[4] = "f4" in object ? object.f4 : 0;
        this._$colorTransform[5] = "f5" in object ? object.f5 : 0;
        this._$colorTransform[6] = "f6" in object ? object.f6 : 0;
        this._$colorTransform[7] = "f7" in object ? object.f7 : 0;

        this._$blendMode = object.blendMode || BlendMode.NORMAL;

        this._$filters = null;
        if (object.filters && object.filters.length) {
            this._$filters = Util.$getArray();
            for (let idx = 0; idx < object.filters.length; ++idx) {
                const parameters = object.filters[idx];
                const filterClass = Util.$filters[parameters[0]];

                this._$filters.push(
                    new (filterClass.bind.apply(filterClass, parameters))()
                );
            }
        }

        if (object.grid) {
            this._$scale9Grid = new Rectangle(
                object.grid.x, object.grid.y,
                object.grid.w, object.grid.h
            );
            this._$matrixBase = object.matrixBase;
        }
    }

    /**
     * @param  {array} [filters=null]
     * @return {boolean}
     * @private
     */
    _$canApply (filters = null)
    {
        if (filters) {
            for (let idx = 0; idx < filters.length; ++idx) {
                if (filters[idx]._$canApply()) {
                    return true;
                }
            }
        }
        return false;
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
        const player = Util.$renderPlayer;

        // キャッシュ削除のタイマーをセット
        const cacheStore = player._$cacheStore;
        cacheStore.setRemoveTimer(this._$instanceId);
        if (this._$loaderInfoId > -1 && this._$characterId) {
            cacheStore.setRemoveTimer(
                `${this._$loaderInfoId}@${this._$characterId}`
            );
        }

        player._$instances.delete(this._$instanceId);

        // reset
        this._$instanceId     = -1;
        this._$loaderInfoId   = -1;
        this._$characterId    = -1;
        this._$updated        = true;
        this._$blendMode      = BlendMode.NORMAL;
        this._$filters        = null;
        this._$visible        = true;
        this._$maskId         = -1;
        this._$isMask         = false;
        this._$depth          = 0;
        this._$clipDepth      = 0;
        this._$scale9Grid     = null;
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$isUpdated ()
    {
        return this._$updated;
    }

    /**
     * @param  {number}       width
     * @param  {number}       height
     * @param  {Float32Array} matrix
     * @param  {array}        [filters=null]
     * @param  {boolean}      [can_apply=false]
     * @param  {number}       [position_x=0]
     * @param  {number}       [position_y=0]
     * @return {boolean}
     * @private
     */
    _$isFilterUpdated (
        width, height, matrix,
        filters = null, can_apply = false,
        position_x = 0, position_y = 0
    ) {

        // cache flag
        if (this._$isUpdated()) {
            return true;
        }

        // check filter data
        if (can_apply) {

            for (let idx = 0; idx < filters.length; ++idx) {

                if (!filters[idx]._$isUpdated()) {
                    continue;
                }

                return true;
            }

        }

        // check status
        const player = Util.$renderPlayer;
        const cache = player._$cacheStore.get([this._$instanceId, "f"]);
        switch (true) {

            case cache === null:
            case cache.filterState !== can_apply:
            case cache.layerWidth  !== $Math.ceil(width):
            case cache.layerHeight !== $Math.ceil(height):
            case cache.matrix !== matrix[0] + "_"
                + matrix[1] + "_"
                + matrix[2] + "_"
                + matrix[3] + "_"
                + position_x + "_"
                + position_y:
                return true;

            default:
                break;

        }

        return false;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {array} filters
     * @param  {WebGLTexture} target_texture
     * @param  {Float32Array} matrix
     * @param  {number} width
     * @param  {number} height
     * @return {WebGLTexture}
     * @private
     */
    _$applyFilter (
        context, filters, target_texture,
        matrix, width, height
    ) {

        const xScale = +$Math.sqrt(
            matrix[0] * matrix[0]
            + matrix[1] * matrix[1]
        );
        const yScale = +$Math.sqrt(
            matrix[2] * matrix[2]
            + matrix[3] * matrix[3]
        );

        const radianX = $Math.atan2(matrix[1], matrix[0]);
        const radianY = $Math.atan2(0 - matrix[2], matrix[3]);

        const parentMatrix = Util.$getFloat32Array6(
            $Math.cos(radianX), $Math.sin(radianX),
            0 - $Math.sin(radianY), $Math.cos(radianY),
            width / 2, height / 2
        );

        const baseMatrix = Util.$getFloat32Array6(
            1, 0, 0, 1,
            0 - target_texture.width / 2,
            0 - target_texture.height / 2
        );

        const multiMatrix = Util.$multiplicationMatrix(
            parentMatrix, baseMatrix
        );
        Util.$poolFloat32Array6(parentMatrix);
        Util.$poolFloat32Array6(baseMatrix);

        const manager = context._$frameBufferManager;
        const currentAttachment = manager.currentAttachment;
        const attachment = manager.createCacheAttachment(width, height);
        context._$bind(attachment);

        Util.$resetContext(context);
        context.setTransform(
            multiMatrix[0], multiMatrix[1],
            multiMatrix[2], multiMatrix[3],
            multiMatrix[4], multiMatrix[5]
        );
        Util.$poolFloat32Array6(multiMatrix);

        context.drawImage(target_texture,
            0, 0, target_texture.width, target_texture.height
        );

        // init
        context._$offsetX = 0;
        context._$offsetY = 0;

        const filterMatrix = Util.$getFloat32Array6(
            xScale, 0, 0, yScale, 0, 0
        );

        let texture = null;
        for (let idx = 0; idx < filters.length; ++idx) {
            texture = filters[idx]._$applyFilter(context, filterMatrix);
        }

        Util.$poolFloat32Array6(filterMatrix);

        let offsetX = context._$offsetX;
        let offsetY = context._$offsetY;

        // reset
        context._$offsetX = 0;
        context._$offsetY = 0;

        // set offset
        texture._$offsetX = offsetX;
        texture._$offsetY = offsetY;

        // cache texture
        texture.matrix =
            matrix[0] + "_" + matrix[1] + "_"
            + matrix[2] + "_" + matrix[3];

        texture.filterState = true;
        texture.layerWidth  = width;
        texture.layerHeight = height;

        context._$bind(currentAttachment);
        manager.releaseAttachment(attachment, false);

        return texture;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {WebGLTexture}         target_texture
     * @param  {Float32Array}         matrix
     * @param  {array}                filters
     * @param  {number}               width
     * @param  {number}               height
     * @return {WebGLTexture}
     * @method
     * @private
     */
    _$drawFilter (
        context, target_texture, matrix,
        filters, width, height
    ) {

        const cacheStore = Util.$renderPlayer._$cacheStore;

        const cacheKeys = [this._$instanceId, "f"];
        let cache = cacheStore.get(cacheKeys);

        const updated = this._$isFilterUpdated(
            width, height, matrix, filters, true
        );

        let texture;
        if (!cache || updated) {

            // cache clear
            if (cache) {

                cacheStore.set(cacheKeys, null);
                cache.layerWidth     = 0;
                cache.layerHeight    = 0;
                cache._$offsetX      = 0;
                cache._$offsetY      = 0;
                cache.matrix         = null;
                cache.colorTransform = null;

                context
                    .frameBuffer
                    .releaseTexture(cache);

                cache = null;
            }

            texture = this._$applyFilter(
                context, filters, target_texture,
                matrix, width, height
            );

            cacheStore.set(cacheKeys, texture);
        }

        if (cache) {
            texture = cache;
        }

        return texture;
    }
}