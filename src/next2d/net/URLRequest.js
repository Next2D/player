/**
 * @class
 * @memberOf next2d.net
 */
class URLRequest
{
    /**
     *
     * @param {string} [url=""]
     *
     * @constructor
     * @public
     */
    constructor (url = "")
    {
        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$url = url

        /**
         * @type {string}
         * @default application/x-www-form-urlencoded
         * @private
         */
        this._$contentType = "application/x-www-form-urlencoded";

        /**
         * @type {string}
         * @default URLRequestMethod.GET
         * @private
         */
        this._$method = URLRequestMethod.GET;

        /**
         * @type {array}
         * @private
         */
        this._$requestHeaders  = Util.$getArray();

        /**
         * @type {string}
         * @default navigator.userAgent
         * @private
         */
        this._$userAgent = Util.$navigator.userAgent;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class URLRequest]
     * @method
     * @static
     */
    static toString()
    {
        return "[class URLRequest]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.net:URLRequest
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.net:URLRequest";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object URLRequest]
     * @method
     * @public
     */
    toString ()
    {
        return "[object URLRequest]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.net:URLRequest
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.net:URLRequest";
    }



}