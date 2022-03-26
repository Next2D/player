/**
 * @class
 * @memberOf next2d.display
 */
class LoopConfig
{
    /**
     * @param {number} [type=0]
     * @param {number} [start=1]
     * @param {number} [end=0]
     *
     * @constructor
     * @public
     */
    constructor (type = 0, start = 1, end = 0)
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
    static toString ()
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
    static get namespace ()
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
    toString ()
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
    get namespace ()
    {
        return "next2d.display.LoopConfig";
    }

    /**
     * @return  {number}
     * @default 1
     * @readonly
     * @public
     */
    get frame ()
    {
        return this._$frame;
    }

    /**
     * @return  {number}
     * @default 0
     * @public
     */
    get type ()
    {
        return this._$type;
    }
    set type (type)
    {
        this._$type = Util.$clamp(
            type | 0, LoopType.REPEAT, LoopType.REPEAT_REVERSAL
        );
    }

    /**
     * @return  {number}
     * @default 1
     * @public
     */
    get start ()
    {
        return this._$start;
    }
    set start (start)
    {
        this._$start = Util.$clamp(start | 0, 1, 0xffffff);
    }

    /**
     * @return  {number}
     * @default 0
     * @public
     */
    get end ()
    {
        return this._$end;
    }
    set end (end)
    {
        this._$end = Util.$clamp(end | 0, 0, 0xffffff);
    }
}
