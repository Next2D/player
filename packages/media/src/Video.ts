import { SoundMixer } from "./SoundMixer";
import { DisplayObject } from "@next2d/display";
import { VideoEvent } from "@next2d/events";
import type { Player } from "@next2d/core";
import type {
    BoundsImpl,
    VideoCharacterImpl,
    DictionaryTagImpl,
    ParentImpl,
    AttachmentImpl,
    FilterArrayImpl,
    BlendModeImpl,
    PlayerHitObjectImpl,
    PropertyVideoMessageImpl,
    Character,
    CachePositionImpl
} from "@next2d/interface";
import type {
    CanvasToWebGLContext,
    FrameBufferManager
} from "@next2d/webgl";
import {
    $document,
    $audioContext,
    $currentPlayer,
    $isTouch,
    $rendererWorker
} from "@next2d/util";
import {
    $Math,
    $cancelAnimationFrame,
    $requestAnimationFrame,
    $getBoundsObject,
    $boundsMatrix,
    $clamp,
    $multiplicationMatrix,
    $poolFloat32Array6,
    $MATRIX_ARRAY_IDENTITY,
    $OffscreenCanvas,
    $multiplicationColor,
    $poolFloat32Array8,
    $Infinity,
    $poolBoundsObject,
    $getArray,
    $Number,
    $poolArray,
    $cacheStore,
    $getFloat32Array6
} from "@next2d/share";

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
export class Video extends DisplayObject
{
    private _$smoothing: boolean;
    private _$loop: boolean;
    private _$autoPlay: boolean;
    private readonly _$bounds: BoundsImpl;
    private _$bytesLoaded: number;
    private _$bytesTotal: number;
    private _$timerId: number;
    public _$video: HTMLVideoElement | null;
    private _$stop: boolean;
    private _$volume: number;
    private _$ready: boolean;
    private _$context: OffscreenCanvasRenderingContext2D | null;
    private _$cacheKeys: string[];
    private readonly _$cacheParams: number[];

    /**
     * @param {number} [width = 0]
     * @param {number} [height = 0]
     *
     * @constructor
     * @public
     */
    constructor (width: number = 0, height: number = 0)
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
        this._$bounds = $getBoundsObject(0, width, 0, height);

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
        this._$ready = false;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$volume = 1;

        /**
         * @type {CanvasRenderingContext2D}
         * @default null
         * @private
         */
        this._$context = null;

        /**
         * @type {array}
         * @private
         */
        this._$cacheKeys = $getArray();

        /**
         * @type {array}
         * @private
         */
        this._$cacheParams = $getArray(0, 0, 0);
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
    static toString (): string
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
    static get namespace (): string
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
    toString (): string
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
    get namespace (): string
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
    get bytesLoaded (): number
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
    get bytesTotal (): number
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
    get currentTime (): number
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
    get duration (): number
    {
        return this._$video ? this._$video.duration : 0;
    }

    /**
     * @description ビデオをループ生成するかどうかを指定します。
     *              Specifies whether to generate a video loop.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get loop (): boolean
    {
        return this._$loop;
    }
    set loop (loop: boolean)
    {
        this._$loop = !!loop;
    }

    /**
     * @description ビデオの自動再生の設定。
     *              Setting up automatic video playback.
     *
     * @member {boolean}
     * @default true
     * @public
     */
    get autoPlay (): boolean
    {
        return this._$autoPlay;
    }
    set autoPlay (auto_play: boolean)
    {
        this._$autoPlay = !!auto_play;
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
    get smoothing (): boolean
    {
        return this._$smoothing;
    }
    set smoothing (smoothing: boolean)
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
    get src (): string
    {
        return this._$video ? this._$video.src : "";
    }
    set src (src: string)
    {
        if (!this._$video) {
            this._$video = this._$initializeVideo();
        }

        this._$video.src = src;
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
    get videoHeight (): number
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
    get videoWidth (): number
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
    get volume (): number
    {
        return this._$volume;
    }
    set volume (volume: number)
    {
        this._$volume = $clamp($Math.min(
            SoundMixer.volume,
            volume
        ), 0, 1, 1);

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
    clear (): void
    {
        if (this._$video) {
            this._$video.pause();
        }

        // reset
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
    pause (): void
    {
        if (this._$video && !this._$stop) {

            this._$stop = true;
            this._$video.pause();

            $cancelAnimationFrame(this._$timerId);
            this._$timerId = -1;

            if (this.hasEventListener(VideoEvent.PAUSE)) {
                this.dispatchEvent(new VideoEvent(
                    VideoEvent.PAUSE, false, false,
                    this._$bytesLoaded, this._$bytesTotal
                ));
            }

            const player: Player = $currentPlayer();
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
    play (): void
    {
        if (this._$video && this._$stop) {

            this._$stop = false;

            this._$video.volume = $Math.min(this._$volume, SoundMixer.volume);
            this
                ._$video
                .play()
                .then(() =>
                {
                    this._$timerId = $requestAnimationFrame(() =>
                    {
                        this._$update();
                    });

                    if (this.hasEventListener(VideoEvent.PLAY)) {
                        this.dispatchEvent(new VideoEvent(
                            VideoEvent.PLAY, false, false,
                            this._$bytesLoaded, this._$bytesTotal
                        ));
                    }

                    const player = $currentPlayer();
                    if (player._$videos.indexOf(this) === -1) {
                        player._$videos.push(this);
                    }

                    this._$ready = true;
                });
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
    seek (offset: number): void
    {
        if (this._$video) {
            this._$video.currentTime = offset;

            if (this.hasEventListener(VideoEvent.SEEK)) {
                this.dispatchEvent(new VideoEvent(
                    VideoEvent.SEEK, false, false,
                    this._$bytesLoaded, this._$bytesTotal
                ));
            }
        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$update (): void
    {
        const player: Player = $currentPlayer();
        if (!this.stage || !this._$video) {

            if (this._$video) {
                this._$video.pause();
            }

            $cancelAnimationFrame(this._$timerId);
            this._$timerId = -1;

            player._$videos.splice(
                player._$videos.indexOf(this), 1
            );

            return ;
        }

        if ($rendererWorker) {
            this._$postProperty();
        }

        // update
        this._$bytesLoaded = this._$video.currentTime;
        if (this._$video.currentTime) {

            if (this.hasEventListener(VideoEvent.PROGRESS)) {
                this.dispatchEvent(new VideoEvent(
                    VideoEvent.PROGRESS, false, false,
                    this._$bytesLoaded, this._$bytesTotal
                ));
            }

            this._$doChanged();
        }

        this._$timerId = $requestAnimationFrame(() =>
        {
            this._$update();
        });
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$start ()
    {
        if (!this._$video) {
            return ;
        }

        this._$bounds.xMax = this._$video.videoWidth;
        this._$bounds.yMax = this._$video.videoHeight;
        this._$bytesTotal  = this._$video.duration;

        const player = $currentPlayer();
        if (this._$autoPlay) {

            this._$stop = false;
            this
                ._$video
                .play()
                .then(() =>
                {
                    if (player._$videos.indexOf(this) === -1) {
                        player._$videos.push(this);
                    }

                    if (this.hasEventListener(VideoEvent.PLAY_START)) {
                        this.dispatchEvent(new VideoEvent(
                            VideoEvent.PLAY_START, false, false,
                            this._$bytesLoaded, this._$bytesTotal
                        ));
                    }

                    this._$timerId = $requestAnimationFrame(() =>
                    {
                        this._$update();
                    });

                    this._$ready = true;

                    this._$doChanged();
                });
        }

        this._$createContext();
    }

    /**
     * @return {HTMLVideoElement}
     * @method
     * @private
     */
    _$initializeVideo (): HTMLVideoElement
    {
        // clear cache key
        this._$cacheKeys.length = 0;

        const video = $document.createElement("video");

        video.autoplay    = false;
        video.crossOrigin = "anonymous";

        if (!$audioContext) {
            video.muted = true;
        }

        if ($isTouch) {
            video.setAttribute("playsinline", "");
        }

        video.addEventListener("canplaythrough", () =>
        {
            this._$start();
        });

        video.addEventListener("ended", () =>
        {
            if (this._$loop) {
                video.currentTime = 0;
                return ;
            }

            if (this.hasEventListener(VideoEvent.PLAY_END)) {
                this.dispatchEvent(new VideoEvent(
                    VideoEvent.PLAY_END, false, false,
                    this._$bytesLoaded, this._$bytesTotal
                ));
            }

            $cancelAnimationFrame(this._$timerId);

            this._$timerId = -1;

        });

        return video;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$createContext (): void
    {
        if ($rendererWorker) {
            const canvas = new $OffscreenCanvas(
                this._$bounds.xMax,
                this._$bounds.yMax
            );
            this._$context = canvas.getContext("2d");
        }
    }

    /**
     * @param  {object} character
     * @return {void}
     * @method
     * @private
     */
    _$buildCharacter (character: Character<VideoCharacterImpl>): void
    {
        if (character.buffer && !character._$buffer) {
            character._$buffer = new Uint8Array(character.buffer);
            character.buffer = null;
        }

        this._$loop        = character.loop;
        this._$autoPlay    = character.autoPlay;
        this._$bounds.xMin = character.bounds.xMin;
        this._$bounds.yMin = character.bounds.yMin;
        this._$bounds.xMax = character.bounds.xMax;
        this._$bounds.yMax = character.bounds.yMax;

        if (!this._$video) {
            this._$video = this._$initializeVideo();
        }

        this._$video.src = URL.createObjectURL(new Blob(
            [character._$buffer],
            { "type": "video/mp4" }
        ));

        // setup
        this._$video.volume = $Math.min(character.volume, SoundMixer.volume);
        this._$video.load();

        if ($rendererWorker && this._$stage) {
            this._$createWorkerInstance();
        }
    }

    /**
     * @param  {object} character
     * @return {void}
     * @method
     * @private
     */
    _$sync (character: VideoCharacterImpl): void
    {
        this._$buildCharacter(character);
    }

    /**
     * @param  {object} tag
     * @param  {DisplayObjectContainer} parent
     * @return {object}
     * @method
     * @private
     */
    _$build (
        tag: DictionaryTagImpl,
        parent: ParentImpl<any>
    ): VideoCharacterImpl {

        const character: VideoCharacterImpl = this._$baseBuild<VideoCharacterImpl>(tag, parent);

        this._$buildCharacter(character);

        return character;
    }

    /**
     * @param   {CanvasToWebGLContext} context
     * @param   {Float32Array} matrix
     * @returns {void}
     * @method
     * @private
     */
    _$clip (context: CanvasToWebGLContext, matrix: Float32Array): void
    {
        const width: number  = this._$bounds.xMax;
        const height: number = this._$bounds.yMax;
        if (!width || !height) {
            return;
        }

        let multiMatrix: Float32Array = matrix;
        const rawMatrix: Float32Array = this._$transform._$rawMatrix();
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        context.reset();
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
        context.clip();

        if (multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
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
    _$draw (
        context: CanvasToWebGLContext,
        matrix: Float32Array,
        color_transform: Float32Array
    ): void {

        if (!this._$visible || !this._$video || !this._$ready) {
            return ;
        }

        let multiColor: Float32Array = color_transform;
        const rawColor: Float32Array = this._$transform._$rawColorTransform();
        if (rawColor[0] !== 1 || rawColor[1] !== 1
            || rawColor[2] !== 1 || rawColor[3] !== 1
            || rawColor[4] !== 0 || rawColor[5] !== 0
            || rawColor[6] !== 0 || rawColor[7] !== 0
        ) {
            multiColor = $multiplicationColor(color_transform, rawColor);
        }

        const alpha: number = $clamp(multiColor[3] + multiColor[7] / 255, 0, 1, 0);
        if (!alpha) {
            if (multiColor !== color_transform) {
                $poolFloat32Array8(multiColor);
            }
            return ;
        }

        let multiMatrix: Float32Array = matrix;
        const rawMatrix: Float32Array = this._$transform._$rawMatrix();
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        // default bounds
        const bounds: BoundsImpl = $boundsMatrix(this._$bounds, multiMatrix);
        const xMax   = +bounds.xMax;
        const xMin   = +bounds.xMin;
        const yMax   = +bounds.yMax;
        const yMin   = +bounds.yMin;
        $poolBoundsObject(bounds);

        const width: number  = $Math.ceil($Math.abs(xMax - xMin));
        const height: number = $Math.ceil($Math.abs(yMax - yMin));
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

        let xScale: number = +$Math.sqrt(
            multiMatrix[0] * multiMatrix[0]
            + multiMatrix[1] * multiMatrix[1]
        );
        if (!$Number.isInteger(xScale)) {
            const value: string = xScale.toString();
            const index: number = value.indexOf("e");
            if (index !== -1) {
                xScale = +value.slice(0, index);
            }
            xScale = +xScale.toFixed(4);
        }

        let yScale: number = +$Math.sqrt(
            multiMatrix[2] * multiMatrix[2]
            + multiMatrix[3] * multiMatrix[3]
        );
        if (!$Number.isInteger(yScale)) {
            const value: string = yScale.toString();
            const index: number = value.indexOf("e");
            if (index !== -1) {
                yScale = +value.slice(0, index);
            }
            yScale = +yScale.toFixed(4);
        }

        const filters: FilterArrayImpl = this._$filters || this.filters;
        const canApply: boolean = filters && filters.length > 0 && this._$canApply(filters);

        let filterBounds: BoundsImpl = $getBoundsObject(0, width, 0, height);
        if (canApply) {
            for (let idx: number = 0; idx < filters.length ; ++idx) {
                filterBounds = filters[idx]
                    ._$generateFilterRect(filterBounds, xScale, yScale);
            }
        }

        // cache current buffer
        const manager: FrameBufferManager = context.frameBuffer;
        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;
        if (!currentAttachment
            || xMin - filterBounds.xMin > currentAttachment.width
            || yMin - filterBounds.yMin > currentAttachment.height
        ) {
            $poolBoundsObject(filterBounds);
            return;
        }

        if (0 > xMin + filterBounds.xMax || 0 > yMin + filterBounds.yMax) {
            $poolBoundsObject(filterBounds);
            return;
        }
        $poolBoundsObject(filterBounds);

        if (!this._$cacheKeys.length
            || this._$cacheParams[0] !== xScale
            || this._$cacheParams[1] !== yScale
            || this._$cacheParams[2] !== color_transform[7]
        ) {
            const keys: number[] = $getArray();
            keys[0] = xScale;
            keys[1] = yScale;

            this._$cacheKeys = $cacheStore.generateKeys(
                this._$instanceId, keys, color_transform
            );

            $poolArray(keys);

            this._$cacheParams[0] = xScale;
            this._$cacheParams[1] = yScale;
            this._$cacheParams[2] = color_transform[7];
        }

        const blendMode: BlendModeImpl = this._$blendMode || this.blendMode;
        context.cachePosition = $cacheStore.get(this._$cacheKeys);
        if (!context.cachePosition) {

            const width: number  = $Math.ceil($Math.abs(this._$bounds.xMax - this._$bounds.xMin));
            const height: number = $Math.ceil($Math.abs(this._$bounds.yMax - this._$bounds.yMin));

            const position: CachePositionImpl = manager
                .createCachePosition(width, height);

            context.cachePosition = position;
            $cacheStore.set(this._$cacheKeys, position);
        }

        const texture: WebGLTexture = manager.createTextureFromVideo(
            this._$video, this._$smoothing
        );

        let offsetX: number = 0;
        let offsetY: number = 0;
        if (canApply) {

            const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

            const attachment: AttachmentImpl = manager
                .createCacheAttachment(width, height);

            context._$bind(attachment);

            context.reset();

            const parentMatrix: Float32Array = $getFloat32Array6(
                xScale, 0, 0, yScale,
                width / 2, height / 2
            );

            const baseMatrix: Float32Array = $getFloat32Array6(
                1, 0, 0, 1,
                -texture.width / 2,
                -texture.height / 2
            );

            const scaleMatrix = $multiplicationMatrix(
                parentMatrix, baseMatrix
            );
            $poolFloat32Array6(parentMatrix);
            $poolFloat32Array6(baseMatrix);

            context.setTransform(
                scaleMatrix[0], scaleMatrix[1],
                scaleMatrix[2], scaleMatrix[3],
                scaleMatrix[4], scaleMatrix[5]
            );

            context.drawImage(texture, 0, 0, texture.width, texture.height);

            const videoTexture: WebGLTexture = manager.getTextureFromCurrentAttachment();
            context._$bind(currentAttachment);

            manager.releaseAttachment(attachment);

            // release
            context.drawTextureFromRect(texture, context.cachePosition);

            const position: CachePositionImpl = this._$drawFilter(
                context, multiMatrix, filters,
                width, height, videoTexture
            );

            if (position.offsetX) {
                offsetX = position.offsetX;
            }

            if (position.offsetY) {
                offsetY = position.offsetY;
            }

            // update
            context.cachePosition = position;

            context.setTransform(1, 0, 0, 1,
                xMin - offsetX, yMin - offsetY
            );

        } else {

            context.drawTextureFromRect(texture, context.cachePosition);

            context.setTransform(
                multiMatrix[0], multiMatrix[1], multiMatrix[2],
                multiMatrix[3], multiMatrix[4], multiMatrix[5]
            );

        }

        // draw
        if (context.cachePosition) {

            context.globalAlpha = alpha;
            context.imageSmoothingEnabled = true;
            context.globalCompositeOperation = blendMode;

            context.drawInstance(
                xMin - offsetX, yMin - offsetY, xMax, yMax,
                color_transform
            );

            // cache position clear
            context.cachePosition = null;
        }

        // pool
        if (multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
        }

        if (multiColor !== color_transform) {
            $poolFloat32Array8(multiColor);
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
    _$mouseHit (
        context: CanvasRenderingContext2D,
        matrix: Float32Array,
        options: PlayerHitObjectImpl
    ): boolean {

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
    _$hit (
        context: CanvasRenderingContext2D,
        matrix: Float32Array,
        options: PlayerHitObjectImpl
    ): boolean {

        let multiMatrix: Float32Array = matrix;
        const rawMatrix: Float32Array = this._$transform._$rawMatrix();
        if (rawMatrix !== $MATRIX_ARRAY_IDENTITY) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        const baseBounds: BoundsImpl = this._$getBounds(null);

        const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
        const xMax   = +bounds.xMax;
        const xMin   = +bounds.xMin;
        const yMax   = +bounds.yMax;
        const yMin   = +bounds.yMin;
        $poolBoundsObject(bounds);
        $poolBoundsObject(baseBounds);

        const width: number  = $Math.ceil($Math.abs(xMax - xMin));
        const height: number = $Math.ceil($Math.abs(yMax - yMin));

        context.setTransform(1, 0, 0, 1, xMin, yMin);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(width, 0);
        context.lineTo(width, height);
        context.lineTo(0, height);
        context.lineTo(0, 0);

        if (multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
        }

        return context.isPointInPath(options.x, options.y);
    }

    /**
     * @param  {Float32Array} [matrix=null]
     * @return {object}
     * @method
     * @private
     */
    _$getBounds (matrix: Float32Array | null = null): BoundsImpl
    {
        if (matrix) {

            let multiMatrix: Float32Array = matrix;
            const rawMatrix: Float32Array = this._$transform._$rawMatrix();
            if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
                || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
                || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
            ) {
                multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
            }

            const bounds: BoundsImpl = $boundsMatrix(this._$bounds, multiMatrix);
            if (multiMatrix !== matrix) {
                $poolFloat32Array6(multiMatrix);
            }

            return bounds;
        }

        return $getBoundsObject(
            this._$bounds.xMin, this._$bounds.xMax,
            this._$bounds.yMin, this._$bounds.yMax
        );
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$createWorkerInstance (): void
    {
        if (!$rendererWorker || this._$created) {
            return ;
        }
        this._$created = true;

        const message: PropertyVideoMessageImpl = {
            "command": "createVideo",
            "buffer": new Float32Array(),
            "instanceId": this._$instanceId,
            "parentId": this._$parent ? this._$parent._$instanceId : -1,
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

        $rendererWorker.postMessage(message);
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$postProperty (): void
    {
        if (!$rendererWorker) {
            return ;
        }

        const message: PropertyVideoMessageImpl = this._$createMessage();
        message.smoothing = this._$smoothing;

        const options = $getArray();
        const context = this._$context;
        if (context && this._$video) {

            message.xMin = this._$bounds.xMin;
            message.yMin = this._$bounds.yMin;
            message.xMax = this._$bounds.xMax;
            message.yMax = this._$bounds.yMax;

            context.drawImage(this._$video, 0, 0);

            const imageBitmap = context.canvas.transferToImageBitmap();
            message.imageBitmap = imageBitmap;
            options.push(imageBitmap);
        }

        $rendererWorker.postMessage(message, options);

        $poolArray(options);

        this._$posted  = true;
        this._$updated = false;
    }
}
