/**
 * TextFormatVerticalAlign クラスは、縦方向の揃え位置を指定するプロパティです。
 * The TextFormatVerticalAlign class is a property that specifies the vertical alignment position.
 *
 * @class
 * @memberOf next2d.text
 */
class TextFormatVerticalAlign
{
    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class TextFormatVerticalAlign]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class TextFormatVerticalAlign]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.text.TextFormatVerticalAlign
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.text.TextFormatVerticalAlign";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object TextFormatVerticalAlign]
     * @method
     * @public
     */
    toString ()
    {
        return "[object TextFormatVerticalAlign]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.text.TextFormatVerticalAlign
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.text.TextFormatVerticalAlign";
    }

    /**
     * @description テキストをテキストフィールド内で上揃えに配置します。
     *              Aligns the text with the top of the text field.
     *
     * @return  {string}
     * @default top
     * @const
     * @static
     */
    static get TOP ()
    {
        return "top";
    }

    /**
     * @description テキストをテキストフィールド内で中央揃えに配置します。
     *              Center the text in the text field.
     *
     * @return  {string}
     * @default middle
     * @const
     * @static
     */
    static get MIDDLE ()
    {
        return "middle";
    }

    /**
     * @description テキストをテキストフィールド内で下揃えに配置します。
     *              Aligns the text to the bottom within the text field.
     *
     * @return  {string}
     * @default bottom
     * @const
     * @static
     */
    static get BOTTOM ()
    {
        return "bottom";
    }
}
