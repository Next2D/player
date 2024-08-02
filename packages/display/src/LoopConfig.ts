// import { $clamp } from "./DisplayObjectUtil";

/**
 * LoopConfig クラスで、MovieClipのフレームヘッダーの移動方法を指定できます。
 * 一度限りの再生や逆再生、フレーム固定などのアニメーションのループバリエーションを設定できます。
 *
 * The LoopConfig class allows you to specify how the frame headers of a MovieClip are moved.
 * You can set up looping variations of the animation, such as one-time playback,
 * reverse playback, or fixed frame.
 *
 * @class
 * @memberOf next2d.display
 */
export class LoopConfig
{
    private _$type: number;
    private _$start: number;
    private _$end: number;
    private _$frame: number;

    /**
     * @param {number} [type=0]
     * @param {number} [start=1]
     * @param {number} [end=0]
     *
     * @constructor
     * @public
     */
    constructor (type: number = 0, start: number = 1, end: number = 0)
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$type = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$start = 1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$end = 0;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$frame = 1;

        // setup
        this.type  = type;
        this.start = start;
        this.end   = end;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class LoopConfig]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class LoopConfig]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.LoopConfig
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.display.LoopConfig";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object LoopConfig]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object LoopConfig]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.LoopConfig
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.display.LoopConfig";
    }

    /**
     * @description ループ設定の適用を開始するフレームの値、自動で設定されます。
     *              The value of the frame at which to start applying the loop setting, set automatically.
     *
     * @return  {number}
     * @default 1
     * @readonly
     * @public
     */
    get frame (): number
    {
        return this._$frame;
    }

    /**
     * @description LoopTypeクラスの固定値を利用して、ループのタイプを設定できます。
     *              You can set the type of loop by using a fixed value in the LoopType class.
     *
     * @return  {number}
     * @default 0
     * @public
     */
    get type (): number
    {
        return this._$type;
    }
    set type (type: number)
    {
        this._$type = $clamp(type | 0, 0, 4);
    }

    /**
     * @description フレーム移動の開始値を設定します。逆再生時はここで設定した値が終了フレームとなります。
     *              Sets the start value for frame shift. For reverse playback,
     *              the value set here is the end frame.
     *
     * @return  {number}
     * @default 1
     * @public
     */
    get start (): number
    {
        return this._$start;
    }
    set start (start: number)
    {
        this._$start = $clamp(start | 0, 1, 0xffffff);
    }

    /**
     * @description フレーム移動の終了値を設定します。逆再生時はここで設定した値が開始フレームとなります。
     *              Sets the end value of frame shift. For reverse playback,
     *              the value set here is the start frame.
     *
     * @return  {number}
     * @default 0
     * @public
     */
    get end (): number
    {
        return this._$end;
    }
    set end (end: number)
    {
        this._$end = $clamp(end | 0, 0, 0xffffff);
    }
}
