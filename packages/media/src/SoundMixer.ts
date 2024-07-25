import type { Sound } from "./Sound";
import type { Video } from "./Video";
import type { Player } from "@next2d/core";
import {
    $currentPlayer,
    $getSoundMixerVolume,
    $setSoundMixerVolume
} from "@next2d/util";
import {
    $clamp,
    $Math
} from "@next2d/share";

/**
 * @type {number}
 * @private
 */
let $volume: number = 1;

/**
 * SoundMixer クラスには、静的プロパティやアプリケーションのグローバルサウンドコントロールのメソッドが含まれます。
 * SoundMixer クラスは、アプリケーションの埋め込みおよびストリーミングサウンド、及び、Video クラスの音声を制御します。
 *
 * @class
 * @memberOf next2d.media
 */
export class SoundMixer
{
    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default "[class SoundMixer]"
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class SoundMixer]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default "next2d.media.SoundMixer"
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.media.SoundMixer";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default "[object SoundMixer]"
     * @method
     * @public
     */
    toString (): string
    {
        return "[object SoundMixer]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default "next2d.media.SoundMixer"
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.media.SoundMixer";
    }

    /**
     * @description ボリュームです。範囲は 0（無音）～ 1（フルボリューム）です。
     *              The volume, ranging from 0 (silent) to 1 (full volume).
     *
     * @member {number}
     * @default 1
     * @static
     */
    static get volume (): number
    {
        return $volume;
    }
    static set volume (volume: number)
    {
        $volume = Math.min(Math.max(0, volume), 1);

        const player: Player = $currentPlayer();

        const sounds: Sound[] = player._$sources;
        for (let idx: number = 0; idx < sounds.length; ++idx) {

            const sound: Sound = sounds[idx];

            for (let idx: number = 0; idx < sound._$sources.length; ++idx) {

                const source: AudioBufferSourceNode = sound._$sources[idx];

                if (source._$gainNode) {
                    source._$gainNode.gain.value = $Math.min(
                        $volume,
                        source._$volume
                    );
                }

            }
        }

        const videos: Video[] = player._$videos;
        for (let idx: number = 0; idx < videos.length; ++idx) {

            const video: Video = videos[idx];

            if (video._$video) {
                video._$video.volume = $Math.min(
                    $volume,
                    video.volume
                );
            }
        }

    }

    /**
     * @description 再生中のサウンドとビデオをすべて停止します。
     *              Stops all sound and video that is playing.
     *
     * @return {void}
     * @method
     * @static
     */
    static stopAll (): void
    {
        const player: Player = $currentPlayer();

        // sounds
        const sources: Sound[] = player._$sources;
        for (let idx: number = 0; idx < sources.length; ++idx) {
            sources[idx].stop();
        }

        const videos = player._$videos;
        for (let idx: number = 0; idx < videos.length; ++idx) {
            videos[idx].pause();
        }

        player._$sources.length = 0;
        player._$videos.length  = 0;
    }
}
