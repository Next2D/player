/**
 * Stage クラスはメイン描画領域を表します。
 * The Stage class represents the main drawing area.
 *
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObjectContainer
 */
class Stage extends DisplayObjectContainer
{
    /**
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
    static toString ()
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
     * @public
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
        this._$color = Util.$clamp(Util.$toColorInt(color), 0, 0xffffff, 0xffffff);
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
        this._$frameRate = Util.$clamp(+frame_rate, 1, 60, 60);
        if (this._$player && !this._$player._$stopFlag) {
            this._$player.stop();
            this._$player.play();
        }
    }

    /**
     * @description Player オブジェクトを返します。
     *              Returns a Player object.
     *
     * @member {Player}
     * @readonly
     * @public
     */
    get player ()
    {
        return this._$player;
    }

    /**
     * @description 現在のCanvasの高さをピクセル単位で指定します。
     *              Specifies the height of the current Canvas in pixels.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get canvasHeight ()
    {
        return this._$player
            ? this._$player._$height / Util.$devicePixelRatio
            : 0;
    }

    /**
     * @description 現在のCanvasの幅をピクセル単位で指定します。
     *              Specifies the width of the current Canvas in pixels.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get canvasWidth ()
    {
        return this._$player
            ? this._$player._$width / Util.$devicePixelRatio
            : 0;
    }

    /**
     * @description 現在のStageの高さをピクセル単位で指定します。
     *              Specifies the height of the current Stage in pixels.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get currentStageHeight ()
    {
        return this._$player
            ? this._$player._$baseHeight * this._$player._$scale
            : 0;
    }

    /**
     * @description 現在のStageの幅をピクセル単位で指定します。
     *              Specifies the width of the current Stage in pixels.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get currentStageWidth ()
    {
        return this._$player
            ? this._$player._$baseWidth * this._$player._$scale
            : 0;
    }

    /**
     * @description 初期設定したステージの高さをピクセル単位で指定します。
     *              Specifies the height of the initially set stage in pixels.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get stageHeight ()
    {
        return this._$player ? this._$player._$baseHeight : 0;
    }

    /**
     * @description 初期設定したステージの幅をピクセル単位で指定します。
     *              Specifies the width of the initially set stage in pixels.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get stageWidth ()
    {
        return this._$player ? this._$player._$baseWidth : 0;
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
