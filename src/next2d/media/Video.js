/**
 * @class
 * @memberOf next2d.media
 * @extends  DisplayObject
 */
class Video extends DisplayObject
{
    /**
     * サーバーまたはローカルに保存された録画済みビデオファイルを再生する Video オブジェクトです。
     * ビデオストリームを再生するには、attachNetStream() を使用して、ビデオを Video オブジェクトに関連付けます。
     * 次に、addChild() を使用して、Video オブジェクトを表示リストに追加します。
     *
     * A Video object that plays a recorded video file stored on a server or locally.
     * To play a video stream, use attachNetStream() to attach the video to the Video object.
     * Then, add the Video object to the display list using addChild().
     *
     * @param {number} [width = 320]
     * @param {number} [height = 240]
     *
     * @constructor
     * @public
     */
    constructor(width = 320, height = 240)
    {
        super();

        /**
         * @type {number}
         * @default 320
         * @private
         */
        this._$videoWidth = width;

        /**
         * @type {number}
         * @default 240
         * @private
         */
        this._$videoHeight = height;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$smoothing = false;

        /**
         * @type {NetStream}
         * @default null
         * @private
         */
        this._$netStream = null;

        /**
         * @type {Uint8Array}
         * @default null
         * @private
         */
        this._$buffer = null;

        /**
         * @type {object}
         * @private
         */
        this._$bounds = Util.$getBoundsObject(0, width, 0, height);

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$timerId = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$currentFrame = -1;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$play = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$pause = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$update = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$start = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$sound = null;

        /**
         * @type {HTMLVideoElement}
         * @default null
         * @private
         */
        this._$video = null;

        /**
         * @type {WebGLTexture}
         * @default null
         * @private
         */
        this._$texture = null;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Video]
     * @method
     * @static
     */
    static toString()
    {
        return "[class Video]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.media.Video
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.media.Video";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Video]
     * @method
     * @public
     */
    toString ()
    {
        return "[object Video]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.media.Video
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.media.Video";
    }

    /**
     * @description ビデオを拡大 / 縮小する際にスムージング（補間）するかどうかを指定します。
     *              Specifies whether the video should be smoothed (interpolated)
     *              when it is scaled.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get smoothing ()
    {
        return this._$smoothing;
    }
    set smoothing (smoothing)
    {
        this._$smoothing = smoothing;
    }

    /**
     * @description ビデオストリームの高さをピクセル単位で指定する整数です。
     *              An integer specifying the height of the video stream, in pixels.
     *
     * @member {number}
     * @default 320
     * @readonly
     * @public
     */
    get videoHeight ()
    {
        return (this._$video) ? this._$video.videoHeight : this._$bounds.xMax;
    }

    /**
     * @description ビデオストリームの幅をピクセル単位で指定する整数です。
     *              An integer specifying the width of the video stream, in pixels.
     *
     * @member {number}
     * @default 240
     * @readonly
     * @public
     */
    get videoWidth ()
    {
        return (this._$video) ? this._$video.videoWidth : this._$bounds.yMax;
    }

    /**
     * @description アプリケーション内の Video オブジェクトの境界内に表示するビデオストリームを指定します。
     *              Specifies a video stream to be displayed
     *              within the boundaries of the Video object in the application.
     *
     * @param   {NetStream} net_stream
     * @returns {void}
     * @method
     * @public
     */
    attachNetStream (net_stream)
    {
        this._$netStream = net_stream;
        this._$netStream._$video = this;

        // reset
        this._$play    = null;
        this._$pause   = null;
        this._$update  = null;
        this._$start   = null;
        this._$sound   = null;
        this._$video   = null;
        this._$texture = null;
    }

    /**
     * TODO
     * @description Video オブジェクトに現在表示されているイメージ（ビデオストリームではない）をクリアします。
     *              Clears the image currently displayed
     *              in the Video object (not the video stream).
     *
     * @returns {void}
     * @method
     * @public
     */
    clear ()
    {
        this._$buffer = null;
        if (this._$texture) {

        }
    }




    
}