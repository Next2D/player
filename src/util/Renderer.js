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
         * @type {number}
         * @default 8192
         * @private
         */
        this._$maxTextureSize = 8192;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$cacheCurrentBuffer = null;

        /**
         * @type {object}
         * @private
         */
        this._$cacheCurrentBounds = { "x": 0, "y": 0, "w": 0, "h": 0 };
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
            const option = {
                "stencil": true,
                "premultipliedAlpha": true,
                "antialias": false,
                "depth": false,
                "preserveDrawingBuffer": true
            };

            let isWebGL2Context = true;
            let gl = canvas.getContext("webgl2", option);
            if (!gl) {
                gl = canvas.getContext("webgl", option)
                    || canvas.getContext("experimental-webgl", option);
                isWebGL2Context = false;
            }

            if (gl) {

                this._$context = new CanvasToWebGLContext(
                    gl, isWebGL2Context, this.samples
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
        this._$cacheCurrentBuffer = null;
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

            const recodes = graphics._$getRecodes();

            const message = {
                "command": "beginGraphics",
                "useCache": Util.$useCache,
                "cacheKeys": cache_keys,
                "baseBounds": base_bounds,
                "width": width,
                "height": height,
                "xScale": x_scale,
                "yScale": y_scale,
                "alpha": alpha,
                "xMin": x_min,
                "yMin": y_min,
                "recodes": recodes
            };

            if (matrix[0] !== 1 || matrix[1] !== 0
                || matrix[2] !== 0 || matrix[3] !== 1
                || matrix[4] !== 0 || matrix[5] !== 0
            ) {
                message.matrix = matrix;
            }

            if (color_transform[0] !== 1 || color_transform[1] !== 1
                || color_transform[2] !== 1 || color_transform[3] !== 1
                || color_transform[4] !== 0 || color_transform[5] !== 0
                || color_transform[6] !== 0 || color_transform[7] !== 0
            ) {
                message.colorTransform = color_transform;
            }

            // TODO
            if (filters && filters.length) {
                message.filters = filters;
            }

            if (blend_mode !== BlendMode.NORMAL) {
                message.blendMode = blend_mode;
            }

            if (has_grid) {
                message.hasGrid = has_grid;
                message.parentMatrix = parent_matrix;
                message.mScale = mScale;

                const displayObject = graphics._$displayObject;

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
            }

            this._$worker.postMessage(message, [recodes.buffer]);

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

            if (filters && filters.length) {

                const canApply = displayObject._$canApply(filters);
                if (canApply) {

                    const filterTexture = displayObject._$drawFilter(
                        context, texture, matrix,
                        filters, width, height
                    );

                    // reset
                    Util.$resetContext(context);

                    // draw
                    context._$globalAlpha = alpha;
                    context._$imageSmoothingEnabled = true;
                    context._$globalCompositeOperation = blend_mode;

                    context.setTransform(1, 0, 0, 1,
                        x_min - filterTexture._$offsetX,
                        y_min - filterTexture._$offsetY
                    );
                    context.drawImage(filterTexture,
                        0, 0, filterTexture.width, filterTexture.height,
                        color_transform
                    );

                    return ;
                }
            }

            // reset
            Util.$resetContext(context);

            // draw
            context._$globalAlpha = alpha;
            context._$imageSmoothingEnabled = true;
            context._$globalCompositeOperation = blend_mode;

            const radianX = $Math.atan2(matrix[1], matrix[0]);
            const radianY = $Math.atan2(-matrix[2], matrix[3]);
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

                context.setTransform(1, 0, 0, 1, x_min, y_min);

            }

            context.drawImage(texture,
                0, 0, texture.width, texture.height, color_transform
            );
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
        this._$cacheCurrentBuffer = currentAttachment;
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
            this._$cacheCurrentBuffer = null;
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
}