/**
 * URLRequestHeader オブジェクトは 1 つの HTTP のリクエストヘッダーをカプセル化し、名前と値のペアを構成します。
 * URLRequestHeader オブジェクトは URLRequest クラスの requestHeaders プロパティで使用されます。
 *
 * A URLRequestHeader object encapsulates a single HTTP request header and consists of a name/value pair.
 * URLRequestHeader objects are used in the requestHeaders property of the URLRequest class.
 *
 * @class
 * @memberOf next2d.net
 */
export class URLRequestHeader
{
    private readonly _$name: string;
    private readonly _$value: string;

    /**
     * @param {string} [name=""]
     * @param {string} [value=""]
     *
     * @constructor
     * @public
     */
    constructor (name: string = "", value: string = "")
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
    static toString (): string
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
    static get namespace (): string
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
    toString (): string
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
     * @public
     */
    get namespace (): string
    {
        return "next2d.net.URLRequestHeader";
    }

    /**
     * @description HTTP リクエストヘッダー名（Content-Type や SOAPAction など）です。
     *              An HTTP request header name (such as Content-Type or SOAPAction).
     *
     * @member {string}
     * @default ""
     * @readonly
     * @public
     */
    get name (): string
    {
        return this._$name;
    }

    /**
     * @description name プロパティに関連付けられた値（text/plain など）です。
     *              The value associated with the name property (such as text/plain).
     *
     * @member {string}
     * @default ""
     * @readonly
     * @public
     */
    get value (): string
    {
        return this._$value;
    }
}
