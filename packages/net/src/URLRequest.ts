import type { URLRequestHeaderImpl } from "./interface/URLRequestHeaderImpl";
import type { URLLoaderDataFormatImpl } from "./interface/URLLoaderDataFormatImpl";
import type { URLRequestMethodImpl } from "./interface/URLRequestMethodImpl";

/**
 * @description URLRequestクラスは、外部へのリクエストを管理するクラスです
 *              The URLRequest class is a class that manages external requests
 *
 * @class
 * @memberOf next2d.net
 */
export class URLRequest
{
    private _$url: string;
    private _$contentType: string;
    private _$data: any;
    private _$method: URLRequestMethodImpl;
    private readonly _$requestHeaders: URLRequestHeaderImpl[];
    private _$responseDataFormat: URLLoaderDataFormatImpl;
    private _$withCredentials: boolean;

    /**
     * @param {string} [url=""]
     *
     * @constructor
     * @public
     */
    constructor (url: string = "")
    {
        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$url = `${url}`;

        /**
         * @type {string}
         * @default application/json
         * @private
         */
        this._$contentType = "application/json";

        /**
         * @type {any}
         * @default null
         * @private
         */
        this._$data = null;

        /**
         * @type {string}
         * @default "GET"
         * @private
         */
        this._$method = "GET";

        /**
         * @type {array}
         * @private
         */
        this._$requestHeaders = [];

        /**
         * @type {string}
         * @default "json"
         * @private
         */
        this._$responseDataFormat = "json";

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
     * @default "[class URLRequest]"
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class URLRequest]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default "next2d.net.URLRequest"
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.net.URLRequest";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default "[object URLRequest]"
     * @method
     * @public
     */
    toString (): string
    {
        return "[object URLRequest]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default "next2d.net.URLRequest"
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.net.URLRequest";
    }

    /**
     * @description data プロパティのコンテンツの MIME コンテンツタイプです。
     *              The MIME content type of the content in the the data property.
     *
     * @member {string}
     * @default "application/json"
     * @public
     */
    get contentType (): string
    {
        return this._$contentType;
    }
    set contentType (content_type: string)
    {
        this._$contentType = `${content_type}`;
    }

    /**
     * @description URL リクエストで送信されるデータを含むオブジェクトです。
     *              An object containing data to be transmitted with the URL request.
     *
     * @member {any}
     * @public
     */
    get data (): any
    {
        return this._$data;
    }
    set data (data: any)
    {
        this._$data = data;
    }

    /**
     * @description HTTP フォーム送信メソッドを制御します。
     *              Controls the HTTP form submission method.
     *
     * @member  {string}
     * @default "GET"
     * @public
     */
    get method (): URLRequestMethodImpl
    {
        return this._$method;
    }
    set method (method: URLRequestMethodImpl)
    {
        this._$method = `${method}`;
    }

    /**
     * @description HTTP リクエストヘッダーの配列が HTTP リクエストに追加されます。
     *              The array of HTTP request headers to be appended to the HTTP request.
     *
     * @member {URLRequestHeaderImpl[]}
     * @public
     */
    get requestHeaders (): URLRequestHeaderImpl[]
    {
        return this._$requestHeaders;
    }
    set requestHeaders (request_headers: URLRequestHeaderImpl[])
    {
        this._$requestHeaders.length = 0;
        this._$requestHeaders.push(...request_headers);
    }

    /**
     * @description リクエストされる URL です。
     *              The URL to be requested.
     *
     * @member {string}
     * @public
     */
    get url (): string
    {
        return this._$url;
    }
    set url (url: string)
    {
        this._$url = `${url}`;
    }

    /**
     * @description レスポンスのデータフォーマットを指定します。
     *              Specifies the data format of the response.
     *
     * @member {string}
     * @default "json"
     * @public
     */
    get responseDataFormat (): URLLoaderDataFormatImpl
    {
        return this._$responseDataFormat;
    }
    set responseDataFormat (format: URLLoaderDataFormatImpl)
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
    get withCredentials (): boolean
    {
        return this._$withCredentials;
    }
    set withCredentials (with_credentials: boolean)
    {
        this._$withCredentials = with_credentials;
    }

    /**
     * @description リクエストされる URLRequestHeader Object
     *              URLRequestHeader Object to be requested.
     *
     * @member {array}
     * @readonly
     * @public
     */
    get headers (): URLRequestHeaderImpl[]
    {
        const headers = [];
        headers.push({
            "name": "Content-Type",
            "value": this._$contentType
        });
        if (this._$requestHeaders.length) {
            headers.push(...this._$requestHeaders);
        }
        return headers;
    }
}
