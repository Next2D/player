/**
 * StageQuality クラスでは、Stage.quality パラメーターの値を定義します。
 * デバイスフォントは quality プロパティの影響を受けません。
 *
 * The StageQuality class defines the value of the Stage.quality parameter.
 * which are therefore unaffected by the quality property.
 *
 * @class
 * @memberOf next2d.display
 */
class StageQuality
{

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class StageQuality]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class StageQuality]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.StageQuality
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display.StageQuality";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object StageQuality]
     * @method
     * @public
     */
    toString ()
    {
        return "[object StageQuality]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.StageQuality
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display.StageQuality";
    }

    /**
     * @description 高いレンダリング品質を指定します。
     *              Specifies high rendering quality.
     *
     * @return  {string}
     * @default high
     * @method
     * @static
     */
    static get HIGH ()
    {
        return "high";
    }

    /**
     * @description 低いレンダリング品質を指定します。
     *              Specifies low rendering quality.
     *
     * @return  {string}
     * @default low
     * @method
     * @static
     */
    static get LOW ()
    {
        return "low";
    }

    /**
     * @description 中程度のレンダリング品質を指定します。
     *              Specifies medium rendering quality.
     *
     * @return  {string}
     * @default medium
     * @method
     * @static
     */
    static get MEDIUM ()
    {
        return "medium";
    }
}