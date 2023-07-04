import { SoundMixer } from "./SoundMixer";
import { URLRequest } from "@next2d/net";
import { Player } from "@next2d/core";
import {
    EventDispatcher,
    Event as Next2DEvent,
    IOErrorEvent,
    ProgressEvent as Next2DProgressEvent
} from "@next2d/events";
import type {
    DisplayObjectContainer,
    LoaderInfo
} from "@next2d/display";
import type {
    SoundTagImpl,
    SoundCharacterImpl,
    Character
} from "@next2d/interface";
import {
    $Math,
    $performance,
    $requestAnimationFrame,
    $clamp,
    $getArray
} from "@next2d/share";
import {
    $ajax,
    $audioContext,
    $audios,
    $currentPlayer,
    $decodeAudioData
} from "@next2d/util";

/**
 * Sound クラスを使用すると、アプリケーション内のサウンドを処理することができます。
 * Sound クラスを使用すると、Sound オブジェクトの作成や、外部 MP3 ファイルのオブジェクトへのロードと再生ができます。
 *
 * The Sound class lets you work with sound in an application.
 * The Sound class lets you create a Sound object,
 * load and play an external MP3 file into that object.
 *
 * @class
 * @memberOf next2d.media
 * @extends  EventDispatcher
 */
export class Sound extends EventDispatcher
{
    public readonly _$sources: AudioBufferSourceNode[];
    private _$bytesLoaded: number;
    private _$bytesTotal: number;
    private _$volume: number;
    private _$currentCount: number;
    private _$src: string;
    private _$loopCount: number;
    private _$stopFlag: boolean;
    public _$character: Character<SoundCharacterImpl> | null;
    public _$audioBuffer: AudioBuffer | null;
    public _$arrayBuffer: ArrayBuffer | null;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {

        super();

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
        this._$bytesTotal  = 0;

        /**
         * @type {AudioBuffer}
         * @default null
         * @private
         */
        this._$arrayBuffer = null;

        /**
         * @type {Uint8Array}
         * @default null
         * @private
         */
        this._$audioBuffer = null;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$character = null;

        /**
         * @type {array}
         * @private
         */
        this._$sources = $getArray();

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$volume = 1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$currentCount = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$loopCount = 0;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$stopFlag = true;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$src = "";
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Sound]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class Sound]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.media.Sound
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.media.Sound";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Sound]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object Sound]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.media.Sound
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.media.Sound";
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
     * @description ループ回数の設定
     *              Loop count setting.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get loopCount (): number
    {
        return this._$loopCount;
    }
    set loopCount (loop_count: number)
    {
        this._$loopCount = loop_count;
    }

    /**
     * @description 外部サウンドのURL
     *              URL for external sound.
     *
     * @member {string}
     * @default ""
     * @public
     */
    get src (): string
    {
        return this._$src;
    }
    set src (url: string)
    {
        this.load(new URLRequest(url));
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
        this._$volume = $Math.min(
            SoundMixer.volume,
            $clamp(volume, 0, 1, 1)
        );

        const length: number = this._$sources.length;
        if (length && $audioContext) {
            for (let idx: number = 0; idx < length; ++idx) {

                const source: AudioBufferSourceNode = this._$sources[idx];

                if (source._$gainNode) {
                    source._$gainNode.gain.value = this._$volume;
                    source._$volume = this._$volume;
                }
            }
        }
    }

    /**
     * @description Sound クラスを複製します。
     *              Duplicate the Sound class.
     *
     * @return {Sound}
     * @method
     * @public
     */
    clone (): Sound
    {
        const sound  = new Sound();
        sound.volume = this.volume;

        sound._$loopCount = this._$loopCount;

        if (this._$character) {
            sound._$character = this._$character;
        } else {
            sound._$audioBuffer = this._$audioBuffer;
        }

        return sound;
    }

    /**
     * @description 指定した URL から外部 MP3 ファイルのロードを開始します。
     *              Initiates loading of an external MP3 file from the specified URL.
     *
     * @param {URLRequest} request
     * @return {void}
     * @method
     * @public
     */
    load (request: URLRequest): void
    {
        this._$src = request.url;

        $ajax({
            "format": "arraybuffer",
            "url": request.url,
            "method": request.method,
            "data": request.data,
            "headers": request.headers,
            "withCredentials": request.withCredentials,
            "event": {
                "loadstart": (event: ProgressEvent) =>
                {
                    this._$loadStart(event);
                },
                "progress": (event: ProgressEvent) =>
                {
                    this._$progress(event);
                },
                "loadend": (event: ProgressEvent) =>
                {
                    this._$loadEnd(event);
                }
            }
        });
    }

    /**
     * @param  {ProgressEvent} event
     * @return {void}
     * @method
     * @private
     */
    _$loadStart (event: ProgressEvent): void
    {
        this._$bytesLoaded = event.loaded;
        this._$bytesTotal  = event.total;

        if (this.willTrigger(Next2DEvent.OPEN)) {
            this.dispatchEvent(new Next2DEvent(Next2DEvent.OPEN));
        }

        if (this.willTrigger(Next2DProgressEvent.PROGRESS)) {
            this.dispatchEvent(new Next2DProgressEvent(
                Next2DProgressEvent.PROGRESS, false, false,
                event.loaded, event.total
            ));
        }
    }

    /**
     * @param  {ProgressEvent} event
     * @return {void}
     * @method
     * @private
     */
    _$progress (event: ProgressEvent): void
    {
        this._$bytesLoaded = event.loaded;
        this._$bytesTotal  = event.total;

        if (this.willTrigger(Next2DProgressEvent.PROGRESS)) {
            this.dispatchEvent(new Next2DProgressEvent(
                Next2DProgressEvent.PROGRESS, false, false,
                event.loaded, event.total
            ));
        }
    }

    /**
     * @param  {ProgressEvent} event
     * @return {void}
     * @method
     * @private
     */
    _$loadEnd (event: ProgressEvent): void
    {
        this._$bytesLoaded = event.loaded;
        this._$bytesTotal  = event.total;

        if (this.willTrigger(Next2DProgressEvent.PROGRESS)) {
            this.dispatchEvent(new Next2DProgressEvent(
                Next2DProgressEvent.PROGRESS, false, false,
                event.loaded, event.total
            ));
        }

        const target: any = event.target;
        if (!target) {
            throw new Error("the Sound target is null.");
        }

        if (199 < target.status && 400 > target.status) {

            this._$arrayBuffer = target.response;

            if ($audioContext) {
                $decodeAudioData(this)
                    .then((sound) =>
                    {
                        if (sound.hasEventListener(Next2DEvent.INIT)
                            || sound.hasEventListener(Next2DEvent.COMPLETE)
                        ) {
                            const player: Player = $currentPlayer();
                            player._$loaders.push(sound);
                        }
                    });
            } else {
                $audios.push(this);
            }

        } else {

            if (this.willTrigger(IOErrorEvent.IO_ERROR)) {
                this.dispatchEvent(new IOErrorEvent(
                    IOErrorEvent.IO_ERROR, false, false, target.statusText
                ));
            }

        }
    }

    /**
     * @description サウンドを再生します。
     *              Play a sound.
     *
     * @param   {number} [start_time=0]
     * @return  {void}
     * @method
     * @public
     */
    play (start_time: number = 0): void
    {
        const buffer: AudioBuffer | null = this._$character
            ? this._$character.audioBuffer
            : this._$audioBuffer;

        // execute
        if (!$audioContext || !buffer) {

            const now: number = $performance.now();
            const wait = () =>
            {
                const buffer = this._$character
                    ? this._$character.audioBuffer
                    : this._$audioBuffer;

                if (buffer !== null && $audioContext !== null) {
                    const offset = ($performance.now() - now) / 1000;
                    this._$createBufferSource(start_time, offset);
                    return ;
                }

                $requestAnimationFrame(wait);

            };

            $requestAnimationFrame(wait);

        } else {

            this._$createBufferSource(start_time);

        }
    }

    /**
     * @description チャンネルで再生しているサウンドを停止します。
     *              Stops the sound playing in the channel.
     *
     * @return {void}
     * @method
     * @public
     */
    stop (): void
    {
        this._$stopFlag = true;
        const length: number = this._$sources.length;
        if (length) {

            const player = $currentPlayer();
            if ($audioContext) {

                for (let idx: number = 0; idx < length; ++idx) {

                    const source: AudioBufferSourceNode = this._$sources[idx];

                    if (source._$gainNode) {
                        source._$gainNode.gain.value = 0;
                        source._$gainNode.disconnect();
                        source._$gainNode = null;
                    }

                    source.onended = null;
                    source.disconnect();
                }
            }

            player._$sources.splice(
                player._$sources.indexOf(this), 1
            );

            this._$currentCount   = 0;
            this._$sources.length = 0;
        }
    }

    /**
     * @param  {object} tag
     * @param  {MovieClip} parent
     * @return {void}
     * @method
     * @private
     */
    _$build (
        tag: SoundTagImpl,
        parent: DisplayObjectContainer
    ) {

        const loaderInfo: LoaderInfo | null = parent.loaderInfo;
        if (!loaderInfo || !loaderInfo._$data) {
            throw new Error("the loaderInfo or data is null.");
        }

        this._$character = loaderInfo
            ._$data
            .characters[tag.characterId];

        if (!this._$character) {
            throw new Error("character is null.");
        }

        // load AudioBuffer
        if (!this._$character.audioBuffer) {
            if ($audioContext) {
                $decodeAudioData(this)
                    .then((sound) =>
                    {
                        if (sound.hasEventListener(Next2DEvent.INIT)
                            || sound.hasEventListener(Next2DEvent.COMPLETE)
                        ) {
                            const player: Player = $currentPlayer();
                            player._$loaders.push(sound);
                        }
                    });
            } else {
                $audios.push(this);
            }
        }

        this._$loopCount = tag.loopCount | 0;
        this._$volume = $Math.min(SoundMixer.volume, tag.volume);
    }

    /**
     * @param  {number}  [start_time=0]
     * @param  {number}  [offset=0]
     * @return {void}
     * @method
     * @private
     */
    _$createBufferSource (start_time = 0, offset = 0)
    {
        if (!$audioContext) {
            throw new Error("the Audio Context is null.");
        }

        // setup
        const source: AudioBufferSourceNode = $audioContext.createBufferSource();

        source.onended = (event: Event): void =>
        {
            return this._$endEventHandler(event);
        };

        // main
        source.buffer = this._$character
            ? this._$character.audioBuffer
            : this._$audioBuffer;

        source._$gainNode = $audioContext.createGain();
        source._$gainNode.connect($audioContext.destination);

        const volume = $Math.min(SoundMixer.volume, this._$volume);

        source._$gainNode.gain.value = volume;
        source._$volume = volume;

        source.connect(source._$gainNode);
        source.start(start_time | 0, offset);

        const player = $currentPlayer();
        if (player._$sources.indexOf(this) === -1) {
            player._$sources.push(this);
        }

        this._$sources.push(source);

        this._$stopFlag = false;
    }

    /**
     * @param  {Event} event
     * @return {void}
     * @method
     * @private
     */
    _$endEventHandler (event: Event): void
    {
        const source: any = event.target;

        this._$sources.splice(
            this._$sources.indexOf(source), 1
        );

        if (!this._$stopFlag && this._$loopCount > this._$currentCount) {

            this._$createBufferSource();

            this._$currentCount++;

        } else {

            this._$currentCount = 0;

            if ($audioContext) {

                if (source._$gainNode) {
                    source._$gainNode.gain.value = 0;
                    source._$gainNode.disconnect();
                    source._$gainNode = null;
                }

                // Firefoxにて、disconnectした時にonendedが呼び出されるのを回避
                source.onended = null;
                source.disconnect();
            }

            if (!this._$sources.length) {
                const player = $currentPlayer();
                player._$sources.splice(
                    player._$sources.indexOf(this), 1
                );
            }

            if (this.willTrigger(Next2DEvent.SOUND_COMPLETE)) {
                this.dispatchEvent(new Next2DEvent(Next2DEvent.SOUND_COMPLETE));
            }

        }
    }
}
