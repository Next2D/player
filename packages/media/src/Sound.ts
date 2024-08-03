import type { Character } from "./interface/Character";
import { URLRequest } from "@next2d/net";
import { SoundMixer } from "./SoundMixer";
import { execute as soundLoadStartEventService } from "./Sound/SoundLoadStartEventService";
import { execute as soundProgressEventService } from "./Sound/SoundProgressEventService";
import { execute as soundLoadEndEventService } from "./Sound/SoundLoadEndEventService";
import { execute as soundEndedEventService } from "./Sound/SoundEndedEventService";
import { execute as soundDecodeService } from "./Sound/SoundDecodeService";
import { EventDispatcher } from "@next2d/events";
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
    private _$stopFlag: boolean;
    private _$currentCount: number;
    private _$volume: number;
    private _$src: string;

    /**
     * @description AudioBuffer
     *              AudioBuffer
     *
     * @type {AudioBuffer}
     * @default null
     * @public
     */
    public audioBuffer: AudioBuffer | null;

    /**
     * @description ループ回数の設定
     *              Loop count setting.
     *
     * @type {string}
     * @default 0
     * @public
     */
    public loopCount: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        this.loopCount   = 0;
        this.audioBuffer = null;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$volume = 1;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$src = "";

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$currentCount = 0;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$stopFlag = true;

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
        return !this._$stopFlag && this.loopCount >= this._$currentCount;
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
        sound.loopCount   = this.loopCount;
        sound.audioBuffer = this.audioBuffer;
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
    async load (request: URLRequest): Promise<void>
    {
        this._$src = request.url;

        await new Promise<void>((resolve): void =>
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
                        await soundLoadEndEventService(this, event);
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
        // 再生中なら終了
        if (!this._$stopFlag) {
            return ;
        }

        if (!this.audioBuffer || !$audioContext) {
            return ;
        }

        // 初期化
        this.stop();

        this._$gain = $audioContext.createGain();
        this._$gain.connect($audioContext.destination);
        this._$gain.gain.value = Math.min(SoundMixer.volume, this._$volume);

        this._$source = $audioContext.createBufferSource();
        this._$source.addEventListener("ended", (): void =>
        {
            soundEndedEventService(this);
        });

        this._$source.buffer = this.audioBuffer;
        this._$source.connect(this._$gain);
        this._$source.start(start_time);

        this._$stopFlag = false;
        this._$currentCount++;

        $getSounds().push(this);
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
        if (this._$stopFlag) {
            return ;
        }

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
     * @description Character DataからSoundを作成
     *              Create Sound from Character Data
     *
     * @param  {Character} character
     * @return {Promise}
     * @method
     * @private
     */
    async _$build (character: Character<any>): Promise<void>
    {
        // load AudioBuffer
        if (!character.audioBuffer) {
            const audioBuffer = await soundDecodeService(character.buffer.buffer);
            if (!audioBuffer) {
                return ;
            }

            character.audioBuffer = audioBuffer;
        }

        this.audioBuffer = character.audioBuffer;
    }
}