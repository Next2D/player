/**
 * @class
 */
class Renderer
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {Worker}
         * @default {null}
         * @private
         */
        this._$worker = null;

        /**
         * @type {number}
         * @default 4
         * @private
         */
        this._$samples = 4;

        /**
         * @type {HTMLCanvasElement}
         * @default null
         * @private
         */
        this._$canvas = null;

        /**
         * @type {CanvasToWebGLContext}
         * @default null
         * @private
         */
        this._$context = null;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$buffer = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$width = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$height = 0;

        /**
         * @type {string|number}
         * @default null
         * @private
         */
        this._$backgroundColor = null;

        /**
         * @type {object}
         * @private
         */
        this._$currentAttachment = {
            "width": 0,
            "height": 0,
            "texture": {
                "width": 0,
                "height": 0
            },
            "clipLevel": 0
        };

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isLayer = false;

        /**
         * @type {array}
         * @private
         */
        this._$layerState = [];

        /**
         * @type {array}
         * @private
         */
        this._$positions = [];

        /**
         * @type {number}
         * @default 8192
         * @private
         */
        this._$maxTextureSize = 8192;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$cacheCurrentBuffer = false;

        /**
         * @type {object}
         * @private
         */
        this._$cacheCurrentBounds = { "x": 0, "y": 0, "w": 0, "h": 0 };

        /**
         * @type {array}
         * @private
         */
        this._$maskState = [];

        /**
         * @type {array}
         * @private
         */
        this._$maskBounds = [];
    }

    /**
     * @description アンチエイリアスのサンプル数
     *              Number of anti-aliasing samples
     *
     * @member {number}
     * @public
     */
    get samples ()
    {
        return this._$samples;
    }
    set samples (samples)
    {
        this._$samples = samples;
    }

    /**
     * @description アタッチしている描画オブジェクトを返す
     *              Returns the drawing object to which it is attached
     *
     * @member {object}
     * @public
     */
    get buffer ()
    {
        return this._$buffer;
    }
    set buffer (buffer)
    {
        this._$buffer = buffer;
    }

    /**
     * @description 描画対象のCanvasオブジェクトを返す
     *              Returns the Canvas object to be drawn
     *
     * @member {number}
     * @readonly
     * @public
     */
    get canvas ()
    {
        return this._$canvas;
    }

    /**
     * @description レンダリングコンテキストのオブジェクトを返す
     *              Returns an object in the rendering context
     *
     * @member {CanvasToWebGLContext}
     * @readonly
     * @public
     */
    get context ()
    {
        return this._$context;
    }

    /**
     * @description 描画するcanvasを生成してWebGLを起動
     *              Generate a canvas to draw in and start WebGL
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        // main canvas
        const canvas  = Util.$document.createElement("canvas");
        this._$canvas = canvas;
        canvas.width  = 1;
        canvas.height = 1;

        // TODO
        // Util.$renderURL = null;
        if (Util.$renderURL) {

            this._$worker = new Worker(Util.$renderURL);
            this._$worker.onmessage = this.renderHandler.bind(this);

            const offscreenCanvas = canvas.transferControlToOffscreen();

            this._$worker.postMessage({
                "canvas": offscreenCanvas,
                "samples": this.samples,
                "command": "initialize"
            }, [offscreenCanvas]);

        } else {

            // create gl context
            const gl = canvas.getContext("webgl2", {
                "stencil": true,
                "premultipliedAlpha": true,
                "antialias": false,
                "depth": false,
                "preserveDrawingBuffer": true
            });

            if (gl) {

                this._$context = new CanvasToWebGLContext(
                    gl, this.samples
                );

                this._$maxTextureSize = Math.min(
                    8192, gl.getParameter(gl.MAX_TEXTURE_SIZE)
                ) - 2;

            } else {
                alert("WebGL setting is off. Please turn the setting on.");
            }

        }
    }

    /**
     * @description workerからのイベント受け取り関数
     *              Event reception function from worker
     *
     * @param  {MessageEvent} event
     * @return {void}
     * @method
     * @public
     */
    renderHandler (event)
    {
        switch (event.data.command) {

            case "initialize":
                this._$initializeHandler(event.data);
                break;

            case "cacheClear":
                Util.$cacheStore().remove(
                    event.data.id,
                    event.data.type
                );
                break;
            default:
                break;

        }
    }

    /**
     * @description 初期起動関数の終了後のイベント関数
     *              Event function after completion of initial startup function
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$initializeHandler (object)
    {
        this._$maxTextureSize = object.maxTextureSize;
    }

    /**
     * @description textureの最大描画可能サイズからリサイズの比率を算出して返す
     *              Calculate and return the resize ratio from the maximum drawable size of texture
     *
     * @param  {number} width
     * @param  {number} height
     * @return {number}
     * @method
     * @public
     */
    getTextureScale (width, height)
    {
        const maxSize = Math.max(width, height);
        if (maxSize > this._$maxTextureSize) {
            return this._$maxTextureSize / maxSize;
        }
        return 1;
    }

    /**
     * @description 描画領域をリサイズ
     *              Resize drawing area
     *
     * @param  {number} width
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    resize (width, height)
    {
        this._$width  = width;
        this._$height = height;

        if (this._$worker) {

            this._$worker.postMessage({
                "width": width,
                "height": height,
                "command": "resize"
            });

        } else {

            const context = this._$context;
            if (!context) { // unit test
                return ;
            }

            this._$canvas.width  = width;
            this._$canvas.height = height;

            context._$gl.viewport(0, 0, width, height);

            const manager = context._$frameBufferManager;
            if (this._$buffer) {
                manager.unbind();
                manager.releaseAttachment(this._$buffer, true);
            }

            this._$buffer = manager
                .createCacheAttachment(width, height, false);

            // update cache max size
            manager._$stencilBufferPool._$maxWidth  = width;
            manager._$stencilBufferPool._$maxHeight = height;
            manager._$textureManager._$maxWidth     = width;
            manager._$textureManager._$maxHeight    = height;
            context._$pbo._$maxWidth                = width;
            context._$pbo._$maxHeight               = height;
        }
    }

    /**
     * @description 描画の初期化
     *              Drawing initialization
     *
     * @param  {number} width
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    begin (width, height)
    {
        // 初期化
        this._$cacheCurrentBuffer = false;
        this._$currentAttachment.width  = width;
        this._$currentAttachment.height = height;
        this._$currentAttachment.texture.width  = width;
        this._$currentAttachment.texture.height = height;

        if (this._$worker) {

            this._$worker.postMessage({
                "command": "begin"
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            context._$bind(this._$buffer);

            // reset
            Util.$resetContext(context);
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, this._$width, this._$height);
            context.beginPath();

        }
    }

    /**
     * @description 表示用のcanvasを更新
     *              Update canvas for display
     *
     * @return {void}
     * @method
     * @public
     */
    updateMain ()
    {
        if (this._$worker) {

            this._$worker.postMessage({
                "command": "updateMain"
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            const manager = context._$frameBufferManager;
            const texture = manager.getTextureFromCurrentAttachment();

            manager.unbind();

            // reset and draw to main canvas
            Util.$resetContext(context);
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, this._$width, this._$height);
            context.drawImage(texture, 0, 0, this._$width, this._$height);

            // re bind
            context._$bind(this._$buffer);

        }
    }

    /**
     * @description 表示用のcanvasを更新
     *              Update canvas for display
     *
     * @param  {string|number|null} [background_color=null]
     * @return {void}
     * @method
     * @public
     */
    setBackgroundColor (background_color = null)
    {
        if (this._$worker) {

            this._$worker.postMessage({
                "backgroundColor": background_color,
                "command": "setBackgroundColor"
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            if (!background_color
                || background_color === "transparent"
            ) {

                context._$setColor(0, 0, 0, 0);

            } else {

                context._$setColor(
                    background_color[0],
                    background_color[1],
                    background_color[2],
                    background_color[3]
                );

            }

        }
    }

    /**
     * @member {object}
     * @readonly
     * @public
     */
    get currentAttachment ()
    {
        return this._$currentAttachment;
    }

    drawFilter (target_texture, matrix, filters, width, height)
    {

        const context = this._$context;
        if (!context) {
            return ;
        }

        const cacheKeys = [this._$instanceId, "f"];
        let cache = Util.$cacheStore().get(cacheKeys);

        const updated = this._$isFilterUpdated(
            width, height, matrix, filters, true
        );

        let texture;
        if (!cache || updated) {

            // cache clear
            if (cache) {

                Util.$cacheStore().set(cacheKeys, null);
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

            Util.$cacheStore().set(cacheKeys, texture);
        }

        if (cache) {
            texture = cache;
        }

        return texture;
    }

    /**
     * @description グラフィックオブジェクトの描画処理を実行
     *
     * @return {void}
     * @method
     * @public
     */
    drawGraphics (graphics,
        cache_keys, base_bounds, width, height, x_scale, y_scale,
        matrix, color_transform, filters, alpha, blend_mode,
        x_min, y_min, has_grid = false, parent_matrix = null
    ) {

        const player = Util.$currentPlayer();
        const mScale = player._$scale * player._$ratio;
        if (this._$worker) {

            const displayObject = graphics._$displayObject;

            const options = Util.$getArray();

            const message = {
                "command": "beginGraphics",
                "recodes": graphics._$getRecodes(),
                "useCache": Util.$useCache,
                "cacheKeys": cache_keys,
                "baseBounds": base_bounds,
                "xMin": x_min,
                "yMin": y_min,
                "xScale": x_scale,
                "yScale": y_scale
            };

            options.push(message.recodes.buffer);

            if (alpha !== 1) {
                message.alpha = alpha;
            }

            if (matrix[0] !== 1 || matrix[1] !== 0
                || matrix[2] !== 0 || matrix[3] !== 1
                || matrix[4] !== 0 || matrix[5] !== 0
            ) {
                message.matrix = matrix.slice();
                options.push(message.matrix.buffer);
            }

            if (color_transform[0] !== 1 || color_transform[1] !== 1
                || color_transform[2] !== 1 || color_transform[3] !== 1
                || color_transform[4] !== 0 || color_transform[5] !== 0
                || color_transform[6] !== 0 || color_transform[7] !== 0
            ) {
                message.colorTransform = color_transform.slice();
                options.push(message.colorTransform.buffer);
            }

            if (filters && filters.length
                && displayObject._$canApply(filters)
            ) {
                let updated = displayObject._$isUpdated();
                if (!updated) {
                    for (let idx = 0; idx < filters.length; ++idx) {

                        if (!filters[idx]._$isUpdated()) {
                            continue;
                        }

                        updated = true;
                        break;
                    }
                }

                const parameters = Util.$getArray();
                for (let idx = 0; idx < filters.length; ++idx) {
                    parameters.push(filters[idx]._$toArray());
                }

                message.isFilter   = true;
                message.width      = width;
                message.height     = height;
                message.instanceId = displayObject._$instanceId;
                message.updated    = updated;
                message.filters    = parameters;
            }

            if (blend_mode !== BlendMode.NORMAL) {
                message.blendMode = blend_mode;
            }

            if (has_grid) {
                message.hasGrid = has_grid;
                message.mScale  = mScale;

                message.parentMatrix = parent_matrix.slice();
                options.push(message.parentMatrix.buffer);

                const grid = displayObject._$scale9Grid;
                message.scale9Grid = {
                    "x": grid.x,
                    "y": grid.y,
                    "width": grid.width,
                    "height": grid.height
                };

                message.concatMatrix = displayObject
                    ._$parent
                    ._$transform
                    .concatenatedMatrix
                    ._$matrix;

                options.push(message.concatMatrix.buffer);
            }

            this._$worker.postMessage(message, options);

            Util.$poolArray(options);

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            const cacheStore = Util.$cacheStore();
            const displayObject = graphics._$displayObject;
            let texture = cacheStore.get(cache_keys);
            if (!texture) {

                const manager = context._$frameBufferManager;
                const currentAttachment = manager.currentAttachment;

                // resize
                let width  = $Math.ceil($Math.abs(base_bounds.xMax - base_bounds.xMin) * x_scale);
                let height = $Math.ceil($Math.abs(base_bounds.yMax - base_bounds.yMin) * y_scale);
                const textureScale = this.getTextureScale(width, height);
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
                    x_scale, 0, 0, y_scale,
                    -base_bounds.xMin * x_scale,
                    -base_bounds.yMin * y_scale
                );

                if (has_grid) {

                    const baseMatrix = Util.$getFloat32Array6(
                        mScale, 0, 0, mScale, 0, 0
                    );

                    const pMatrix = Util.$multiplicationMatrix(
                        baseMatrix, parent_matrix
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
                        aMatrixBase[4] * mScale - x_min,
                        aMatrixBase[5] * mScale - y_min
                    );

                    const apMatrix = Util.$multiplicationMatrix(
                        aMatrix, pMatrix
                    );
                    const aOffsetX = apMatrix[4] - (matrix[4] - x_min);
                    const aOffsetY = apMatrix[5] - (matrix[5] - y_min);
                    Util.$poolFloat32Array6(apMatrix);

                    const parentBounds = Util.$boundsMatrix(base_bounds, pMatrix);
                    const parentXMax   = +parentBounds.xMax;
                    const parentXMin   = +parentBounds.xMin;
                    const parentYMax   = +parentBounds.yMax;
                    const parentYMin   = +parentBounds.yMin;
                    const parentWidth  = $Math.ceil($Math.abs(parentXMax - parentXMin));
                    const parentHeight = $Math.ceil($Math.abs(parentYMax - parentYMin));

                    Util.$poolBoundsObject(parentBounds);

                    context.grid.enable(
                        parentXMin, parentYMin, parentWidth, parentHeight,
                        base_bounds, displayObject._$scale9Grid, mScale,
                        pMatrix[0], pMatrix[1], pMatrix[2], pMatrix[3], pMatrix[4], pMatrix[5],
                        aMatrix[0], aMatrix[1], aMatrix[2], aMatrix[3], aMatrix[4] - aOffsetX, aMatrix[5] - aOffsetY
                    );

                    Util.$poolFloat32Array6(pMatrix);
                    Util.$poolFloat32Array6(aMatrix);
                }

                // plain alpha
                color_transform[3] = 1;
                graphics._$doDraw(context, color_transform, false);

                if (has_grid) {
                    context.grid.disable();
                }

                texture = manager.getTextureFromCurrentAttachment();

                // set cache
                if (Util.$useCache) {
                    cacheStore.set(cache_keys, texture);
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
                && displayObject._$canApply(filters)
            ) {

                drawFilter = true;

                texture = displayObject._$drawFilter(
                    context, texture, matrix,
                    filters, width, height
                );

                offsetX = texture._$offsetX;
                offsetY = texture._$offsetY;
            }

            const radianX = drawFilter ? 0 : $Math.atan2(matrix[1], matrix[0]);
            const radianY = drawFilter ? 0 : $Math.atan2(-matrix[2], matrix[3]);
            if (radianX || radianY) {

                const tx = base_bounds.xMin * x_scale;
                const ty = base_bounds.yMin * y_scale;

                const cosX = $Math.cos(radianX);
                const sinX = $Math.sin(radianX);
                const cosY = $Math.cos(radianY);
                const sinY = $Math.sin(radianY);

                context.setTransform(
                    cosX, sinX, -sinY, cosY,
                    tx * cosX - ty * sinY + matrix[4],
                    tx * sinX + ty * cosY + matrix[5]
                );

            } else {

                context.setTransform(1, 0, 0, 1,
                    x_min - offsetX, y_min - offsetY
                );

            }

            // reset
            Util.$resetContext(context);

            // draw
            context._$globalAlpha = alpha;
            context._$imageSmoothingEnabled = true;
            context._$globalCompositeOperation = blend_mode;

            context.drawImage(texture,
                0, 0, texture.width, texture.height, color_transform
            );
        }
    }

    /**
     * @description Videoの描画
     *
     * @param {next2d.media.Video} video
     * @param {Float32Array} matrix
     * @param {Float32Array} color_transform
     * @param {number} width
     * @param {number} height
     * @param {number} alpha
     * @param {string} blend_mode
     * @param {array} [filters=null]
     * @return {void}
     * @method
     * @public
     */
    drawVideo (
        video, matrix, color_transform, width, height,
        alpha, blend_mode, filters = null
    ) {
        if (this._$worker) {

            video._$context.drawImage(video._$video, 0, 0);

            const imageBitmap = video
                ._$context
                .canvas
                .transferToImageBitmap();

            const options = Util.$getArray(imageBitmap);

            const message = {
                "command": "drawVideo",
                "smoothing": video._$smoothing,
                "imageBitmap": imageBitmap
            };

            if (alpha !== 1) {
                message.alpha = alpha;
            }

            if (matrix[0] !== 1 || matrix[1] !== 0
                || matrix[2] !== 0 || matrix[3] !== 1
                || matrix[4] !== 0 || matrix[5] !== 0
            ) {
                message.matrix = matrix.slice();
                options.push(message.matrix.buffer);
            }

            if (color_transform[0] !== 1 || color_transform[1] !== 1
                || color_transform[2] !== 1 || color_transform[3] !== 1
                || color_transform[4] !== 0 || color_transform[5] !== 0
                || color_transform[6] !== 0 || color_transform[7] !== 0
            ) {
                message.colorTransform = color_transform.slice();
                options.push(message.colorTransform.buffer);
            }

            if (filters && filters.length
                && video._$canApply(filters)
            ) {

                const parameters = Util.$getArray();
                for (let idx = 0; idx < filters.length; ++idx) {
                    parameters.push(filters[idx]._$toArray());
                }

                message.isFilter   = true;
                message.baseBounds = video._$bounds;
                message.width      = width;
                message.height     = height;
                message.filters    = parameters;
            }

            if (blend_mode !== BlendMode.NORMAL) {
                message.blendMode = blend_mode;
            }

            this._$worker.postMessage(message, [imageBitmap]);

            Util.$poolArray(options);

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            const manager = context._$frameBufferManager;

            let texture = manager.createTextureFromVideo(
                video._$video, video._$smoothing
            );

            if (filters && filters.length
                && video._$canApply(filters)
            ) {

                // draw filter
                texture = video._$drawFilter(
                    context, texture, matrix,
                    filters, width, height
                );

                // reset
                Util.$resetContext(context);

                // draw
                context._$globalAlpha = alpha;
                context._$imageSmoothingEnabled = video._$smoothing;
                context._$globalCompositeOperation = blend_mode;

                // size
                const bounds = Util.$boundsMatrix(video._$bounds, matrix);
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

            } else {

                // reset
                Util.$resetContext(context);

                // draw
                context._$globalAlpha = alpha;
                context._$imageSmoothingEnabled = video._$smoothing;
                context._$globalCompositeOperation = blend_mode;

                context.setTransform(
                    matrix[0], matrix[1], matrix[2],
                    matrix[3], matrix[4], matrix[5]
                );

                context.drawImage(
                    texture, 0, 0,
                    texture.width, texture.height, color_transform
                );
            }

            manager.releaseTexture(texture);
        }
    }

    /**
     * @description テキストを描画
     *
     * @return {void}
     * @method
     * @public
     */
    drawText (text_field,
        cache_keys, base_bounds, width, height, x_scale, y_scale,
        matrix, color_transform, filters, alpha, blend_mode,
        x_min, y_min
    ) {

        if (this._$worker) {

            const options = Util.$getArray();

            const message = {
                "command": "drawText",
                "instanceId": text_field._$instanceId,
                "textData": text_field._$getTextData(),
                "cacheKeys": cache_keys,
                "baseBounds": base_bounds,
                "updated": text_field._$renew || text_field._$isUpdated(),
                "xMin": x_min,
                "yMin": y_min,
                "xScale": x_scale,
                "yScale": y_scale,
                "scrollV": text_field.scrollV,
                "widthTable": text_field._$widthTable,
                "heightTable": text_field._$heightTable,
                "textHeightTable": text_field._$textHeightTable,
                "objectTable": text_field._$objectTable,
                "limitWidth": text_field.width,
                "limitHeight": text_field.height,
                "textHeight": text_field.textHeight,
                "verticalAlign": text_field._$verticalAlign,
                "autoSize": text_field._$autoSize,
                "useCache": Util.$useCache,
                "isSafari": Util.$isSafari
            };

            if (text_field._$thickness) {
                message.thickness = text_field._$thickness;
                message.thicknessColor = text_field._$thicknessColor;
            }

            if (text_field._$background) {
                message.background = text_field._$background;
                message.backgroundColor = text_field._$backgroundColor;
            }

            if (text_field._$border) {
                message.border = text_field._$border;
                message.borderColor = text_field._$borderColor;
            }

            if (alpha !== 1) {
                message.alpha = alpha;
            }

            if (matrix[0] !== 1 || matrix[1] !== 0
                || matrix[2] !== 0 || matrix[3] !== 1
                || matrix[4] !== 0 || matrix[5] !== 0
            ) {
                message.matrix = matrix.slice();
                options.push(message.matrix.buffer);
            }

            if (color_transform[0] !== 1 || color_transform[1] !== 1
                || color_transform[2] !== 1 || color_transform[3] !== 1
                || color_transform[4] !== 0 || color_transform[5] !== 0
                || color_transform[6] !== 0 || color_transform[7] !== 0
            ) {
                message.colorTransform = color_transform.slice();
                options.push(message.colorTransform.buffer);
            }

            if (filters && filters.length
                && text_field._$canApply(filters)
            ) {
                let updated = text_field._$isUpdated();
                if (!updated) {
                    for (let idx = 0; idx < filters.length; ++idx) {

                        if (!filters[idx]._$isUpdated()) {
                            continue;
                        }

                        updated = true;
                        break;
                    }
                }

                const parameters = Util.$getArray();
                for (let idx = 0; idx < filters.length; ++idx) {
                    parameters.push(filters[idx]._$toArray());
                }

                message.isFilter = true;
                message.width    = width;
                message.height   = height;
                message.updated  = updated;
                message.filters  = parameters;
            }

            if (blend_mode !== BlendMode.NORMAL) {
                message.blendMode = blend_mode;
            }

            this._$worker.postMessage(message, options);

            text_field._$renew = false;

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            const instanceId = text_field._$instanceId;

            const cacheStore = Util.$cacheStore();
            const cacheKeys  = cacheStore.generateKeys(
                instanceId, cache_keys
            );

            let texture = cacheStore.get(cacheKeys);

            // texture is small or renew
            if (text_field._$renew || text_field._$isUpdated()) {
                cacheStore.removeCache(instanceId);
                texture = null;
            }

            if (!texture) {

                // resize
                const lineWidth  = $Math.min(1, $Math.max(x_scale, y_scale));
                const baseWidth  = $Math.ceil($Math.abs(base_bounds.xMax - base_bounds.xMin) * x_scale);
                const baseHeight = $Math.ceil($Math.abs(base_bounds.yMax - base_bounds.yMin) * y_scale);

                text_field._$renew = false;

                // alpha reset
                color_transform[3] = 1;

                // new canvas
                const canvas  = cacheStore.getCanvas();
                canvas.width  = baseWidth  + lineWidth * 2;
                canvas.height = baseHeight + lineWidth * 2;
                const ctx     = canvas.getContext("2d");

                // border and background
                if (text_field._$background || text_field._$border) {

                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(baseWidth, 0);
                    ctx.lineTo(baseWidth, baseHeight);
                    ctx.lineTo(0, baseHeight);
                    ctx.lineTo(0, 0);

                    if (text_field._$background) {

                        const rgb   = Util.$intToRGBA(text_field._$backgroundColor);
                        const alpha = $Math.max(0, $Math.min(
                            rgb.A * 255 * color_transform[3] + color_transform[7], 255)
                        ) / 255;

                        ctx.fillStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
                        ctx.fill();
                    }

                    if (text_field._$border) {

                        const rgb   = Util.$intToRGBA(text_field._$borderColor);
                        const alpha = $Math.max(0, $Math.min(
                            rgb.A * 255 * color_transform[3] + color_transform[7], 255)
                        ) / 255;

                        ctx.lineWidth   = lineWidth;
                        ctx.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
                        ctx.stroke();

                    }

                }

                // mask start
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(2, 2);
                ctx.lineTo(baseWidth - 2, 2);
                ctx.lineTo(baseWidth - 2, baseHeight - 2);
                ctx.lineTo(2, baseHeight - 2);
                ctx.lineTo(2, 2);
                ctx.clip();

                ctx.beginPath();
                ctx.setTransform(x_scale, 0, 0, y_scale, 0, 0);
                text_field._$doDraw(ctx, matrix, color_transform, baseWidth / matrix[0]);
                ctx.restore();

                texture = context
                    .frameBuffer
                    .createTextureFromCanvas(ctx.canvas);

                // set cache
                if (Util.$useCache) {
                    cacheStore.set(cacheKeys, texture);
                }

                // destroy cache
                cacheStore.destroy(ctx);

            }

            let drawFilter = false;
            let offsetX = 0;
            let offsetY = 0;
            if (filters && filters.length
                && text_field._$canApply(filters)
            ) {

                drawFilter = true;

                texture = text_field._$drawFilter(
                    context, texture, matrix,
                    filters, width, height
                );

                offsetX = texture._$offsetX;
                offsetY = texture._$offsetY;
            }

            const radianX = drawFilter ? 0 : $Math.atan2(matrix[1], matrix[0]);
            const radianY = drawFilter ? 0 : $Math.atan2(-matrix[2], matrix[3]);
            if (radianX || radianY) {

                const tx = base_bounds.xMin * x_scale;
                const ty = base_bounds.yMin * y_scale;

                const cosX = $Math.cos(radianX);
                const sinX = $Math.sin(radianX);
                const cosY = $Math.cos(radianY);
                const sinY = $Math.sin(radianY);

                context.setTransform(
                    cosX, sinX, -sinY, cosY,
                    tx * cosX - ty * sinY + matrix[4],
                    tx * sinX + ty * cosY + matrix[5]
                );

            } else {

                context.setTransform(1, 0, 0, 1,
                    x_min - offsetX, y_min - offsetY
                );

            }

            // reset
            Util.$resetContext(context);

            // draw
            context._$globalAlpha = alpha;
            context._$imageSmoothingEnabled = true;
            context._$globalCompositeOperation = blend_mode;

            context.drawImage(texture,
                0, 0, texture.width, texture.height, color_transform
            );
        }
    }

    /**
     * @description テキストエリアのマスクを描画
     *
     * @param  {number} width
     * @param  {number} height
     * @param  {Float32Array} matrix
     * @return {void}
     * @method
     * @public
     */
    clipText (width, height, matrix)
    {
        if (this._$worker) {

            this._$worker.postMessage({
                "command": "clipText",
                "width": width,
                "height": height,
                "matrix": matrix
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            Util.$resetContext(context);
            context.setTransform(
                matrix[0], matrix[1], matrix[2],
                matrix[3], matrix[4], matrix[5]
            );
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(width, 0);
            context.lineTo(width, height);
            context.lineTo(0, height);
            context.lineTo(0, 0);
            context.clip(true);
        }
    }

    /**
     * @description Videoクラスのマスク処理
     *
     * @param  {number} width
     * @param  {number} height
     * @param  {Float32Array} matrix
     * @return {void}
     * @method
     * @public
     */
    clipVideo (width, height, matrix)
    {
        if (this._$worker) {

            this._$worker.postMessage({
                "command": "clipVideo",
                "width": width,
                "height": height,
                "matrix": matrix
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            Util.$resetContext(context);
            context.setTransform(
                matrix[0], matrix[1], matrix[2],
                matrix[3], matrix[4], matrix[5]
            );

            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(width, 0);
            context.lineTo(width, height);
            context.lineTo(0, height);
            context.lineTo(0, 0);
            context.clip(true);

        }
    }

    /**
     * @description グラフィックオブジェクトのマスク描画処理を実行
     *
     * @param  {Graphics} graphics
     * @param  {Float32Array} matrix
     * @return {void}
     * @method
     * @public
     */
    clipGraphics (graphics, matrix)
    {
        if (this._$worker) {

            const recodes = graphics._$getRecodes();
            const cloneMatrix = matrix.slice();

            this._$worker.postMessage({
                "command": "clipGraphics",
                "recodes": recodes,
                "matrix": cloneMatrix
            }, [recodes.buffer, cloneMatrix.buffer]);

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            Util.$resetContext(context);
            context.setTransform(
                matrix[0], matrix[1], matrix[2],
                matrix[3], matrix[4], matrix[5]
            );

            graphics._$doDraw(context, null, true);

            context.clip();
        }
    }

    /**
     * @description 現在の状態を内部保存
     *
     * @return {void}
     * @method
     * @public
     */
    save ()
    {
        if (this._$worker) {

            this._$worker.postMessage({
                "command": "save"
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            context.save();
        }
    }

    /**
     * @description 保存した内部情報を復元
     *
     * @return {void}
     * @method
     * @public
     */
    restore ()
    {
        if (this._$worker) {

            this._$worker.postMessage({
                "command": "restore"
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            context.restore();
        }
    }

    /**
     * @description マスク処理の開始関数
     *
     * @param  {Float32Array} matrix
     * @param  {object} bounds
     * @return {Float32Array}
     * @method
     * @public
     */
    startClip (matrix, bounds)
    {
        let x      = bounds.xMin;
        let y      = bounds.yMin;
        let width  = Math.abs(bounds.xMax - bounds.xMin);
        let height = Math.abs(bounds.yMax - bounds.yMin);

        // resize
        const currentAttachment = this._$currentAttachment;
        if (width + x > currentAttachment.texture.width) {
            width -= width - currentAttachment.texture.width + x;
        }

        if (height + y > currentAttachment.texture.height) {
            height -= height - currentAttachment.texture.height + y;
        }

        if (0 > x) {
            width += x;
            x = 0;
        }

        if (0 > y) {
            height += y;
            y = 0;
        }

        if (0 >= width || 0 >= height) {
            return null;
        }

        width  = Math.ceil(width);
        height = Math.ceil(height);

        // cache
        this._$cacheCurrentBuffer = true;
        this._$cacheCurrentBounds.x = x;
        this._$cacheCurrentBounds.y = y;
        this._$cacheCurrentBounds.w = width;
        this._$cacheCurrentBounds.h = height;
        if (this._$worker) {

            this._$worker.postMessage({
                "command": "startClip",
                "x": x,
                "y": y,
                "width": width,
                "height": height
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            context._$cacheCurrentBounds.x = x;
            context._$cacheCurrentBounds.y = y;
            context._$cacheCurrentBounds.w = width;
            context._$cacheCurrentBounds.h = height;

            const manager = context._$frameBufferManager;
            const currentAttachment = manager.currentAttachment;

            context._$cacheCurrentBuffer = currentAttachment;
            const texture = currentAttachment.texture;

            // create new buffer
            context._$bind(
                manager.createCacheAttachment(width, height, true)
            );

            // draw background
            Util.$resetContext(context);
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.drawImage(texture, -x, -y, texture.width, texture.height);
        }

        return Util.$getFloat32Array6(
            matrix[0], matrix[1], matrix[2], matrix[3],
            matrix[4] - x,
            matrix[5] - y
        );
    }

    /**
     * @description マスクの描画対象を終了
     *
     * @return {void}
     * @method
     * @public
     */
    leaveClip ()
    {
        this._$currentAttachment.clipLevel--;
        if (!this._$currentAttachment.clipLevel) {
            this._$cacheCurrentBuffer = false;
        }

        if (this._$worker) {

            this._$worker.postMessage({
                "command": "leaveClip"
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            context._$leaveClip();
        }
    }

    /**
     * @description マスクの描画対象を追加
     *
     * @return {void}
     * @method
     * @public
     */
    enterClip ()
    {
        this._$currentAttachment.clipLevel++;
        if (this._$worker) {

            this._$worker.postMessage({
                "command": "enterClip"
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            context._$enterClip();
        }
    }

    /**
     * @description 開始となるマスクの階層を調整
     *
     * @return {void}
     * @method
     * @public
     */
    beginClipDef ()
    {
        if (this._$worker) {

            this._$worker.postMessage({
                "command": "beginClipDef"
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            context._$beginClipDef();
        }
    }

    /**
     * @description 終了したマスクの階層を調整
     *
     * @return {void}
     * @method
     * @public
     */
    endClipDef ()
    {
        if (this._$worker) {

            this._$worker.postMessage({
                "command": "endClipDef"
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            context._$endClipDef();
        }
    }

    /**
     * @description マスク対象のコンテナーオブジェクトのマスク描画処理
     *
     * @return {void}
     * @method
     * @public
     */
    drawContainerClip ()
    {
        if (this._$worker) {

            this._$worker.postMessage({
                "command": "drawContainerClip"
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            context._$drawContainerClip();
        }
    }

    /**
     * @description マスク対象がコンテナーオブジェクトかの判定フラグ
     *
     * @param {boolean} flag
     * @method
     * @public
     */
    updateContainerClipFlag (flag)
    {
        if (this._$worker) {

            this._$worker.postMessage({
                "command": "updateContainerClipFlag",
                "flag": flag
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            context._$mask._$containerClip = flag;
        }
    }

    /**
     * @description レイヤーモードを起動
     *
     * @param  {object} position
     * @return {void}
     * @method
     * @public
     */
    startLayer (position)
    {
        this._$positions.push(position);
        this._$layerState.push(this._$isLayer);

        if (this._$worker) {

            this._$worker.postMessage({
                "command": "startLayer",
                "position": position
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            context._$startLayer(position);
        }
    }

    /**
     * @description レイヤーモードを終了
     *
     * @return {void}
     * @method
     * @public
     */
    endLayer ()
    {
        const bounds = this._$positions.pop();

        this._$isLayer = !!this._$layerState.pop();
        if (this._$worker) {

            this._$worker.postMessage({
                "command": "endLayer"
            });

            Util.$poolBoundsObject(bounds);

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            context._$endLayer();
        }
    }

    /**
     * @description レイヤーの表示領域を返却
     *
     * @return {object}
     * @method
     * @public
     */
    getCurrentPosition ()
    {
        return this._$positions[this._$positions.length - 1];
    }

    /**
     * @description マスク情報をキャッシュ
     *
     * @return {void}
     * @method
     * @public
     */
    saveCurrentMask ()
    {
        this._$maskState.push(this._$cacheCurrentBuffer);

        const bounds = this._$cacheCurrentBounds;
        this._$maskBounds.push(Util.$getBoundsObject(
            bounds.x, bounds.w, bounds.y, bounds.h
        ));

        this._$cacheCurrentBuffer = false;

        if (this._$worker) {

            this._$worker.postMessage({
                "command": "saveCurrentMask"
            });

        } else {
            const context = this._$context;
            if (!context) {
                return ;
            }

            context._$saveCurrentMask();
        }
    }

    /**
     * @description キャッシュしたマスク情報を復元
     *
     * @return {void}
     * @method
     * @public
     */
    restoreCurrentMask ()
    {
        this._$cacheCurrentBuffer = this._$maskState.pop();
        this._$cacheCurrentBounds = this._$maskBounds.pop();

        if (this._$worker) {

            this._$worker.postMessage({
                "command": "restoreCurrentMask"
            });

        } else {
            const context = this._$context;
            if (!context) {
                return ;
            }

            context._$restoreCurrentMask();
        }
    }

    /**
     * @description 現在セットされてるbufferをキャッシュして新しいbufferをセット
     *
     * @param  {number} width
     * @param  {number} height
     * @param  {boolean} [multisample=false]
     * @return {void}
     * @method
     * @public
     */
    saveAttachment (width, height, multisample = false)
    {
        if (this._$worker) {

            this._$worker.postMessage({
                "command": "saveAttachment",
                "width": width,
                "height": height,
                "multisample": multisample
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            context._$saveAttachment(width, height, multisample);
        }
    }

    /**
     * @description キャッシュしたbufferを再セット
     *
     * @return {void}
     * @method
     * @public
     */
    restoreAttachment ()
    {
        if (this._$worker) {

            this._$worker.postMessage({
                "command": "restoreAttachment"
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            context._$restoreAttachment();
        }
    }

    /**
     * @description フィルター、ブレンドモードの事後処理
     *
     * @param  {number} instance_id
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @param  {object} object
     * @return {void}
     * @method
     * @public
     */
    postDraw (instance_id, matrix, color_transform, object)
    {
        if (this._$worker) {

            if (object.filters.length) {
                const filters = Util.$getArray();
                for (let idx = 0; idx < object.filters.length; ++idx) {
                    filters.push(object.filters[idx]._$toArray());
                }
                object.filters = filters;
            }

            this._$worker.postMessage({
                "command": "postDraw",
                "instanceId": instance_id,
                "matrix": matrix,
                "colorTransform": color_transform,
                "object": object
            });

        } else {

            const context = this._$context;
            if (!context) {
                return ;
            }

            // cache
            const cacheKeys = Util.$getArray(instance_id, "f");

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
                        texture = object.filters[idx]._$applyFilter(context, matrix);
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
                texture.matrix = mat[0] + "_" + mat[1] + "_"
                    + mat[2] + "_" + mat[3];

                texture.layerWidth  = object.layerWidth;
                texture.layerHeight = object.layerHeight;
            }

            // cache texture
            cacheStore.set(cacheKeys, texture);
            Util.$poolArray(cacheKeys);

            // set current buffer
            if (object.isUpdated) {
                this.restoreAttachment();
            }

            // set
            Util.$resetContext(context);

            context._$globalAlpha = Util.$clamp(
                color_transform[3] + color_transform[7] / 255, 0, 1
            );
            context._$globalCompositeOperation = object.blendMode;

            context.setTransform(1, 0, 0, 1, 0, 0);
            context.drawImage(texture,
                -offsetX + object.position.dx,
                -offsetY + object.position.dy,
                texture.width, texture.height,
                color_transform
            );
        }
    }
}