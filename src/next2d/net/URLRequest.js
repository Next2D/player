/**
 * URLRequest クラスは、すべての情報を 1 つの HTTP 要求にキャプチャします
 *
 * The URLRequest class captures all of the information in a single HTTP request.
 *
 * @class
 * @memberOf next2d.net
 */
class URLRequest
{
    /**
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
        this._$url = url;

        /**
         * @type {string}
         * @default application/json
         * @private
         */
        this._$contentType = "application/json";

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$data = null;

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

        /**
         * @type {string}
         * @default URLLoaderDataFormat.JSON
         * @private
         */
        this._$responseDataFormat = URLLoaderDataFormat.JSON;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$withCredentials = false;
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
    static toString ()
    {
        return "[class URLRequest]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.net.URLRequest
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.net.URLRequest";
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
     * @default next2d.net.URLRequest
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.net.URLRequest";
    }

    /**
     * @description data プロパティのコンテンツの MIME コンテンツタイプです。
     *              The MIME content type of the content in the the data property.
     *
     * @member {string}
     * @default application/json
     * @public
     */
    get contentType ()
    {
        return this._$contentType;
    }
    set contentType (content_type)
    {
        this._$contentType = `${content_type}`;
    }

    /**
     * @description URL リクエストで送信されるデータを含むオブジェクトです。
     *              An object containing data to be transmitted with the URL request.
     *
     * @member {string|object}
     * @public
     */
    get data ()
    {
        return this._$data;
    }
    set data (data)
    {
        this._$data = data;
    }

    /**
     * @description HTTP フォーム送信メソッドを制御します。
     *              Controls the HTTP form submission method.
     *
     * @member  {string}
     * @default URLRequestMethod.GET
     * @public
     */
    get method ()
    {
        return this._$method;
    }
    set method (method)
    {
        method += "";
        switch (method.toUpperCase()) {

            case URLRequestMethod.DELETE:
            case URLRequestMethod.HEAD:
            case URLRequestMethod.OPTIONS:
            case URLRequestMethod.POST:
            case URLRequestMethod.PUT:
                this._$method = method;
                break;

            default:
                this._$method = URLRequestMethod.GET;
                break;
        }
    }

    /**
     * @description HTTP リクエストヘッダーの配列が HTTP リクエストに追加されます。
     *              The array of HTTP request headers to be appended to the HTTP request.
     *
     * @member {URLRequestHeader[]}
     * @public
     */
    get requestHeaders ()
    {
        return this._$requestHeaders;
    }
    set requestHeaders (request_headers)
    {
        if (Util.$isArray(request_headers)) {
            this._$requestHeaders = request_headers;
        }
    }

    /**
     * @description リクエストされる URL です。
     *              The URL to be requested.
     *
     * @member {string}
     * @public
     */
    get url ()
    {
        if (this._$url && this._$url.indexOf("//") === -1) {

            const urls = this._$url.split("/");
            if (urls[0] === "" || urls[0] === ".") {
                urls.shift();
            }

            const player = Util.$currentPlayer();
            if (player) {
                return `${player.base}${urls.join("/")}`;
            }
        }

        return this._$url;
    }
    set url (url)
    {
        this._$url = `${url}`;
    }

    /**
     * @description HTTP 要求で使用されるユーザーエージェントストリングを指定します。
     *              Specifies the user-agent string to be used in the HTTP request.
     *
     * @member {string}
     * @readonly
     * @public
     */
    get userAgent ()
    {
        return this._$userAgent;
    }

    /**
     * @description レスポンスのデータフォーマットを指定します。
     *              Specifies the data format of the response.
     *
     * @member {string}
     * @default URLLoaderDataFormat.JSON
     * @public
     */
    get responseDataFormat ()
    {
        return this._$responseDataFormat;
    }
    set responseDataFormat (format)
    {
        this._$responseDataFormat = `${format}`;
    }

    /**
     * @description HTTP 要求で使用されるユーザーエージェントストリングを指定します。
     *              Specifies the user-agent string to be used in the HTTP request.
     *
     * @member {boolean}
     * @default false
     * @readonly
     * @public
     */
    get withCredentials ()
    {
        return this._$withCredentials;
    }

    /**
     * @description リクエストされる Header Object
     *              Header Object to be requested.
     *
     * @member {Map}
     * @readonly
     * @public
     */
    get headers ()
    {
        const headers = Util.$getMap();
        headers.set("Content-Type", `${this._$contentType}`);

        const length = this._$requestHeaders.length;
        for (let idx = 0; idx < length; ++idx) {

            const urlRequestHeader = this._$requestHeaders[idx];

            if (urlRequestHeader instanceof URLRequestHeader) {
                headers.set(urlRequestHeader.name, urlRequestHeader.value);
            }
        }

        return headers;
    }
}
