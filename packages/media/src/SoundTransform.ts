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
     * @description ループ設定です。
     *              loop setting.
     *
     * @type {boolean}
     * @default false
     * @public
     */
    public loop: boolean;

    /**
     * @param {number}  [volume=1]
     * @param {boolean} [loop=false]
     *
     * @constructor
     * @public
     */
    constructor (volume: number = 1, loop: boolean = false)
    {
        this.volume = volume;
        this.loop   = loop;
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
        return "next2d.media.SoundTransform";
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
        return "next2d.media.SoundTransform";
    }
}
