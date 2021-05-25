/**
 * @class
 * @memberOf next2d.text
 */
class TextFormatAlign
{
    /**
     * TextFormatAlign クラスは、TextFormat クラスのテキストの行揃えの値を提供します。
     * The TextFormatAlign class provides values for text alignment in the TextFormat class.
     *
     * @constructor
     * @public
     */
    constructor () {}

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class TextFormatAlign]
     * @method
     * @static
     */
    static toString()
    {
        return "[class TextFormatAlign]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.text:TextFormatAlign
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.text:TextFormatAlign";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object TextFormatAlign]
     * @method
     * @public
     */
    toString ()
    {
        return "[object TextFormatAlign]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.text:TextFormatAlign
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.text:TextFormatAlign";
    }

    /**
     * @description テキストをテキストフィールドの中央に配置します。
     *              centers the text in the text field.
     *
     * @return  {string}
     * @default center
     * @const
     * @static
     */
    static get CENTER ()
    {
        return "center";
    }

    /**
     * @description テキストをテキストフィールド内で左に行揃えします。
     *              aligns text to the left within the text field.
     *
     * @return  {string}
     * @default left
     * @const
     * @static
     */
    static get LEFT ()
    {
        return "left";
    }

    /**
     * @description テキストをテキストフィールド内で右に行揃えします。
     *              aligns text to the right within the text field.
     *
     * @return  {string}
     * @default right
     * @const
     * @static
     */
    static get RIGHT ()
    {
        return "right";
    }
}