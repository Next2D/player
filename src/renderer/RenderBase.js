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
         * @type {boolean}
         * @default false
         * @private
         */
        this._$wait = false;

        /**
         * @type {string}
         * @default "deactivate"
         * @public
         */
        this.state = "deactivate";

        /**
         * @type {array}
         * @public
         */
        this.queue = [];
    }

    /**
     * @description 初期起動関数、CanvasToWebGLContextを起動
     *              Initial startup function, CanvasToWebGLContext
     *
     * @param  {HTMLCanvasElement} canvas
     * @param  {number} [samples=4]
     * @param  {number} [devicePixelRatio=2]
     * @return {void}
     * @method
     * @public
     */
    initialize (canvas, samples = 4, devicePixelRatio = 2)
    {
        // update
        $devicePixelRatio = devicePixelRatio;

        const gl = canvas.getContext("webgl2", {
            "stencil": true,
            "premultipliedAlpha": true,
            "antialias": false,
            "depth": false,
            "preserveDrawingBuffer": true
        });

        const player = Util.$renderPlayer;
        player._$samples = samples;
        player._$canvas  = canvas;

        const context = new CanvasToWebGLContext(gl, samples);
        player._$context = context;
        player._$cacheStore._$context = context;
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
        const player = Util.$renderPlayer;

        if (!background_color
            || background_color === "transparent"
        ) {

            player._$context._$setColor(0, 0, 0, 0);

        } else {

            player._$context._$setColor(
                background_color[0],
                background_color[1],
                background_color[2],
                background_color[3]
            );

        }
    }

    /**
     * @description 処理を実行
     *              Execute process
     *
     * @return {void}
     * @method
     * @public
     */
    execute ()
    {
        this.state = "active";

        while (this.queue.length) {

            if (this._$wait) {
                continue;
            }

            const object = this.queue.shift();
            switch (object.command) {

                case "setProperty":
                    {
                        const instances = Util.$renderPlayer._$instances;
                        if (!instances.has(object.instanceId)) {
                            continue;
                        }

                        instances.get(object.instanceId)._$update(object);
                    }
                    break;

                case "setChildren":
                    {
                        const instances = Util.$renderPlayer._$instances;
                        if (!instances.has(object.instanceId)) {
                            continue;
                        }
                        instances.get(object.instanceId)._$children = object.children;
                    }
                    break;

                case "doChanged":
                    {
                        const instances = Util.$renderPlayer._$instances;
                        if (!instances.has(object.instanceId)) {
                            continue;
                        }
                        instances.get(object.instanceId)._$updated = true;
                    }
                    break;

                case "remove":
                    {
                        const instances = Util.$renderPlayer._$instances;
                        if (!instances.has(object.instanceId)) {
                            continue;
                        }

                        const instance = instances.get(object.instanceId);
                        instance._$remove();

                        instances.delete(object.instanceId);
                    }
                    break;

                case "createShape":
                    Util.$renderPlayer._$createShape(object);
                    break;

                case "createDisplayObjectContainer":
                    Util.$renderPlayer._$createDisplayObjectContainer(object);
                    break;

                case "createTextField":
                    Util.$renderPlayer._$createTextField(object);
                    break;

                case "createVideo":
                    Util.$renderPlayer._$createVideo(object);
                    break;

                case "resize":
                    Util.$renderPlayer._$resize(
                        object.width,
                        object.height,
                        object.scale,
                        object.tx,
                        object.ty
                    );
                    break;

                case "initialize":
                    this.initialize(
                        object.canvas, object.samples, object.devicePixelRatio
                    );
                    break;

                case "setBackgroundColor":
                    this.setBackgroundColor(object.backgroundColor);
                    break;

                case "setStage":
                    Util.$renderPlayer._$setStage(
                        object.instanceId
                    );
                    break;

                case "play":
                    Util.$renderPlayer._$frameRate = object.frameRate;
                    Util.$renderPlayer.play();
                    break;

                case "stop":
                    Util.$renderPlayer.stop();
                    break;

                default:
                    break;

            }
        }

        this.state = "deactivate";
    }
}
const command = new CommandController();

/**
 * @type {array}
 */
Util.$filters = [
    BevelFilter,
    BlurFilter,
    ColorMatrixFilter,
    ConvolutionFilter,
    DisplacementMapFilter,
    DropShadowFilter,
    GlowFilter,
    GradientBevelFilter,
    GradientGlowFilter
];

/**
 * @public
 */
this.addEventListener("message", function (event)
{
    command.queue.push(event.data);
    if (command.state === "deactivate") {
        command.execute();
    }
});