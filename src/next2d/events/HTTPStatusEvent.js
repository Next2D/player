/**
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
class HTTPStatusEvent extends Event
{
    /**
     * ネットワーク要求が HTTP ステータスコードを返すと、アプリケーションによって HTTPStatusEvent オブジェクトが送出されます。
     *
     * The application dispatches HTTPStatusEvent objects when a network request returns an HTTP status code.
     *
     * @param {string}  type
     * @param {boolean} [bubbles=false]
     * @param {boolean} [cancelable=false]
     * @param {number}  [status=0]
     *
     * @constructor
     * @public
     */
    constructor (type, bubbles = false, cancelable = false, status = 0)
    {
        super(type, bubbles, cancelable);

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$status = status|0;

        /**
         * @type {array}
         * @default {array}
         * @private
         */
        this._$responseHeaders = [];

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$responseURL = "";
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
    static toString()
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
    static get namespace ()
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
    toString ()
    {
        return this.formatToString(
            "HTTPStatusEvent",
            "type", "bubbles", "cancelable", "bytes_loaded", "bytes_total"
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
    get namespace ()
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
    static get HTTP_STATUS ()
    {
        return "httpStatus";
    }

    /**
     * @description 返された応答ヘッダー（URLRequestHeader オブジェクトの配列）です。
     *              The response headers that the response returned,
     *              as an array of URLRequestHeader objects.
     *
     * @return {array}
     * @default {array}
     * @public
     */
    get responseHeaders ()
    {
        return this._$responseHeaders;
    }
    set responseHeaders (response_headers)
    {
        return this._$responseHeaders = response_headers;
    }

    /**
     * @description 応答の返送元の URL です。
     *              The URL that the response was returned from.
     *
     * @return {string}
     * @default ""
     * @public
     */
    get responseURL ()
    {
        return this._$responseURL;
    }
    set responseURL (url)
    {
        this._$responseURL = url;
    }
}