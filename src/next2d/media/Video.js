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
     * @param {number} [width = 0]
     * @param {number} [height = 0]
     *
     * @constructor
     * @public
     */
    constructor (width = 0, height = 0)
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
         * @type {OffscreenCanvasRenderingContext2D}
         * @default null
         * @private
         */
        this._$context = null;
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
                this._$video.src = URL.createObjectURL(new Blob(
                    [buffer],
                    { "type": "video/mp4" }
                ));
            });

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
        if (this._$video) {
            this._$video.pause();
        }

        // reset
        this._$start       = null;
        this._$update      = null;
        this._$sound       = null;
        this._$video       = null;
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

            const cancelTimer = $cancelAnimationFrame;
            cancelTimer(this._$timerId);
            this._$timerId = -1;

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
        this._$video = $document.createElement("video");

        this._$update = () =>
        {
            const player = Util.$currentPlayer();
            if (!this._$stage) {

                this._$video.pause();

                const cancelTimer = $cancelAnimationFrame;
                cancelTimer(this._$timerId);
                this._$timerId = -1;

                player._$videos.splice(
                    player._$videos.indexOf(this), 1
                );

                return ;
            }

            if (Util.$rendererWorker) {
                this._$postProperty();
            }

            // update
            this._$bytesLoaded = this._$video.currentTime;
            if (this._$video.currentTime) {

                this.dispatchEvent(
                    new VideoEvent(VideoEvent.PROGRESS), false, false,
                    this._$bytesLoaded, this._$bytesTotal
                );

                this._$doChanged();
            }

            const timer = $requestAnimationFrame;
            this._$timerId = timer(this._$update);

        };

        this._$sound = () =>
        {
            const name = Util.$isTouch ? Util.$TOUCH_END : Util.$MOUSE_UP;
            Util.$currentPlayer()
                ._$canvas
                .removeEventListener(name, this._$sound);

            this._$video.muted = false;

        };

        this._$video.muted       = true;
        this._$video.autoplay    = false;
        this._$video.crossOrigin = "anonymous";
        this._$video.type        = "video/mp4";

        if (Util.$isTouch) {
            this._$video.setAttribute("playsinline", "");
        }

        this._$start = () =>
        {
            this._$bounds.xMax = this._$video.videoWidth;
            this._$bounds.yMax = this._$video.videoHeight;
            this._$bytesTotal  = this._$video.duration;

            const player = Util.$currentPlayer();
            if (!Util.$audioContext) {

                const name = Util.$isTouch ? Util.$TOUCH_END : Util.$MOUSE_UP;
                player
                    ._$canvas
                    .addEventListener(name, this._$sound);

            } else {

                this._$video.muted = false;

            }

            if (this._$autoPlay) {

                if (player._$videos.indexOf(this) === -1) {
                    player._$videos.push(this);
                }

                this._$wait = true;
                this._$doChanged();
            }

            if (Util.$rendererWorker) {
                const canvas = new $OffscreenCanvas(
                    this._$video.videoWidth,
                    this._$video.videoHeight
                );
                this._$context = canvas.getContext("2d");
            }

        };
        this._$video.addEventListener("canplaythrough", this._$start);

        this._$video.addEventListener("ended", () =>
        {
            if (this._$loop) {
                this._$video.currentTime = 0;
                return ;
            }

            this.dispatchEvent(
                new VideoEvent(VideoEvent.PLAY_END), false, false,
                this._$bytesLoaded, this._$bytesTotal
            );

            const cancelTimer = $cancelAnimationFrame;
            cancelTimer(this._$timerId);

            this._$timerId = -1;

        });
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

        if (Util.$rendererWorker) {
            this._$createWorkerInstance();
        }
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
     * @param  {CanvasToWebGLContext} context
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
        if (!this._$visible || !this._$video) {
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
            case width === -$Infinity:
            case height === -$Infinity:
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

        let texture = manager.createTextureFromVideo(
            this._$video, this._$smoothing
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
                    -texture.width / 2,
                    -texture.height / 2
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

            context.drawImage(texture,
                0, 0, texture.width, texture.height,
                multiColor
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

    /**
     * @return {void}
     * @method
     * @private
     */
    _$createWorkerInstance ()
    {
        if (this._$created || !this._$stage) {
            return ;
        }
        this._$created = true;

        const message = {
            "command": "createVideo",
            "instanceId": this._$instanceId,
            "smoothing": this._$smoothing,
            "xMin": this._$bounds.xMin,
            "yMin": this._$bounds.yMin,
            "xMax": this._$bounds.xMax,
            "yMax": this._$bounds.yMax
        };

        if (this._$characterId > -1) {
            message.characterId = this._$characterId;
        }

        if (this._$loaderInfo) {
            message.loaderInfoId = this._$loaderInfo._$id;
        }

        if (this._$scale9Grid) {
            message.grid = {
                "x": this._$scale9Grid.x,
                "y": this._$scale9Grid.y,
                "w": this._$scale9Grid.width,
                "h": this._$scale9Grid.height
            };
        }

        Util.$rendererWorker.postMessage(message);
    }

    /**
     * @return {object}
     * @method
     * @private
     */
    _$postProperty ()
    {
        if (!this._$stage) {
            return ;
        }

        if (this._$wait && this._$stage) {

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

        const message = super._$postProperty();
        message.smoothing = this._$smoothing;

        const options = Util.$getArray();
        const context = this._$context;
        if (context) {

            message.xMin = this._$bounds.xMin;
            message.yMin = this._$bounds.yMin;
            message.xMax = this._$bounds.xMax;
            message.yMax = this._$bounds.yMax;

            context.drawImage(this._$video, 0, 0);

            const imageBitmap = context.canvas.transferToImageBitmap();
            message.imageBitmap = imageBitmap;
            options.push(imageBitmap);
        }

        Util.$rendererWorker.postMessage(message, options);

        Util.$poolArray(options);

        this._$posted  = true;
        this._$updated = false;
    }
}
