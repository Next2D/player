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
     * @param  {boolean} [is_safari=false]
     * @return {void}
     * @method
     * @public
     */
    initialize (canvas, samples = 4, devicePixelRatio = 2, is_safari = false)
    {
        // update
        $devicePixelRatio = devicePixelRatio;
        Util.$isSafari = !!is_safari;

        const player = Util.$renderPlayer;
        player._$samples = samples;
        player._$canvas  = canvas;

        const gl = canvas.getContext("webgl2", {
            "stencil": true,
            "premultipliedAlpha": true,
            "antialias": false,
            "depth": false,
            "preserveDrawingBuffer": true
        });

        if (gl) {
            const context = new CanvasToWebGLContext(gl, samples);
            player._$context = context;
            player._$cacheStore._$context = context;
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
        const context = Util.$renderPlayer._$context;
        if (!context) {
            return ;
        }

        if (!background_color
            || background_color === "transparent"
        ) {

            context._$setColor(0, 0, 0, 0);

        } else {

            const color = Util.$uintToRGBA(
                Util.$toColorInt(background_color)
            );

            context._$setColor(
                color.R / 255,
                color.G / 255,
                color.B / 255,
                color.A / 255
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

                case "bitmapDraw":
                    {
                        const player = Util.$renderPlayer;
                        const stopFlag = player._$stopFlag;

                        if (!stopFlag) {
                            player.stop();
                        }

                        const canvas = new $OffscreenCanvas(
                            object.width,
                            object.height
                        );

                        player._$bitmapDraw(
                            player._$instances.get(object.sourceId),
                            object.matrix,
                            object.colorTransform,
                            canvas
                        );

                        if (!stopFlag) {
                            player.play();
                        }

                        // canvas
                        //     .convertToBlob()
                        //     .then((blob) =>
                        //     {
                        //         const dataURL = new FileReaderSync().readAsDataURL(blob);
                        //         console.log(dataURL);
                        //     });

                        const imageBitmap = canvas.transferToImageBitmap();
                        globalThis.postMessage({
                            "sourceId": object.sourceId,
                            "imageBitmap": imageBitmap
                        }, [imageBitmap]);
                    }
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