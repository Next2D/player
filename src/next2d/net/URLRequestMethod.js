/**
 * @class
 * @memberOf next2d.net
 */
class URLRequestMethod
{
    /**
     * URLRequestMethod クラスは、URLRequest オブジェクトがデータをサーバーに送信するときに
     * POST または GET のどちらのメソッドを使用するかを指定する値を提供します。
     *
     * The URLRequestMethod class provides values that specify whether the URLRequest object should use the
     * POST method or the GET method when sending data to a server.
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
     * @default [class URLRequestMethod]
     * @method
     * @static
     */
    static toString()
    {
        return "[class URLRequestMethod]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.net:URLRequestMethod
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.net:URLRequestMethod";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object URLRequestMethod]
     * @method
     * @public
     */
    toString ()
    {
        return "[object URLRequestMethod]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.net:URLRequestMethod
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.net:URLRequestMethod";
    }

    /**
     * @description URLRequest オブジェクトが DELETE であることを指定します。
     *              Specifies that the URLRequest object is a DELETE.
     *
     * @return  {string}
     * @default DELETE
     * @const
     * @static
     */
    static get DELETE ()
    {
        return "DELETE";
    }

    /**
     * @description URLRequest オブジェクトが GET であることを指定します。
     *              Specifies that the URLRequest object is a GET.
     *
     * @return  {string}
     * @default GET
     * @const
     * @static
     */
    static get GET ()
    {
        return "GET";
    }

    /**
     * @description URLRequest オブジェクトが HEAD であることを指定します。
     *              Specifies that the URLRequest object is a HEAD.
     *
     * @return  {string}
     * @default HEAD
     * @const
     * @static
     */
    static get HEAD ()
    {
        return "HEAD";
    }

    /**
     * @description URLRequest オブジェクトが OPTIONS であることを指定します。
     *              Specifies that the URLRequest object is OPTIONS.
     *
     * @return  {string}
     * @default OPTIONS
     * @const
     * @static
     */
    static get OPTIONS ()
    {
        return "OPTIONS";
    }

    /**
     * @description URLRequest オブジェクトが POST であることを指定します。
     *              Specifies that the URLRequest object is a POST.
     *
     * @return  {string}
     * @default POST
     * @const
     * @static
     */
    static get POST ()
    {
        return "POST";
    }

    /**
     * @description URLRequest オブジェクトが PUT であることを指定します。
     *              Specifies that the URLRequest object is a PUT.
     *
     * @return  {string}
     * @default PUT
     * @const
     * @static
     */
    static get PUT ()
    {
        return "PUT";
    }
}