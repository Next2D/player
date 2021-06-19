/**
 * @class
 * @memberOf next2d.text
 */
class TextFieldType
{
    /**
     * TextFieldType クラスは、TextField クラスの type プロパティの設定で使用される定数値の列挙です。
     * The TextFieldType class is an enumeration of constant values used in setting 
     * the type property of the TextField class.
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
     * @default [class TextFieldType]
     * @method
     * @static
     */
    static toString()
    {
        return "[class TextFieldType]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.text.TextFieldType
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.text.TextFieldType";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object TextFieldType]
     * @method
     * @public
     */
    toString ()
    {
        return "[object TextFieldType]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.text.TextFieldType
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.text.TextFieldType";
    }

    /**
     * @description ダイナミックな TextField を指定するために使用されます。
     *              Used to specify a dynamic TextField.
     *
     * @return  {string}
     * @default dynamic
     * @const
     * @static
     */
    static get DYNAMIC ()
    {
        return "dynamic";
    }

    /**
     * @description 静的な TextField を指定するために使用されます。
     *              Used to specify an static TextField.
     *
     * @return  {string}
     * @default static
     * @const
     * @static
     */
    static get STATIC ()
    {
        return "static";
    }
}