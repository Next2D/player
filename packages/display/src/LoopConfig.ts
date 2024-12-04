/**
 * @description LoopConfig クラスで、MovieClipのフレームヘッダーの移動方法を指定できます。
 *              一度限りの再生や逆再生、フレーム固定などのアニメーションのループバリエーションを設定できます。
 *
 *              The LoopConfig class allows you to specify how the frame headers of a MovieClip are moved.
 *              You can set up looping variations of the animation, such as one-time playback,
 *              reverse playback, or fixed frame.
 *
 * @class
 * @memberOf next2d.display
 */
export class LoopConfig
{
    /**
     * @description LoopTypeクラスの固定値を利用して、ループのタイプを設定できます。
     *              You can set the type of loop by using a fixed value in the LoopType class.
     *
     * @return  {number}
     * @default 0
     * @public
     */
    public type: 0 | 1 | 2 | 3 | 4;

    /**
     * @description フレーム移動の開始値を設定します。逆再生時はここで設定した値が終了フレームとなります。
     *              Sets the start value for frame shift. For reverse playback,
     *              the value set here is the end frame.
     *
     * @return  {number}
     * @default 1
     * @public
     */
    public start: number;

    /**
     * @description フレーム移動の終了値を設定します。逆再生時はここで設定した値が開始フレームとなります。
     *              Sets the end value of frame shift. For reverse playback,
     *              the value set here is the start frame.
     *
     * @return  {number}
     * @default 0
     * @public
     */
    public end: number;

    /**
     * @description ループ設定の適用を開始するフレームの値、自動で設定されます。
     *              The value of the frame at which to start applying the loop setting, set automatically.
     *
     * @return  {number}
     * @default 1
     * @readonly
     * @public
     */
    public frame: number;

    /**
     * @param {number} [type=0]
     * @param {number} [start=1]
     * @param {number} [end=0]
     *
     * @constructor
     * @public
     */
    constructor (type: 0 | 1 | 2 | 3 | 4 = 0, start: number = 1, end: number = 0)
    {
        this.type  = type;
        this.start = start;
        this.end   = end;
        this.frame = 1;
    }
}