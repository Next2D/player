import type { IURLRequestHeader } from "./interface/IURLRequestHeader";
import type { IURLLoaderDataFormat } from "./interface/IURLLoaderDataFormat";
import type { IURLRequestMethod } from "./interface/IURLRequestMethod";

/**
 * @description URLRequestクラスは、外部へのリクエストを管理するクラスです
 *              The URLRequest class is a class that manages external requests
 *
 * @class
 * @memberOf next2d.net
 */
export class URLRequest
{
    /**
     * @description HTTP リクエストヘッダーの配列が HTTP リクエストに追加されます。
     *              The array of HTTP request headers to be appended to the HTTP request.
     *
     * @type {array}
     * @public
     */
    public requestHeaders: IURLRequestHeader[];

    /**
     * @description リクエストされる URL です。
     *              The URL to be requested.
     *
     * @type {string}
     * @default ""
     * @public
     */
    public url: string;

    /**
     * @description data プロパティのコンテンツの MIME コンテンツタイプです。
     *              The MIME content type of the content in the the data property.
     *
     * @type {string}
     * @default application/json
     * @public
     */
    public contentType: string;

    /**
     * @description URL リクエストで送信されるデータを含むオブジェクトです。
     *              An object containing data to be transmitted with the URL request.
     *
     * @type {any}
     * @default null
     * @public
     */
    public data: any;

    /**
     * @description HTTP フォーム送信メソッドを制御します。
     *              Controls the HTTP form submission method.
     *
     * @type {string}
     * @default "GET"
     * @public
     */
    public method: IURLRequestMethod;

    /**
     * @description レスポンスのデータフォーマットを指定します。
     *              Specifies the data format of the response.
     *
     * @type {string}
     * @default "json"
     * @public
     */
    public responseDataFormat: IURLLoaderDataFormat;

    /**
     * @description HTTP 要求で使用されるユーザーエージェントストリングを指定します。
     *              Specifies the user-agent string to be used in the HTTP request.
     *
     * @type {boolean}
     * @default false
     * @public
     */
    public withCredentials: boolean;

    /**
     * @param {string} [url=""]
     *
     * @constructor
     * @public
     */
    constructor (url: string = "")
    {
        this.url                = `${url}`;
        this.contentType        = "application/json";
        this.data               = null;
        this.method             = "GET";
        this.requestHeaders     = [];
        this.responseDataFormat = "json";
        this.withCredentials    = false;
    }

    /**
     * @description リクエストされる URLRequestHeader Object
     *              URLRequestHeader Object to be requested.
     *
     * @member {array}
     * @readonly
     * @public
     */
    get headers (): IURLRequestHeader[]
    {
        const headers = [];
        headers.push({
            "name": "Content-Type",
            "value": this.contentType
        });
        if (this.requestHeaders.length) {
            headers.push(...this.requestHeaders);
        }
        return headers;
    }
}
