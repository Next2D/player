/**
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObjectContainer
 */
class Stage extends DisplayObjectContainer
{
    /**
     * Stage クラスはメイン描画領域を表します。
     * The Stage class represents the main drawing area.
     *
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {Player}
         * @default null
         * @private
         */
        this._$player = null;

        /**
         * @type {Stage}
         * @private
         */
        this._$root = this;

        /**
         * @type {Stage}
         * @private
         */
        this._$stage = this;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$invalidate = true;

        /**
         * @type {number}
         * @default 0xffffffff
         * @private
         */
        this._$color = 0xffffffff;

        /**
         * @type {number}
         * @default 60
         * @private
         */
        this._$frameRate = 60;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Stage]
     * @method
     * @static
     */
    static toString()
    {
        return "[class Stage]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.Stage
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display.Stage";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Stage]
     * @method
     * @public
     */
    toString ()
    {
        return "[object Stage]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.Stage
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display.Stage";
    }

    /**
     * @description 背景色です。
     *              background color.
     *
     * @member {number}
     * @public
     */
    get color ()
    {
        return this._$color;
    }
    set color (color)
    {
        this._$color = Util.$toColorInt(color);
        const player = this._$player;
        if (player) {
            const rgba = Util.$uintToRGBA(this._$color);
            player
                ._$context
                ._$setColor(
                    rgba.R / 255,
                    rgba.G / 255,
                    rgba.B / 255,
                    rgba.A / 255
                );
        }
    }

    /**
     * @description ステージのフレームレートを取得または設定します。
     *              Gets and sets the frame rate of the stage.
     *
     * @member {number}
     * @public
     */
    get frameRate ()
    {
        return this._$frameRate;
    }
    set frameRate (frame_rate)
    {
        this._$frameRate = Util.$clamp(frame_rate, 1, 60, 60);
        if (this._$player && !this._$player._$stopFlag) {
            this._$player.stop();
            this._$player.play();
        }
    }

    /**
     * @description 現在のステージの高さ（ピクセル数）です。
     *              The current height, in pixels, of the Stage.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get stageHeight ()
    {
        return (this._$player)
            ? this._$player._$height / this._$player._$scale / this._$player._$ratio
            : 0;
    }

    /**
     * @description ステージの現在の幅をピクセル単位で指定します。
     *              Specifies the current width, in pixels, of the Stage.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get stageWidth ()
    {
        return (this._$player)
            ? this._$player._$width / this._$player._$scale / this._$player._$ratio
            : 0;
    }

    /**
     * @description 表示リストをレンダリングする必要のある次の機会に、
     *              表示オブジェクトに警告するようランタイムに通知します。
     *              (例えば、再生ヘッドを新しいフレームに進める場合などです。)
     *              Calling the invalidate() method signals runtimes
     *              to alert display objects on the next opportunity
     *              it has to render the display list.
     *              (for example, when the playhead advances to a new frame)
     *
     * @return {void}
     * @method
     * @public
     */
    invalidate ()
    {
        this._$invalidate = true;
    }
}