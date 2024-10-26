import type { IBounds } from "./interface/IBounds";
import type { IVideoCharacter } from "./interface/IVideoCharacter";
import { SoundMixer } from "./SoundMixer";
import { DisplayObject } from "@next2d/display";
import { VideoEvent } from "@next2d/events";
import { execute as videoCreateElementService } from "./Video/service/VideoCreateElementService";
import { execute as videoRegisterEventUseCase } from "./Video/usecase/VideoRegisterEventUseCase";
import { execute as videoPlayEventService } from "./Video/service/VideoPlayEventService";
import {
    $clamp,
    $getPlayingVideos
} from "./MediaUtil";

/**
 * @description サーバーまたはローカルに保存された録画済みビデオファイルを再生する Video オブジェクトです。
 *              ビデオストリームを再生するには、attachNetStream() を使用して、ビデオを Video オブジェクトに関連付けます。
 *              次に、addChild() を使用して、Video オブジェクトを表示リストに追加します。
 *              A Video object that plays a recorded video file stored on a server or locally.
 *              To play a video stream, use attachNetStream() to attach the video to the Video object.
 *              Then, add the Video object to the display list using addChild().
 *
 * @class
 * @memberOf next2d.media
 * @extends  DisplayObject
 */
export class Video extends DisplayObject
{
    /**
     * @description キーフレーム総数
     *              Total number of keyframes
     *
     * @type {number}
     * @default 0
     * @public
     */
    public duration: number;

    /**
     * @description ビデオを拡大 / 縮小する際にスムージング（補間）するかどうかを指定します。
     *              Specifies whether the video should be smoothed (interpolated)
     *              when it is scaled.
     *
     * @type {boolean}
     * @default true
     * @public
     */
    public smoothing: boolean;

    /**
     * @description ビデオをループ生成するかどうかを指定します。
     *              Specifies whether to generate a video loop.
     *
     * @type {boolean}
     * @default false
     * @public
     */
    public loop: boolean;

    /**
     * @description ビデオの自動再生の設定。
     *              Setting up automatic video playback.
     *
     * @type {boolean}
     * @default true
     * @public
     */
    public autoPlay: boolean;

    /**
     * @description 現在のキーフレーム
     *              Current keyframe
     *
     *
     * @member {number}
     * @public
     */
    public currentTime: number;

    /**
     * @type {IBounds}
     * @private
     */
    private readonly _$bounds: IBounds;

    /**
     * @type {number}
     * @default -1
     * @private
     */
    private _$timerId: number;

    /**
     * @type {HTMLVideoElement}
     * @default null
     * @private
     */
    private _$videoElement: HTMLVideoElement | null;

    /**
     * @type {boolean}
     * @default true
     * @private
     */
    private _$stop: boolean;

    /**
     * @type {number}
     * @default 1
     * @private
     */
    private _$volume: number;

    /**
     * @type {string}
     * @default ""
     * @private
     */
    private _$src: string;

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

        this.duration    = 0;
        this.smoothing   = true;
        this.loop        = false;
        this.autoPlay    = true;
        this.currentTime = 0;

        // private params
        this._$src          = "";
        this._$timerId      = -1;
        this._$videoElement = null;
        this._$stop         = true;
        this._$volume       = 1;
        this._$bounds = {
            "xMin": 0,
            "xMax": width,
            "yMin": 0,
            "yMax": height
        };
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return {string}
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.media.Video";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return {string}
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.media.Video";
    }

    /**
     * @description ビデオコンテンツへの URL を指定します。
     *              Specifies the URL of the video content.
     *
     * @member {string}
     * @default ""
     * @public
     */
    get src (): string
    {
        return this._$src;
    }
    set src (src: string)
    {
        if (this._$src === src) {
            return ;
        }

        // reset
        this.currentTime = 0;

        this._$videoElement = null;
        this._$videoElement = videoCreateElementService();

        videoRegisterEventUseCase(
            this._$videoElement,
            this,
            this._$bounds
        );

        this._$src = this._$videoElement.src = src;
        this._$videoElement.load();
    }

    /**
     * @description ビデオの高さをピクセル単位で指定する整数です。
     *              An integer specifying the height of the video, in pixels.
     *
     * @member {number}
     * @default 320
     * @readonly
     * @public
     */
    get videoHeight (): number
    {
        return this._$bounds.yMax;
    }

    /**
     * @description ビデオの幅をピクセル単位で指定する整数です。
     *              An integer specifying the width of the video, in pixels.
     *
     * @member {number}
     * @default 240
     * @readonly
     * @public
     */
    get videoWidth (): number
    {
        return this._$bounds.xMax;
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
        this._$volume = $clamp(Math.min(
            SoundMixer.volume,
            volume
        ), 0, 1, 1);

        if (this._$videoElement) {
            this._$videoElement.volume = this._$volume;
        }
    }

    /**
     * @description ビデオの再生を一時停止します。
     *              Pauses the video playback.
     *
     * @return {void}
     * @method
     * @public
     */
    pause (): void
    {
        if (!this._$videoElement || this._$stop) {
            return ;
        }

        this._$stop = true;
        this._$videoElement.pause();

        cancelAnimationFrame(this._$timerId);

        if (this.willTrigger(VideoEvent.PAUSE)) {
            this.dispatchEvent(new VideoEvent(VideoEvent.PAUSE));
        }

        const playingVideos = $getPlayingVideos();
        const index = playingVideos.indexOf(this);
        if (index > -1) {
            playingVideos.splice(index, 1);
        }
    }

    /**
     * @description ビデオファイルを再生します。
     *              Plays the video file.
     *
     * @returns {void}
     * @method
     * @public
     */
    async play (): Promise<void>
    {
        if (!this._$videoElement || !this._$stop) {
            return ;
        }

        this._$stop = false;

        this._$videoElement.volume = this._$volume;
        await this._$videoElement.play();

        this._$timerId = videoPlayEventService(this);
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
        if (!this._$videoElement) {
            return ;
        }

        this.currentTime = this._$videoElement.currentTime = Math.min(this.duration, offset);

        if (this.willTrigger(VideoEvent.SEEK)) {
            this.dispatchEvent(new VideoEvent(VideoEvent.SEEK));
        }
    }

    /**
     * @description キャラクター情報からVideoを構築
     *              Build Video from character information
     *
     * @param  {object} character
     * @return {void}
     * @method
     * @protected
     */
    _$buildCharacter (character: IVideoCharacter): void
    {
        if (character.buffer && !character.videoData) {
            character.videoData = new Uint8Array(character.buffer);
            character.buffer    = null;
        }

        this.loop     = character.loop;
        this.autoPlay = character.autoPlay;

        this._$videoElement = null;
        this._$videoElement = videoCreateElementService();

        videoRegisterEventUseCase(
            this._$videoElement,
            this,
            this._$bounds
        );

        this._$videoElement.src = URL.createObjectURL(new Blob(
            [character.videoData],
            { "type": "video/mp4" }
        ));

        // setup
        this._$videoElement.volume = Math.min(character.volume, SoundMixer.volume);
        this._$videoElement.load();
    }

    // /**
    //  * @param  {CanvasRenderingContext2D} context
    //  * @param  {Float32Array} matrix
    //  * @param  {object} options
    //  * @return {boolean}
    //  * @method
    //  * @private
    //  */
    // _$mouseHit (
    //     context: CanvasRenderingContext2D,
    //     matrix: Float32Array,
    //     options: PlayerHitObjectImpl
    // ): boolean {

    //     if (!this._$visible) {
    //         return false;
    //     }

    //     return this._$hit(context, matrix, options);
    // }

    // /**
    //  * @param  {CanvasRenderingContext2D} context
    //  * @param  {array}   matrix
    //  * @param  {object}  options
    //  * @return {boolean}
    //  * @method
    //  * @private
    //  */
    // _$hit (
    //     context: CanvasRenderingContext2D,
    //     matrix: Float32Array,
    //     options: PlayerHitObjectImpl
    // ): boolean {

    //     let multiMatrix: Float32Array = matrix;
    //     const rawMatrix: Float32Array = this._$transform._$rawMatrix();
    //     if (rawMatrix !== $MATRIX_ARRAY_IDENTITY) {
    //         multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
    //     }

    //     const baseBounds: BoundsImpl = this._$getBounds(null);

    //     const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
    //     const xMax   = +bounds.xMax;
    //     const xMin   = +bounds.xMin;
    //     const yMax   = +bounds.yMax;
    //     const yMin   = +bounds.yMin;
    //     $poolBoundsObject(bounds);
    //     $poolBoundsObject(baseBounds);

    //     const width: number  = Math.ceil(Math.abs(xMax - xMin));
    //     const height: number = Math.ceil(Math.abs(yMax - yMin));

    //     context.setTransform(1, 0, 0, 1, xMin, yMin);
    //     context.beginPath();
    //     context.moveTo(0, 0);
    //     context.lineTo(width, 0);
    //     context.lineTo(width, height);
    //     context.lineTo(0, height);
    //     context.lineTo(0, 0);

    //     if (multiMatrix !== matrix) {
    //         $poolFloat32Array6(multiMatrix);
    //     }

    //     return context.isPointInPath(options.x, options.y);
    // }
}