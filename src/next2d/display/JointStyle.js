/**
 * JointStyle クラスは、線の描画で使用される結合スタイルを指定する定数値の列挙です。
 * これらの定数は、joints パラメーター（next2d.display.Graphics.lineStyle() メソッドのパラメーター）の値として使用されます。
 * このメソッドは、マイター、ラウンド、ベベルの 3 種類の結合をサポートします。
 *
 * The JointStyle class is an enumeration of constant values that specify the joint style to use in drawing lines.
 * These constants are provided for use as values in the joints parameter of the next2d.display.Graphics.lineStyle() method.
 * The method supports three types of joints: miter, round, and bevel, as the following
 *
 * @class
 * @memberOf next2d.display
 */
class JointStyle
{

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class JointStyle]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class JointStyle]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.JointStyle
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display.JointStyle";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object JointStyle]
     * @method
     * @public
     */
    toString ()
    {
        return "[object JointStyle]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.JointStyle
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.display.JointStyle";
    }

    /**
     * @description next2d.display.Graphics.lineStyle() メソッドの joints パラメーターでベベル結合を指定します。
     *              Specifies beveled joints in the joints parameter of
     *              the next2d.display.Graphics.lineStyle() method.
     *
     * @return  {string}
     * @default bevel
     * @const
     * @static
     */
    static get BEVEL ()
    {
        return "bevel";
    }

    /**
     * @description next2d.display.Graphics.lineStyle() メソッドの joints パラメーターでマイター結合を指定します。
     *              Specifies mitered joints in the joints parameter of
     *              the next2d.display.Graphics.lineStyle() method.
     *
     * @return  {string}
     * @default miter
     * @const
     * @static
     */
    static get MITER ()
    {
        return "miter";
    }

    /**
     * @description next2d.display.Graphics.lineStyle() メソッドの joints パラメーターでラウンド結合を指定します。
     *              Specifies round joints in the joints parameter of
     *              the next2d.display.Graphics.lineStyle() method.
     *
     * @return  {string}
     * @default round
     * @const
     * @static
     */
    static get ROUND ()
    {
        return "round";
    }
}
