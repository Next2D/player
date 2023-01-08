let context = null;

/**
 * @class
 */
class CommandController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
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
         * @default 4
         * @private
         */
        this._$samples = 4;

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
    }

    /**
     * @description アンチエイリアスのサンプル数
     *              Number of anti-aliasing samples
     *
     * @member {number}
     * @readonly
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
     * @description 初期起動関数、CanvasToWebGLContextを起動
     *              Initial startup function, CanvasToWebGLContext
     *
     * @param  {HTMLCanvasElement} canvas
     * @param  {number} [samples=4]
     * @return {void}
     * @method
     * @public
     */
    initialize (canvas, samples = 4)
    {
        // setup
        this._$canvas  = canvas
        this._$samples = samples;

        const option = {
            "stencil": true,
            "premultipliedAlpha": true,
            "antialias": false,
            "depth": false,
            "preserveDrawingBuffer": true
        };

        let gl = canvas.getContext("webgl2", option);
        if (!gl) {
            gl = canvas.getContext("webgl", option)
                || canvas.getContext("experimental-webgl", option);
        }

        this._$context = new CanvasToWebGLContext(gl, true, this.samples);
    }

    /**
     * @description 描画範囲をリサイズ
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
        this._$canvas.width  = this._$width  = width;
        this._$canvas.height = this._$height = height;

        const context = this._$context;
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
        const context = this._$context;

        context._$bind(this._$buffer);

        // reset
        Util.$resetContext(context);
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, this._$width, this._$height);
        context.beginPath();
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
        const context = this._$context;

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

    /**
     * @description 表示用のcanvasを更新
     *              Update canvas for display
     *
     * @param  {string|number|null} [background_color=null]
     * @return {void}
     * @method
     * @public
     */
    setBackgroundColor (background_color)
    {
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
const command = new CommandController();

/**
 * @public
 */
this.addEventListener("message", function (event)
{
    switch (event.data.command) {

        case "initialize":
            command.initialize(
                event.data.canvas,
                event.data.samples
            );
            break;

        case "resize":
            command.resize(
                event.data.width,
                event.data.height
            );
            break;

        case "begin":
            command.begin();
            break;

        case "updateMain":
            command.updateMain();
            break;

        case "setBackgroundColor":
            command.setBackgroundColor(
                event.data.backgroundColor
            );
            break;

        default:
            break;

    }
});