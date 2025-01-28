import { SoundMixer } from "./SoundMixer";
import { DisplayObject } from "@next2d/display";
import { VideoEvent } from "@next2d/events";
import { execute as videoCreateElementService } from "./Video/service/VideoCreateElementService";
import { execute as videoRegisterEventUseCase } from "./Video/usecase/VideoRegisterEventUseCase";
import { execute as videoPlayEventUseCase } from "./Video/usecase/VideoPlayEventUseCase";
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
     * @description ビデオの幅をピクセル単位で指定する整数です。
     *              An integer specifying the width of the video, in pixels.
     *
     * @member {number}
     * @default 0
     * @public
     */
    public videoWidth: number;

    /**
     * @description ビデオの高さをピクセル単位で指定する整数です。
     *              An integer specifying the height of the video, in pixels.
     *
     * @member {number}
     * @default 0
     * @public
     */
    public videoHeight: number;

    /**
     * @description ビデオが読み込まれているかどうかを返します。
     *              Returns whether the video has been loaded.
     *
     * @type {boolean}
     * @default false
     * @public
     */
    public loaded: boolean;

    /**
     * @description ビデオが終了したかどうかを返します。
     *              Returns whether the video has ended.
     *
     * @type {boolean}
     * @default false
     * @public
     */
    public ended: boolean;

    /**
     * @description Videoの機能を所持しているかを返却
     *              Returns whether the display object has Video functionality.
     *
     * @type {boolean}
     * @readonly
     * @public
     */
    public readonly isVideo: boolean;

    /**
     * @type {HTMLVideoElement}
     * @default null
     * @public
     */
    public $videoElement: HTMLVideoElement | null;

    /**
     * @type {OffscreenCanvas}
     * @default null
     * @public
     */
    public $offscreenCanvas: OffscreenCanvas | null;

    /**
     * @type {OffscreenCanvasRenderingContext2D}
     * @default null
     * @public
     */
    public $context: OffscreenCanvasRenderingContext2D | null;

    /**
     * @type {boolean}
     * @default true
     * @public
     */
    public paused: boolean;

    /**
     * @type {number}
     * @default -1
     * @private
     */
    private _$timerId: number;

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

        this.videoWidth  = width;
        this.videoHeight = height;

        // public params
        this.isVideo     = true;
        this.duration    = 0;
        this.smoothing   = true;
        this.loop        = false;
        this.loaded      = false;
        this.ended       = false;
        this.paused      = true;
        this.autoPlay    = true;
        this.currentTime = 0;

        // private params
        this._$src       = "";
        this._$timerId   = -1;
        this._$volume    = 1;

        // element
        this.$videoElement    = null;
        this.$offscreenCanvas = null;
        this.$context         = null;
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
        this.loaded           = false;
        this.currentTime      = 0;
        this.$videoElement    = null;
        this.$offscreenCanvas = null;
        this.$context         = null;

        this.$videoElement = videoCreateElementService();
        videoRegisterEventUseCase(this.$videoElement, this);

        this._$src = this.$videoElement.src = src;
        this.$videoElement.load();
    }

    /**
     * @description ビデオがミュートされているかどうかを返します。
     *              Returns whether the video is muted.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get muted (): boolean
    {
        return this.$videoElement ? this.$videoElement.muted : false;
    }
    set muted (muted: boolean)
    {
        if (!this.$videoElement) {
            return ;
        }
        this.$videoElement.muted = muted;
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

        if (this.$videoElement) {
            this.$videoElement.volume = this._$volume;
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
        if (!this.$videoElement || this.paused) {
            return ;
        }

        this.paused = true;
        this.$videoElement.pause();

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
        if (!this.$videoElement || !this.paused) {
            return ;
        }

        this.paused = false;
        this.ended  = false;

        this.$videoElement.volume = this._$volume;
        await this.$videoElement.play();

        this._$timerId = videoPlayEventUseCase(this);
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
        if (!this.$videoElement) {
            return ;
        }

        this.currentTime = this.$videoElement.currentTime = Math.min(this.duration, offset);

        if (this.willTrigger(VideoEvent.SEEK)) {
            this.dispatchEvent(new VideoEvent(VideoEvent.SEEK));
        }
    }
}