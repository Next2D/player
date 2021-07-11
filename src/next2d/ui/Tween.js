/**
 * @class
 * @memberOf next2d.ui
 */
class Tween
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {

    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Tween]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class Tween]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.ui.Tween
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.ui.Tween";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Tween]
     * @method
     * @public
     */
    toString ()
    {
        return "[object Tween]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.ui.Tween
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.ui.Tween";
    }



}