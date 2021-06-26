/**
 * @class
 * @memberOf next2d.media
 * @extends  DisplayObject
 */
class Video extends DisplayObject
{
    /**
     * サーバーまたはローカルに保存された録画済みビデオファイルを再生する Video オブジェクトです。
     * ビデオストリームを再生するには、attachNetStream() を使用して、ビデオを Video オブジェクトに関連付けます。
     * 次に、addChild() を使用して、Video オブジェクトを表示リストに追加します。
     *
     * A Video object that plays a recorded video file stored on a server or locally.
     * To play a video stream, use attachNetStream() to attach the video to the Video object.
     * Then, add the Video object to the display list using addChild().
     *
     * @param {number} [width = 320]
     * @param {number} [height = 240]
     *
     * @constructor
     * @public
     */
    constructor(width = 320, height = 240)
    {
        super();

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$smoothing = true;

        /**
         * @type {object}
         * @private
         */
        this._$bounds = Util.$getBoundsObject(0, width, 0, height);

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$bytesLoaded = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$bytesTotal = 0;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$timerId = -1;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$update = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$start = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$sound = null;

        /**
         * @type {SoundTransform}
         * @default null
         * @private
         */
        this._$soundTransform = null;

        /**
         * @type {HTMLVideoElement}
         * @default null
         * @private
         */
        this._$video = null;

        /**
         * @type {WebGLTexture}
         * @default null
         * @private
         */
        this._$texture = null;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Video]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class Video]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.media.Video
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.media.Video";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Video]
     * @method
     * @public
     */
    toString ()
    {
        return "[object Video]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.media.Video
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.media.Video";
    }

    /**
     * @description 既にアプリケーションにロードされているデータのバイト数です。
     *              The number of bytes of data that have been loaded into the application.
     *
     * @member {number}
     * @default 0
     * @readonly
     * @public
     */
    get bytesLoaded ()
    {
        return this._$bytesLoaded;
    }

    /**
     * @description アプリケーションにロードされるファイルの総バイト数。
     *              The total size in bytes of the file being loaded into the application.
     *
     * @member {number}
     * @default 0
     * @readonly
     * @public
     */
    get bytesTotal ()
    {
        return this._$bytesTotal;
    }

    /**
     * @description 現在のキーフレーム
     *              Current keyframe
     *
     *
     * @member {number}
     * @readonly
     * @public
     */
    get currentTime ()
    {
        return (this._$video) ? this._$video.currentTime : 0;
    }

    /**
     * @description キーフレーム総数
     *              Total number of keyframes
     *
     * @member {number}
     * @readonly
     * @public
     */
    get duration ()
    {
        return (this._$video) ? this._$video.duration : 0;
    }

    /**
     * @description ビデオを拡大 / 縮小する際にスムージング（補間）するかどうかを指定します。
     *              Specifies whether the video should be smoothed (interpolated)
     *              when it is scaled.
     *
     * @member {boolean}
     * @default true
     * @public
     */
    get smoothing ()
    {
        return this._$smoothing;
    }
    set smoothing (smoothing)
    {
        this._$smoothing = smoothing;
    }

    /**
     * @description オブジェクトのサウンドを制御します。
     *              Controls sound in this object.
     *
     * @member {SoundTransform}
     * @public
     */
    get soundTransform ()
    {
        if (!this._$soundTransform) {
            this._$soundTransform = new SoundTransform();
        }
        return this._$soundTransform;
    }
    set soundTransform (sound_transform)
    {
        this._$soundTransform = sound_transform;
    }

    /**
     * @description 映像コンテンツへの URL を指定します。
     *              Specifies the URL to the video content.
     *
     * @member {string}
     * @default ""
     * @public
     */
    get src ()
    {
        return this._$video ? this._$video.src : "";
    }
    set src (src)
    {
        if (this._$video) {
            this._$video = document.createElement("video");
        }
        this._$video.src = src;
    }

    /**
     * @description ビデオストリームの高さをピクセル単位で指定する整数です。
     *              An integer specifying the height of the video stream, in pixels.
     *
     * @member {number}
     * @default 320
     * @readonly
     * @public
     */
    get videoHeight ()
    {
        return this._$bounds.yMax;
    }

    /**
     * @description ビデオストリームの幅をピクセル単位で指定する整数です。
     *              An integer specifying the width of the video stream, in pixels.
     *
     * @member {number}
     * @default 240
     * @readonly
     * @public
     */
    get videoWidth ()
    {
        return this._$bounds.xMax;
    }

    /**
     * @description Video オブジェクトに現在表示されているイメージ（ビデオストリームではない）をクリアします。
     *              Clears the image currently displayed
     *              in the Video object (not the video stream).
     *
     * @return {void}
     * @method
     * @public
     */
    clear ()
    {
        if (this._$texture) {
            Util.$currentPlayer()
                ._$context
                .frameBuffer
                .releaseTexture(this._$texture);
        }

        if (this._$video) {
            this._$video.pause();
        }

        // reset
        this._$update      = null;
        this._$start       = null;
        this._$sound       = null;
        this._$video       = null;
        this._$texture     = null;
        this._$bounds.xMax = 0;
        this._$bounds.yMax = 0;
    }

    /**
     * @description ビデオストリームの再生を一時停止します。
     *              Pauses playback of a video stream.
     *
     * @return {void}
     * @method
     * @public
     */
    pause ()
    {
        if (this._$video) {
            this._$video.pause();

            const cancelTimer = Util.$cancelAnimationFrame;
            cancelTimer(this._$timerId);

            this.dispatchEvent(
                new VideoEvent(VideoEvent.PAUSE), false, false,
                this._$bytesLoaded, this._$bytesTotal
            );
        }
    }

    /**
     * @description ローカルディレクトリまたは Web サーバーからメディアファイルを再生します。
     *              Plays a media file from a local directory or a web server;
     *
     * @returns {void}
     * @method
     * @public
     */
    play ()
    {
        if (this._$video) {

            this._$video.play();

            const timer = Util.$requestAnimationFrame;
            this._$timerId = timer(this._$update);

            this.dispatchEvent(
                new VideoEvent(VideoEvent.PLAY), false, false,
                this._$bytesLoaded, this._$bytesTotal
            );
        }
    }

    /**
     * @description 指定された位置に最も近いキーフレームをシークします。
     *              Seeks the keyframe closest to the specified location.
     *
     * @param  {number} offset
     * @return {void}
     * @method
     * @public
     */
    seek (offset)
    {
        if (this._$video) {
            this._$video.currentTime = offset;

            this.dispatchEvent(
                new VideoEvent(VideoEvent.SEEK), false, false,
                this._$bytesLoaded, this._$bytesTotal
            );
        }
    }

    /**
     * @param  {object} tag
     * @param  {DisplayObjectContainer} parent
     * @return {object}
     * @method
     * @private
     */
    _$build (tag, parent)
    {
        const character = super._$build(tag, parent);

        if (!this._$video) {
            this._$video = Util.$document.createElement("video");
        }

        if (!this._$update) {

            this._$update = function ()
            {
                const player = Util.$currentPlayer();
                player._$draw(0);

                // update
                this._$bytesLoaded = this._$video.currentTime;

                if (this._$video.currentTime) {

                    this._$texture = player._$context
                        .frameBuffer
                        .createTextureFromVideo(
                            this._$video, this._$smoothing, this._$texture
                        );

                    this.dispatchEvent(
                        new VideoEvent(VideoEvent.PAUSE), false, false,
                        this._$bytesLoaded, this._$bytesTotal
                    );

                    this._$doChanged();
                }

                // end
                if (this._$video.currentTime >= this._$video.duration) {

                    const cancelTimer = Util.$cancelAnimationFrame;
                    cancelTimer(this._$timerId);
                    this._$timerId = -1;

                    this.dispatchEvent(
                        new VideoEvent(VideoEvent.PLAY_END), false, false,
                        this._$bytesLoaded, this._$bytesTotal
                    );

                    return ;
                }

                const timer = Util.$requestAnimationFrame;
                this._$timerId = timer(this._$update);

            }.bind(this);

        }

        // add sound event
        if (!this._$sound) {
            this._$sound = function ()
            {
                const name = (Util.$isTouch) ? Util.$TOUCH_END : Util.$MOUSE_UP;
                Util.$currentPlayer()
                    ._$canvas
                    .removeEventListener(name, this._$sound);
                this._$video.muted = false;
            }.bind(this);
        }


        if (!this._$start) {

            // start event
            this._$start = function ()
            {
                this._$video.removeEventListener("canplaythrough", this._$start);
                this._$video.play();

                this._$bounds.xMax = this._$video.videoWidth;
                this._$bounds.yMax = this._$video.videoHeight;

                // set total
                this._$bytesTotal = this._$video.duration;

                const timer = Util.$requestAnimationFrame;
                this._$timerId = timer(this._$update);

                const name = (Util.$isTouch) ? Util.$TOUCH_END : Util.$MOUSE_UP;
                Util
                    .$currentPlayer()
                    ._$canvas
                    .addEventListener(name, this._$sound);

                this.dispatchEvent(
                    new VideoEvent(VideoEvent.PLAY_START), false, false,
                    this._$bytesLoaded, this._$bytesTotal
                );

            }.bind(this);

        }
        this._$video.addEventListener("canplaythrough", this._$start);


        // auto play setup
        this._$video.muted    = true;
        this._$video.autoplay = false;
        if (Util.$isTouch) {
            this._$video.setAttribute("playsinline", "");
        }

        // load start
        this._$video.crossOrigin = "anonymous";
        this._$video.type = "video/mp4";

        this._$video.src = URL.createObjectURL(new Blob(
            [new Uint8Array(character.buffer)],
            { "type": "video/mp4" }
        ));

        this._$video.load();
    };

    /**
     * @param   {CanvasToWebGLContext} context
     * @param   {Float32Array} matrix
     * @returns {void}
     * @method
     * @private
     */
    _$clip (context, matrix)
    {
        let width  = this._$bounds.xMax;
        let height = this._$bounds.yMax;
        if (!width || !height) {
            return;
        }

        let multiMatrix = matrix;
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix !== Util.$MATRIX_ARRAY_IDENTITY) {
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
     * @return void
     * @method
     * @private
     */
    _$draw (context, matrix, color_transform)
    {
        if (!this._$visible) {
            return ;
        }

        if (!this._$texture) {
            return ;
        }

        let multiColor = color_transform;
        const rawColor = this._$transform._$rawColorTransform();
        if (rawColor !== Util.$COLOR_ARRAY_IDENTITY) {
            multiColor = Util.$multiplicationColor(color_transform, rawColor);
        }

        const alpha = Util.$clamp(multiColor[3] + (multiColor[7] / 255), 0, 1, 0);
        if (!alpha) {
            if (multiColor !== color_transform) {
                Util.$poolFloat32Array8(multiColor);
            }
            return ;
        }

        let multiMatrix = matrix;
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix !== Util.$MATRIX_ARRAY_IDENTITY) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        // default bounds
        const bounds = Util.$boundsMatrix(this._$bounds, multiMatrix);
        const xMax   = +bounds.xMax;
        const xMin   = +bounds.xMin;
        const yMax   = +bounds.yMax;
        const yMin   = +bounds.yMin;
        Util.$poolBoundsObject(bounds);

        let width  = Util.$ceil(Util.$abs(xMax - xMin));
        let height = Util.$ceil(Util.$abs(yMax - yMin));
        if (!width || !height) {
            return;
        }

        // draw
        Util.$resetContext(context);
        context._$globalAlpha = alpha;
        context._$imageSmoothingEnabled = this._$smoothing;

        context.setTransform(
            multiMatrix[0], multiMatrix[1], multiMatrix[2],
            multiMatrix[3], multiMatrix[4], multiMatrix[5]
        );
        context.drawImage(this._$texture,
            0, 0, this._$texture.width, this._$texture.height, multiColor
        );

    }

    /**
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {object} options
     * @return {boolean}
     * @method
     * @private
     */
    _$mouseHit (context, matrix, options)
    {
        if (!this._$visible) {
            return false;
        }

        return this._$hit(context, matrix, options);
    }

    /**
     * @param  {CanvasRenderingContext2D} context
     * @param  {array}   matrix
     * @param  {object}  options
     * @param  {boolean} [is_clip=false]
     * @return {boolean}
     * @method
     * @private
     */
    _$hit (context, matrix, options, is_clip)
    {
        let multiMatrix = matrix;
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix !== Util.$MATRIX_ARRAY_IDENTITY) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        const baseBounds = this._$getBounds(null);

        const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
        const xMax   = +bounds.xMax;
        const xMin   = +bounds.xMin;
        const yMax   = +bounds.yMax;
        const yMin   = +bounds.yMin;
        Util.$poolBoundsObject(bounds);
        Util.$poolBoundsObject(baseBounds);

        const width  = Util.$ceil(Util.$abs(xMax - xMin));
        const height = Util.$ceil(Util.$abs(yMax - yMin));

        context.setTransform(1, 0, 0, 1, xMin, yMin);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(width, 0);
        context.lineTo(width, height);
        context.lineTo(0, height);
        context.lineTo(0, 0);

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }

        return context.isPointInPath(options.x, options.y);
    }

    /**
     * @param  {Float32Array} [matrix=null]
     * @return {object}
     * @method
     * @private
     */
    _$getBounds (matrix = null)
    {
        if (matrix) {

            let multiMatrix = matrix;
            const rawMatrix = this._$transform._$rawMatrix();
            if (rawMatrix !== Util.$MATRIX_ARRAY_IDENTITY) {
                multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
            }

            const bounds = Util.$boundsMatrix(this._$bounds, multiMatrix);

            if (multiMatrix !== matrix) {
                Util.$poolFloat32Array6(multiMatrix);
            }

            return bounds;
        }

        return Util.$getBoundsObject(
            this._$bounds.xMin, this._$bounds.xMax,
            this._$bounds.yMin, this._$bounds.yMax
        );
    }
}