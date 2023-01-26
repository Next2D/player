/**
 * サーバーまたはローカルに保存された録画済みビデオファイルを再生する Video オブジェクトです。
 * ビデオストリームを再生するには、attachNetStream() を使用して、ビデオを Video オブジェクトに関連付けます。
 * 次に、addChild() を使用して、Video オブジェクトを表示リストに追加します。
 *
 * A Video object that plays a recorded video file stored on a server or locally.
 * To play a video stream, use attachNetStream() to attach the video to the Video object.
 * Then, add the Video object to the display list using addChild().
 *
 * @class
 * @memberOf next2d.media
 * @extends  DisplayObject
 */
class Video extends DisplayObject
{
    /**
     * @param {number} [width = 320]
     * @param {number} [height = 240]
     *
     * @constructor
     * @public
     */
    constructor (width = 320, height = 240)
    {
        super();

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$smoothing = true;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$loop = false;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$autoPlay = true;

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
        this._$start = null;

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
        this._$sound = null;

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

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$stop = true;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$wait = false;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$volume = 1;

        /**
         * @type {Uint8Array}
         * @default null
         * @private
         */
        this._$buffer = null;
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
     * @public
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
        return this._$video ? this._$video.currentTime : 0;
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
        return this._$video ? this._$video.duration : 0;
    }

    /**
     * @description ビデオをループ生成するかどうかを指定します。
     *              Specifies whether or not to generate a video loop.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get loop ()
    {
        return this._$loop;
    }
    set loop (loop)
    {
        this._$loop = loop;
    }

    /**
     * @description ビデオを自動再生するかどうかを指定します。
     *              Specifies whether or not to auto-play the video.
     *
     * @member {boolean}
     * @default true
     * @public
     */
    get autoPlay ()
    {
        return this._$autoPlay;
    }
    set autoPlay (auto_play)
    {
        this._$autoPlay = auto_play;
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
        this._$smoothing = !!smoothing;
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
        if (!this._$video) {

            this._$initializeVideo();

        } else {

            this._$video.removeEventListener("canplaythrough", this._$start);
            this._$video.addEventListener("canplaythrough", this._$start);

        }

        fetch(src)
            .then((response) => response.arrayBuffer())
            .then((buffer) =>
            {
                this._$buffer = new Uint8Array(buffer);
                this._$video.src = URL.createObjectURL(new Blob(
                    [this._$buffer],
                    { "type": "video/mp4" }
                ));
            });

        // this._$video.src = src;
        this._$video.load();
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
        return this._$video ? this._$video.videoHeight : this._$bounds.yMax;
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
        return this._$video ? this._$video.videoWidth : this._$bounds.xMax;
    }

    /**
     * @description ボリュームです。範囲は 0（無音）～ 1（フルボリューム）です。
     *              The volume, ranging from 0 (silent) to 1 (full volume).
     *
     * @member {number}
     * @default 1
     * @public
     */
    get volume ()
    {
        return this._$volume;
    }
    set volume (volume)
    {
        this._$volume = $Math.min(
            SoundMixer.volume,
            Util.$clamp(volume, 0, 1, 1)
        );

        if (this._$video) {
            this._$video.volume = this._$volume;
        }
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
        this._$start       = null;
        this._$update      = null;
        this._$sound       = null;
        this._$video       = null;
        this._$texture     = null;
        this._$bounds.xMax = 0;
        this._$bounds.yMax = 0;

        this._$doChanged();
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
        if (this._$video && !this._$stop) {

            this._$stop = true;
            this._$video.pause();

            const cancelTimer = Util.$cancelAnimationFrame;
            cancelTimer(this._$timerId);
            this._$timerId = -1;

            if (this._$texture) {
                Util.$currentPlayer()
                    ._$context
                    .frameBuffer
                    .releaseTexture(this._$texture);

                this._$texture = null;
            }

            this.dispatchEvent(
                new VideoEvent(VideoEvent.PAUSE), false, false,
                this._$bytesLoaded, this._$bytesTotal
            );

            const player = Util.$currentPlayer();
            player._$videos.splice(
                player._$videos.indexOf(this), 1
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
        if (this._$video && this._$stop) {

            this._$stop = false;

            this._$video.volume = $Math.min(this._$volume, SoundMixer.volume);
            this._$video.play();

            const timer = $requestAnimationFrame;
            this._$timerId = timer(this._$update);

            this.dispatchEvent(
                new VideoEvent(VideoEvent.PLAY), false, false,
                this._$bytesLoaded, this._$bytesTotal
            );

            const player = Util.$currentPlayer();
            if (player._$videos.indexOf(this) === -1) {
                player._$videos.push(this);
            }
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
     * @return {void}
     * @method
     * @private
     */
    _$initializeVideo ()
    {
        this._$video = Util.$document.createElement("video");

        this._$update = function ()
        {
            const player = Util.$currentPlayer();
            if (!this._$stage) {

                this._$video.pause();

                const cancelTimer = Util.$cancelAnimationFrame;
                cancelTimer(this._$timerId);
                this._$timerId = -1;

                if (this._$texture) {

                    const context = player
                        ._$renderer
                        ._$context;

                    context
                        .frameBuffer
                        .releaseTexture(this._$texture);

                    this._$texture = null;
                }

                player._$videos.splice(
                    player._$videos.indexOf(this), 1
                );

                return ;
            }

            // update
            this._$bytesLoaded = this._$video.currentTime;
            if (this._$video.currentTime) {

                const context = player
                    ._$renderer
                    ._$context;

                this._$texture = context
                    .frameBuffer
                    .createTextureFromVideo(
                        this._$video, this._$smoothing, this._$texture
                    );

                this.dispatchEvent(
                    new VideoEvent(VideoEvent.PROGRESS), false, false,
                    this._$bytesLoaded, this._$bytesTotal
                );

                this._$doChanged();
            }

            const timer = $requestAnimationFrame;
            this._$timerId = timer(this._$update);

        }.bind(this);

        this._$sound = function ()
        {
            const name = Util.$isTouch ? Util.$TOUCH_END : Util.$MOUSE_UP;
            Util.$currentPlayer()
                ._$canvas
                .removeEventListener(name, this._$sound);

            this._$video.muted = false;

        }.bind(this);

        this._$video.muted       = true;
        this._$video.autoplay    = false;
        this._$video.crossOrigin = "anonymous";
        this._$video.type        = "video/mp4";

        if (Util.$isTouch) {
            this._$video.setAttribute("playsinline", "");
        }

        this._$start = function ()
        {
            this._$bounds.xMax = this._$video.videoWidth;
            this._$bounds.yMax = this._$video.videoHeight;
            this._$bytesTotal  = this._$video.duration;

            if (!Util.$audioContext) {

                const name = Util.$isTouch ? Util.$TOUCH_END : Util.$MOUSE_UP;
                Util
                    .$currentPlayer()
                    ._$canvas
                    .addEventListener(name, this._$sound);

            } else {

                this._$video.muted = false;

            }

            if (this._$autoPlay) {

                const player = Util.$currentPlayer();
                if (player._$videos.indexOf(this) === -1) {
                    player._$videos.push(this);
                }

                this._$wait = true;
                this._$doChanged();
            }

        }.bind(this);
        this._$video.addEventListener("canplaythrough", this._$start);

        this._$video.addEventListener("ended", function ()
        {
            if (this._$loop) {
                this._$video.currentTime = 0;
                return ;
            }

            this.dispatchEvent(
                new VideoEvent(VideoEvent.PLAY_END), false, false,
                this._$bytesLoaded, this._$bytesTotal
            );

            const cancelTimer = Util.$cancelAnimationFrame;
            cancelTimer(this._$timerId);

            this._$timerId = -1;

        }.bind(this));
    }

    /**
     * @param  {object} character
     * @return {void}
     * @method
     * @private
     */
    _$buildCharacter (character)
    {
        this._$loop     = character.loop;
        this._$autoPlay = character.autoPlay;
        this._$bounds   = character.bounds;

        if (!this._$video) {
            this._$initializeVideo();
        }

        this._$video.src = URL.createObjectURL(new Blob(
            [new Uint8Array(character.buffer)],
            { "type": "video/mp4" }
        ));

        // setup
        this._$video.volume = $Math.min(character.volume, SoundMixer.volume);
        this._$video.load();
    }

    /**
     * @return {object}
     * @method
     * @private
     */
    _$sync ()
    {
        const character = super._$sync();

        if (character) {
            this._$buildCharacter(character);
        }

        return character;
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

        this._$buildCharacter(character);

        return character;
    }

    /**
     * @param   {Renderer} renderer
     * @param   {Float32Array} matrix
     * @returns {void}
     * @method
     * @private
     */
    _$clip (renderer, matrix)
    {
        let width  = this._$bounds.xMax;
        let height = this._$bounds.yMax;
        if (!width || !height) {
            return;
        }

        let multiMatrix = matrix;
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        renderer.clipVideo(width, height, multiMatrix);

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }
    }

    /**
     * @param  {Renderer} renderer
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @return void
     * @method
     * @private
     */
    _$draw (renderer, matrix, color_transform)
    {
        if (!this._$visible) {
            return ;
        }

        if (this._$wait) {

            this._$stop = false;
            this._$video.play();

            this.dispatchEvent(
                new VideoEvent(VideoEvent.PLAY_START), false, false,
                this._$bytesLoaded, this._$bytesTotal
            );

            const timer = $requestAnimationFrame;
            this._$timerId = timer(this._$update);

            this._$wait = false;
        }

        if (!this._$texture) {
            return ;
        }

        let multiColor = color_transform;
        const rawColor = this._$transform._$rawColorTransform();
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
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        // default bounds
        const bounds = Util.$boundsMatrix(this._$bounds, multiMatrix);
        const xMax   = +bounds.xMax;
        const xMin   = +bounds.xMin;
        const yMax   = +bounds.yMax;
        const yMin   = +bounds.yMin;
        Util.$poolBoundsObject(bounds);

        let width  = $Math.ceil($Math.abs(xMax - xMin));
        let height = $Math.ceil($Math.abs(yMax - yMin));
        switch (true) {

            case width === 0:
            case height === 0:
            case width === -Util.$Infinity:
            case height === -Util.$Infinity:
            case width === Util.$Infinity:
            case height === Util.$Infinity:
                return;

            default:
                break;

        }

        // cache current buffer
        const currentAttachment = renderer.currentAttachment;
        if (xMin > currentAttachment.width || yMin > currentAttachment.height) {
            return;
        }

        let xScale = +$Math.sqrt(
            multiMatrix[0] * multiMatrix[0]
            + multiMatrix[1] * multiMatrix[1]
        );

        let yScale = +$Math.sqrt(
            multiMatrix[2] * multiMatrix[2]
            + multiMatrix[3] * multiMatrix[3]
        );

        const filters = this._$filters   || this.filters;
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

        const context = renderer._$context;

        let texture = this._$texture;
        const blendMode = this._$blendMode || this.blendMode;
        if (filters && filters.length && this._$canApply(filters)) {

            let targetTexture = this._$texture;
            if (xScale !== 1 || yScale !== 1) {

                const currentAttachment = context
                    .frameBuffer
                    .currentAttachment;

                const attachment = context
                    .frameBuffer
                    .createCacheAttachment(
                        targetTexture.width  * xScale,
                        targetTexture.height * yScale
                    );

                context._$bind(attachment);

                // reset
                Util.$resetContext(context);
                context.setTransform(xScale, 0, 0, yScale, 0, 0);
                context.drawImage(this._$texture,
                    0, 0, this._$texture.width, this._$texture.height
                );

                // execute
                targetTexture = context
                    .frameBuffer
                    .getTextureFromCurrentAttachment();

                context._$bind(currentAttachment);
                context
                    .frameBuffer
                    .releaseAttachment(attachment, false);

            }

            // draw filter
            texture = this._$drawFilter(
                context, targetTexture, multiMatrix,
                filters, width, height
            );

            // reset
            Util.$resetContext(context);

            // draw
            context._$globalAlpha = alpha;
            context._$imageSmoothingEnabled = this._$smoothing;
            context._$globalCompositeOperation = blendMode;

            // size
            const bounds = Util.$boundsMatrix(this._$bounds, multiMatrix);
            context.setTransform(1, 0, 0, 1,
                bounds.xMin - texture._$offsetX,
                bounds.yMin - texture._$offsetY
            );
            context.drawImage(texture,
                0, 0, texture.width, texture.height,
                multiColor
            );

            // pool
            Util.$poolBoundsObject(bounds);

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

            context.drawImage(
                texture, 0, 0,
                texture.width, texture.height, multiColor
            );
        }

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }

        if (multiColor !== color_transform) {
            Util.$poolFloat32Array8(multiColor);
        }
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
     * @return {boolean}
     * @method
     * @private
     */
    _$hit (context, matrix, options)
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

        const width  = $Math.ceil($Math.abs(xMax - xMin));
        const height = $Math.ceil($Math.abs(yMax - yMin));

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
