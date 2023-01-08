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

        if (Util.$renderURL) {

            this._$worker = new Worker(Util.$renderURL);

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
            } else {
                alert("WebGL setting is off. Please turn the setting on.");
            }

        }
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
     * @return {void}
     * @method
     * @public
     */
    begin ()
    {
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

            const bufferManager = context._$frameBufferManager;
            const bufferTexture = bufferManager.getTextureFromCurrentAttachment();

            bufferManager.unbind();

            // reset and draw to main canvas
            Util.$resetContext(context);
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, this._$width, this._$height);
            context.drawImage(bufferTexture, 0, 0, this._$width, this._$height);

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

            if (!this._$context) {
                return ;
            }

            if (!background_color
                || background_color === "transparent"
            ) {

                this._$context._$setColor(0, 0, 0, 0);

            } else {

                this._$context._$setColor(
                    background_color[0],
                    background_color[1],
                    background_color[2],
                    background_color[3]
                );

            }

        }
    }
}