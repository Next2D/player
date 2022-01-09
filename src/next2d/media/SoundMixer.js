/**
 * SoundMixer クラスには、静的プロパティやアプリケーションのグローバルサウンドコントロールのメソッドが含まれます。
 * SoundMixer クラスは、アプリケーションの埋め込みおよびストリーミングサウンド、及び、Video クラスの音声を制御します。
 *
 * @class
 * @memberOf next2d.media
 */
class SoundMixer
{
    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class SoundMixer]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class SoundMixer]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.media.SoundMixer
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.media.SoundMixer";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object SoundMixer]
     * @method
     * @public
     */
    toString ()
    {
        return "[object SoundMixer]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.media.SoundMixer
     * @const
     * @static
     */
    get namespace ()
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
    static get volume ()
    {
        return Util.$soundMixerVolume;
    }
    static set volume (volume)
    {
        Util.$soundMixerVolume = Util.$clamp(volume, 0, 1, 1);

        const sources = Util.$currentPlayer()._$sources;
        for (let idx = 0; idx < sources.length; ++idx) {
            const source = sources[idx];
            source._$gainNode.gain.value = $Math.min(
                Util.$soundMixerVolume,
                source._$volume
            );
        }

        const videos = Util.$currentPlayer()._$videos;
        for (let idx = 0; idx < videos.length; ++idx) {
            const video  = videos[idx];
            video._$video.volume = $Math.min(video.volume, Util.$soundMixerVolume);
        }

    }

    /**
     * @description 再生中のサウンドをすべて停止します。
     *              Stops all sounds currently playing.
     *
     * @return {void}
     * @method
     * @static
     */
    static stopAll ()
    {
        const player = Util.$currentPlayer();

        // sounds
        const sources = player._$sources;
        while (sources.length) {
            sources[0].stop();
        }

        const videos = player._$videos;
        for (let idx = 0; idx < videos.length; ++idx) {
            videos[idx].pause();
        }
    }
}