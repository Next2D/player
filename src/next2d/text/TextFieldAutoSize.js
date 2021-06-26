/**
 * @class
 * @memberOf next2d.text
 */
class TextFieldAutoSize
{
    /**
     * TextFieldAutoSize クラスは、TextField クラスの autoSize プロパティの設定で使用される定数値の列挙です。
     * TThe TextFieldAutoSize class is an enumeration of constant values used in setting the autoSize property of the TextField class.
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
     * @default [class TextFieldAutoSize]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class TextFieldAutoSize]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.text.TextFieldAutoSize
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.text.TextFieldAutoSize";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object TextFieldAutoSize]
     * @method
     * @public
     */
    toString ()
    {
        return "[object TextFieldAutoSize]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.text.TextFieldAutoSize
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.text.TextFieldAutoSize";
    }

    /**
     * @description テキストが中央揃えテキストとして扱われることを指定します。
     *              Specifies that the text is to be treated as center-justified text.
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
     * @description テキストが左揃えテキストとして扱われることを指定します。つまり、テキストフィールドの
     *              左側が固定され、テキストフィールドの単一行の右側のみが伸縮します。
     *              Specifies that the text is to be treated as left-justified text, meaning
     *              that the left side of the text field remains fixed and any resizing
     *              of a single line is on the right side.
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
     * @description サイズ変更が発生しないことを指定します。
     *              Specifies that no resizing is to occur.
     *
     * @return  {string}
     * @default none
     * @const
     * @static
     */
    static get NONE ()
    {
        return "none";
    }

    /**
     * @description テキストが右揃えテキストとして扱われることを指定します。つまり、テキストフィールドの
     *              右側が固定され、テキストフィールドの単一行の左側のみが伸縮します。
     *              Specifies that the text is to be treated as right-justified text,
     *              meaning that the right side of the text field remains fixed
     *              and any resizing of a single line is on the left side.
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