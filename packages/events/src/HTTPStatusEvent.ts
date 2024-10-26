import type { IURLRequestHeader } from "./interface/IURLRequestHeader";
import { Event } from "./Event";

/**
 * @description ネットワーク要求が HTTP ステータスコードを返すと、アプリケーションによって HTTPStatusEvent オブジェクトが送出されます。
 *              The application dispatches HTTPStatusEvent objects when a network request returns an HTTP status code.
 *
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
export class HTTPStatusEvent extends Event
{
    /**
     * @description サーバーから返された HTTP ステータスコードです。
     *              The HTTP status code returned by the server.
     *
     * @return {number}
     * @readonly
     * @public
     */
    public readonly status: number;

    /**
     * @description 返された応答ヘッダー（URLRequestHeader オブジェクトの配列）です。
     *              The response headers that the response returned,
     *              as an array of URLRequestHeader objects.
     *
     * @return {array}
     * @readonly
     * @public
     */
    public readonly responseHeaders: IURLRequestHeader[];

    /**
     * @description 応答の返送元の URL です。
     *              The URL that the response was returned from.
     *
     * @return {string}
     * @readonly
     * @public
     */
    public readonly responseURL: string;

    /**
     * @param {string}  type
     * @param {boolean} [bubbles=false]
     * @param {number}  [status=0]
     * @param {string}  [response_url=""]
     * @param {array}   [response_headers=[]]
     *
     * @constructor
     * @public
     */
    constructor (
        type: string,
        bubbles: boolean = false,
        status: number = 0,
        response_url: string = "",
        response_headers: IURLRequestHeader[] = []
    ) {

        super(type, bubbles);

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this.status = status | 0;

        /**
         * @type {array}
         * @default {array}
         * @private
         */
        this.responseHeaders = response_headers;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this.responseURL = response_url;
    }

    /**
     * @description HTTPStatusEvent.HTTP_STATUS 定数は、
     *              httpStatus イベントオブジェクトの type プロパティの値を定義します。
     *              The HTTPStatusEvent.HTTP_STATUS constant defines the value
     *              of the type property of a httpStatus event object.
     *
     * @return {string}
     * @default "httpStatus"
     * @const
     * @static
     */
    static get HTTP_STATUS (): string
    {
        return "httpStatus";
    }
}