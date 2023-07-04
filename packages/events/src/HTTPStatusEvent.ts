import { Event } from "./Event";
import type { URLRequestHeader } from "@next2d/net";

/**
 * ネットワーク要求が HTTP ステータスコードを返すと、アプリケーションによって HTTPStatusEvent オブジェクトが送出されます。
 *
 * The application dispatches HTTPStatusEvent objects when a network request returns an HTTP status code.
 *
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
export class HTTPStatusEvent extends Event
{
    private readonly _$status: number;
    private readonly _$responseHeaders: URLRequestHeader[];
    private readonly _$responseURL: string;

    /**
     * @param {string}  type
     * @param {boolean} [bubbles=false]
     * @param {boolean} [cancelable=false]
     * @param {number}  [status=0]
     * @param {string}  [response_url=""]
     * @param {array}   [response_headers=[]]
     *
     * @constructor
     * @public
     */
    constructor (
        type: string, bubbles: boolean = false, cancelable: boolean = false,
        status: number = 0, response_url: string = "",
        response_headers: URLRequestHeader[] = []
    ) {

        super(type, bubbles, cancelable);

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$status = status | 0;

        /**
         * @type {array}
         * @default {array}
         * @private
         */
        this._$responseHeaders = response_headers;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$responseURL = response_url;
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class HTTPStatusEvent]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class HTTPStatusEvent]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.events.HTTPStatusEvent
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.events.HTTPStatusEvent";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return {string}
     * @method
     * @public
     */
    toString (): string
    {
        return this.formatToString(
            "HTTPStatusEvent",
            "type", "bubbles", "cancelable",
            "eventPhase", "status", "responseURL"
        );
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.events.HTTPStatusEvent
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.events.HTTPStatusEvent";
    }

    /**
     * @description HTTPStatusEvent.HTTP_STATUS 定数は、
     *              httpStatus イベントオブジェクトの type プロパティの値を定義します。
     *              The HTTPStatusEvent.HTTP_STATUS constant defines the value
     *              of the type property of a httpStatus event object.
     *
     * @return {string}
     * @default httpStatus
     * @const
     * @static
     */
    static get HTTP_STATUS (): string
    {
        return "httpStatus";
    }

    /**
     * @description 返された応答ヘッダー（URLRequestHeader オブジェクトの配列）です。
     *              The response headers that the response returned,
     *              as an array of URLRequestHeader objects.
     *
     * @return {array}
     * @readonly
     * @public
     */
    get responseHeaders (): URLRequestHeader[]
    {
        return this._$responseHeaders;
    }

    /**
     * @description 応答の返送元の URL です。
     *              The URL that the response was returned from.
     *
     * @return {string}
     * @readonly
     * @public
     */
    get responseURL (): string
    {
        return this._$responseURL;
    }

    /**
     * @description サーバーから返された HTTP ステータスコードです。
     *              The HTTP status code returned by the server.
     *
     * @return {number}
     * @readonly
     * @public
     */
    get status (): number
    {
        return this._$status;
    }
}