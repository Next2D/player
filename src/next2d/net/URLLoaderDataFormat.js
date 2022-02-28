/**
 * URLLoaderDataFormat クラスは、ダウンロードされるデータの受信方法を指定する値を提供します。
 *
 * The URLLoaderDataFormat class provides values that specify how downloaded data is received.
 *
 * @class
 * @memberOf next2d.net
 */
class URLLoaderDataFormat
{
    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class URLLoaderDataFormat]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class URLLoaderDataFormat]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.net.URLLoaderDataFormat
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.net.URLLoaderDataFormat";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object URLLoaderDataFormat]
     * @method
     * @public
     */
    toString ()
    {
        return "[object URLLoaderDataFormat]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.net.URLLoaderDataFormat
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.net.URLLoaderDataFormat";
    }

    /**
     * @description ダウンロードされるデータを生のバイナリデータとして受信することを指定します。
     *              Specifies that downloaded data is received as raw binary data.
     *
     * @return  {string}
     * @default arraybuffer
     * @const
     * @static
     */
    static get ARRAY_BUFFER ()
    {
        return "arraybuffer";
    }

    /**
     * @description ダウンロードされるデータをJSONとして受信することを指定します。
     *              Specifies that downloaded data is received as string.
     *
     * @return  {string}
     * @default json
     * @const
     * @static
     */
    static get JSON ()
    {
        return "json";
    }
}
