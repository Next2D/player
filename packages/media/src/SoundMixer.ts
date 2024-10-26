import { execute as soundMixerUpdateVolumeService } from "./SoundMixer/service/SoundMixerUpdateVolumeService";
import { execute as soundMixerStopAllService } from "./SoundMixer/service/SoundMixerStopAllService";
import { $getVolume } from "./MediaUtil";

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
     * @description ボリュームです。範囲は 0（無音）～ 1（フルボリューム）です。
     *              The volume, ranging from 0 (silent) to 1 (full volume).
     *
     * @member {number}
     * @default 1
     * @static
     */
    static get volume (): number
    {
        return $getVolume();
    }
    static set volume (volume: number)
    {
        soundMixerUpdateVolumeService(volume);
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
        soundMixerStopAllService();
    }
}