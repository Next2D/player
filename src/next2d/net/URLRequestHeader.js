/**
 * @class
 * @memberOf next2d.net
 */
class URLRequestHeader
{
    /**
     *
     *
     * @param {string} [name=""]
     * @param {string} [value=""]
     *
     * @constructor
     * @public
     */
    constructor (name = "", value = "")
    {
        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$name = `${name}`;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$value = `${value}`;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class URLRequestHeader]
     * @method
     * @static
     */
    static toString()
    {
        return "[class URLRequestHeader]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.net.URLRequestHeader
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.net.URLRequestHeader";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object URLRequestHeader]
     * @method
     * @public
     */
    toString ()
    {
        return "[object URLRequestHeader]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.net.URLRequestHeader
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.net.URLRequestHeader";
    }

    /**
     * @description HTTP リクエストヘッダー名（Content-Type や SOAPAction など）です。
     *              An HTTP request header name (such as Content-Type or SOAPAction).
     *
     * @member {string}
     * @default ""
     * @public
     */
    get name ()
    {
        return this._$name;
    }
    set name (name)
    {
        this._$name = `${name}`;
    }

    /**
     * @description name プロパティに関連付けられた値（text/plain など）です。
     *              The value associated with the name property (such as text/plain).
     *
     * @member {string}
     * @default ""
     * @public
     */
    get value ()
    {
        return this._$value;
    }
    set value (value)
    {
        this._$value = `${value}`;
    }
}