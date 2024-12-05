/**
 * @description SoundTransform クラスにはボリュームとループのプロパティが含まれます。
 *              The SoundTransform class contains properties for volume and loop.
 *
 * @class
 * @memberOf next2d.media
 */
export class SoundTransform
{
    /**
     * @description ボリュームです。範囲は 0（無音）～ 1（フルボリューム）です。
     *              The volume, ranging from 0 (silent) to 1 (full volume).
     *
     * @member {number}
     * @default 1
     * @public
     */
    public volume: number;

    /**
     * @description ループ回数の設定
     *              Loop count setting.
     *
     * @type {boolean}
     * @default false
     * @public
     */
    public loopCount: number;

    /**
     * @param {number} [volume=1]
     * @param {number} [loop_count=0]
     *
     * @constructor
     * @public
     */
    constructor (volume: number = 1, loop_count: number = 0)
    {
        this.volume    = volume;
        this.loopCount = loop_count;
    }
}