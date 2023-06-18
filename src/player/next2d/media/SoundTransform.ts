import { $clamp } from "../../util/RenderUtil";

/**
 * SoundTransform クラスにはボリュームとループのプロパティが含まれます。
 *
 * The SoundTransform class contains properties for volume and loop.
 *
 * @class
 * @memberOf next2d.media
 */
export class SoundTransform
{
    private _$volume: number;
    private _$loop: boolean;

    /**
     * @param {number}  [volume=1]
     * @param {boolean} [loop=false]
     *
     * @constructor
     * @public
     */
    constructor (volume: number = 1, loop: boolean = false)
    {
        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$volume = 1;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$loop = false;

        // setup
        this.volume = volume;
        this.loop   = loop;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class SoundTransform]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class SoundTransform]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.media.SoundTransform
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.media.SoundTransform";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object SoundTransform]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object SoundTransform]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.media.SoundTransform
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.media.SoundTransform";
    }

    /**
     * @description ループ設定です。
     *              loop setting.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get loop (): boolean
    {
        return this._$loop;
    }
    set loop (loop: boolean)
    {
        this._$loop = loop;
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
        this._$volume = $clamp(+volume, 0, 1, 0);
    }
}
