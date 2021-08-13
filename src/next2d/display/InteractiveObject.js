/**
 * InteractiveObject クラスは、マウス、キーボードまたは他のユーザー入力デバイスを使用して
 * ユーザーが操作できるすべての表示オブジェクトの抽象基本クラスです。
 *
 * The InteractiveObject class is the abstract base class for all display objects
 * with which the user can interact, using the mouse, keyboard, or other user input device.
 *
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObject
 */
class InteractiveObject extends DisplayObject
{

    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$mouseEnabled = true;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isFocus = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isComposing = false;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class InteractiveObject]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class InteractiveObject]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.InteractiveObject
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display.InteractiveObject";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object InteractiveObject]
     * @method
     * @public
     */
    toString ()
    {
        return "[object InteractiveObject]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.InteractiveObject
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display.InteractiveObject";
    }

    /**
     * @description このオブジェクトでマウスまたはその他のユーザー入力メッセージを
     *              受け取るかどうかを指定します。
     *              Specifies whether this object receives mouse,
     *              or other user input, messages.
     *
     * @member {boolean}
     * @public
     */
    get mouseEnabled ()
    {
        return this._$mouseEnabled;
    }
    set mouseEnabled (mouse_enabled)
    {
        this._$mouseEnabled = !!mouse_enabled;
    }
}