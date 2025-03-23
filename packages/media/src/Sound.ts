import type { ISoundCharacter } from "./interface/ISoundCharacter";
import type { URLRequest } from "@next2d/net";
import { SoundMixer } from "./SoundMixer";
import { execute as soundEndedEventService } from "./Sound/service/SoundEndedEventService";
import { execute as soundLoadUseCase } from "./Sound/usecase/SoundLoadUseCase";
import { execute as soundBuildFromCharacterUseCase } from "./Sound/usecase/SoundBuildFromCharacterUseCase";
import { EventDispatcher } from "@next2d/events";
import {
    $clamp,
    $getAudioContext,
    $getPlayingSounds
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
    /**
     * @type {AudioBufferSourceNode}
     * @default null
     * @private
     */
    private _$source: AudioBufferSourceNode | null;

    /**
     * @type {GainNode}
     * @default null
     * @private
     */
    private _$gainNode: GainNode | null;

    /**
     * @type {boolean}
     * @default true
     * @private
     */
    private _$stopFlag: boolean;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$currentCount: number;

    /**
     * @type {number}
     * @default 1
     * @private
     */
    private _$volume: number;

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

        // private
        this._$volume       = 1;
        this._$currentCount = 0;
        this._$stopFlag     = true;
        this._$source       = null;
        this._$gainNode     = null;
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

        if (this._$gainNode) {
            this._$gainNode.gain.value = this._$volume;
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
        await soundLoadUseCase(this, request);
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

        if (!this.audioBuffer) {
            return ;
        }

        // 初期化
        this.stop();

        const audioContext = $getAudioContext();
        this._$gainNode = audioContext.createGain();
        this._$gainNode.connect(audioContext.destination);
        this._$gainNode.gain.value = Math.min(SoundMixer.volume, this._$volume);

        this._$source = audioContext.createBufferSource();
        this._$source.addEventListener("ended", (): void =>
        {
            soundEndedEventService(this);
        });

        this._$source.buffer = this.audioBuffer;
        this._$source.connect(this._$gainNode);
        this._$source.start(start_time);

        this._$stopFlag = false;
        this._$currentCount++;

        $getPlayingSounds().push(this);
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

        if (this._$gainNode) {
            this._$gainNode.gain.value = 0;
            this._$gainNode.disconnect();
            this._$gainNode = null;
        }

        const playingSounds = $getPlayingSounds();
        const index = playingSounds.indexOf(this);
        if (index > -1) {
            playingSounds.splice(index, 1);
        }
    }

    /**
     * @description Character DataからSoundを作成
     *              Create Sound from Character Data
     *
     * @param  {Character} character
     * @return {Promise}
     * @method
     * @protected
     */
    async $build (character: ISoundCharacter): Promise<void>
    {
        await soundBuildFromCharacterUseCase(this, character);
    }
}