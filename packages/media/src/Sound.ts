import type { SoundTagImpl } from "./interface/SoundTagImpl";
import { URLRequest } from "@next2d/net";
import { SoundMixer } from "./SoundMixer";
import { execute as soundLoadStartEventService } from "./Sound/SoundLoadStartEventService";
import { execute as soundProgressEventService } from "./Sound/SoundProgressEventService";
import { execute as soundLoadendEventService } from "./Sound/SoundLoadendEventService";
import { execute as soundEndedEventService } from "./Sound/SoundEndedEventService";
import { execute as soundDecodeService } from "./Sound/SoundDecodeService";
import {
    Event,
    EventDispatcher
} from "@next2d/events";
import {
    $clamp,
    $ajax,
    $audioContext,
    $getSounds
} from "./MediaUtil";

/**
 * @description Sound クラスを使用すると、アプリケーション内のサウンドを処理することができます。
 *              Sound クラスを使用すると、Sound オブジェクトの作成や、外部 MP3 ファイルのオブジェクトへのロードと再生ができます。
 *              The Sound class lets you work with sound in an application.
 *              The Sound class lets you create a Sound object,
 *              load and play an external MP3 file into that object.
 *
 * @class
 * @memberOf next2d.media
 * @extends  EventDispatcher
 */
export class Sound extends EventDispatcher
{
    private _$source: AudioBufferSourceNode | null;
    private _$gain: GainNode | null;
    private _$audioBuffer: AudioBuffer | null;
    private _$volume: number;
    private _$currentCount: number;
    private _$src: string;
    private _$loopCount: number;
    private _$stopFlag: boolean;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

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

        /**
         * @type {AudioBufferSourceNode}
         * @default null
         * @private
         */
        this._$source = null;

        /**
         * @type {GainNode}
         * @default null
         * @private
         */
        this._$gain = null;

        /**
         * @type {AudioBuffer}
         * @default null
         * @private
         */
        this._$audioBuffer = null;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default "[class Sound]"
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
     * @default "next2d.media.Sound"
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
     * @default "[object Sound]"
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
     * @default "next2d.media.Sound"
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.media.Sound";
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
        if (this._$src === url) {
            return ;
        }
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
        this._$volume = $clamp(volume, 0, 1, 1);
        if (this._$gain) {
            this._$gain.gain.value = this._$volume;
        }
    }

    /**
     * @description サウンドがループするかどうかを示します。
     *              Indicates whether the sound loops.
     *
     * @member {boolean}
     * @readonly
     * @public
     */
    get canLoop (): boolean
    {
        return !this._$stopFlag && this._$loopCount >= this._$currentCount;
    }

    /**
     * @description AudioBuffer
     *              AudioBuffer
     *
     * @member {AudioBuffer}
     * @default null
     * @public
     */
    get audioBuffer (): AudioBuffer | null
    {
        return this._$audioBuffer;
    }
    set audioBuffer (audio_buffer: AudioBuffer | null)
    {
        this._$audioBuffer = audio_buffer;
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
        const sound = new Sound();
        sound.volume      = this._$volume;
        sound.loopCount   = this._$loopCount;
        sound.audioBuffer = this._$audioBuffer;
        return sound;
    }

    /**
     * @description 指定した URL から外部 MP3 ファイルのロードを開始します。
     *              Initiates loading of an external MP3 file from the specified URL.
     *
     * @param  {URLRequest} request
     * @return {Promise}
     * @method
     * @public
     */
    load (request: URLRequest): Promise<void>
    {
        this._$src = request.url;

        return new Promise((resolve): void =>
        {
            $ajax({
                "format": "arraybuffer",
                "url": request.url,
                "method": request.method,
                "data": request.data,
                "headers": request.headers,
                "withCredentials": request.withCredentials,
                "event": {
                    "loadstart": (event: ProgressEvent): void =>
                    {
                        soundLoadStartEventService(this, event);
                    },
                    "progress": (event: ProgressEvent): void =>
                    {
                        soundProgressEventService(this, event);
                    },
                    "loadend": async (event: ProgressEvent): Promise<void> =>
                    {
                        await soundLoadendEventService(this, event);
                        resolve();
                    }
                }
            });
        });
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
        if (!this._$audioBuffer || !$audioContext) {
            return ;
        }

        this._$gain = $audioContext.createGain();
        this._$gain.connect($audioContext.destination);
        this._$gain.gain.value = Math.min(SoundMixer.volume, this._$volume);

        this._$source = $audioContext.createBufferSource();
        this._$source.addEventListener("ended", (): void =>
        {
            soundEndedEventService(this);
        });

        this._$source.buffer = this._$audioBuffer;
        this._$source.connect(this._$gain);
        this._$source.start(start_time);

        this._$stopFlag = false;
        this._$currentCount++;

        const sounds = $getSounds();
        const index = sounds.indexOf(this);
        if (index > -1) {
            sounds.splice(index, 1);
        }
        sounds.push(this);
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
        this._$currentCount = 0;

        if (this._$source) {
            this._$source.disconnect();
            this._$source = null;
        }

        if (this._$gain) {
            this._$gain.gain.value = 0;
            this._$gain.disconnect();
            this._$gain = null;
        }

        const sounds = $getSounds();
        const index = sounds.indexOf(this);
        if (index > -1) {
            sounds.splice(index, 1);
        }
    }

    /**
     * @param  {object} tag
     * @param  {MovieClip} parent
     * @return {void}
     * @method
     * @private
     */
    async _$build (
        tag: SoundTagImpl,
        parent: any
    ): Promise<void> {

        const loaderInfo: any = parent.loaderInfo;
        if (!loaderInfo || !loaderInfo._$data) {
            throw new Error("the loaderInfo or data is null.");
        }

        const character = loaderInfo
            ._$data
            .characters[tag.characterId];

        if (!character) {
            throw new Error("character is null.");
        }

        this._$loopCount = tag.loopCount | 0;
        this._$volume = Math.min(SoundMixer.volume, tag.volume);

        // load AudioBuffer
        if (!character.audioBuffer) {
            const audioBuffer = await soundDecodeService(character.buffer.buffer);
            if (audioBuffer) {
                this._$audioBuffer = character.audioBuffer = audioBuffer;
                if (this.hasEventListener(Event.COMPLETE)) {
                    this.dispatchEvent(new Event(Event.COMPLETE));
                }
            }
        }
    }
}