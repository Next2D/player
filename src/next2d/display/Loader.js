/**
 * Loader クラスは、JSON ファイルまたはイメージ（JPEG、PNG、または GIF）ファイルを読み込むために使用します。
 * 読み込みを開始するには load() メソッドを使用します。
 * 読み込まれた表示オブジェクトは Loader オブジェクトの子として追加されます。
 *
 * The Loader class is used to load JSON files or image (JPEG, PNG, or GIF) files.
 * Use the load() method to initiate loading.
 * The loaded display object is added as a child of the Loader object.
 *
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObjectContainer
 */
class Loader extends DisplayObjectContainer
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {LoaderInfo}
         * @default null
         * @private
         */
        this._$loaderInfo = new LoaderInfo();
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Loader]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class Loader]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.Loader
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display.Loader";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Loader]
     * @method
     * @public
     */
    toString ()
    {
        return "[object Loader]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.Loader
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display.Loader";
    }

    /**
     * @description load() または loadJSON() メソッドを使用して読み込まれた JSON ファイル
     *              またはイメージ（JPEG、PNG、または GIF）ファイルのルート表示オブジェクトが含まれます。
     *              Contains the root display object of the JSON file
     *              or image (JPEG, PNG, or GIF) file that was loaded by using the load() or loadJSON() methods.
     *
     * @member {DisplayObject}
     * @readonly
     * @public
     */
    get content ()
    {
        return this._$loaderInfo._$content;
    }

    /**
     * @description 読み込まれているオブジェクトに対応する LoaderInfo オブジェクトを返します。
     *              Returns a LoaderInfo object corresponding to the object being loaded.
     *
     * @member {LoaderInfo}
     * @readonly
     * @public
     */
    get contentLoaderInfo ()
    {
        return this._$loaderInfo;
    }

    /**
     * @description JSON、JPEG、プログレッシブ JPEG、GIFまたは PNG ファイルを、
     *              この Loader オブジェクトの子であるオブジェクトにロードします。
     *              Loads a JSON, JPEG, progressive JPEG, GIF or PNG file
     *              into an object that is a child of this Loader object.
     *
     * @param   {URLRequest} request
     * @returns {void}
     * @method
     * @public
     */
    load (request)
    {
        if (!request || !(request instanceof URLRequest)) {
            return ;
        }

        const loaderInfo = this.contentLoaderInfo;
        switch (request.responseDataFormat) {

            case URLLoaderDataFormat.JSON:
            case URLLoaderDataFormat.ARRAY_BUFFER:
                break;

            default:
                if (loaderInfo.willTrigger(IOErrorEvent.IO_ERROR)) {
                    loaderInfo.dispatchEvent(new IOErrorEvent(
                        IOErrorEvent.IO_ERROR, false, false,
                        "data format is json or arrayBuffer only."
                    ));
                }
                return ;
        }

        loaderInfo._$url    = request.url;
        loaderInfo._$format = request.responseDataFormat;

        Util.$ajax({
            "format": request.responseDataFormat,
            "url": request.url,
            "method": request.method,
            "data": request.data,
            "headers": request.headers,
            "credentials": request.withCredentials,
            "event": {
                "loadstart": function (event)
                {
                    const loaderInfo = this.contentLoaderInfo;

                    loaderInfo._$bytesLoaded = event.loaded;
                    loaderInfo._$bytesTotal  = event.total;

                    if (loaderInfo.willTrigger(Event.OPEN)) {
                        loaderInfo.dispatchEvent(new Event(Event.OPEN));
                    }
                    if (loaderInfo.willTrigger(ProgressEvent.PROGRESS)) {
                        loaderInfo.dispatchEvent(new ProgressEvent(
                            ProgressEvent.PROGRESS,
                            false, false, event.loaded, event.total
                        ));
                    }

                }.bind(this),
                "progress": function (event)
                {
                    const loaderInfo = this.contentLoaderInfo;

                    // set
                    loaderInfo._$bytesLoaded = event.loaded;
                    loaderInfo._$bytesTotal  = event.total;

                    // progress event
                    if (loaderInfo.willTrigger(ProgressEvent.PROGRESS)) {
                        loaderInfo.dispatchEvent(new ProgressEvent(
                            ProgressEvent.PROGRESS,
                            false, false, event.loaded, event.total
                        ));
                    }

                }.bind(this),
                "loadend": function (event)
                {
                    const loaderInfo = this.contentLoaderInfo;

                    // set
                    loaderInfo._$bytesLoaded = event.loaded;
                    loaderInfo._$bytesTotal  = event.total;

                    // progress event
                    if (loaderInfo.willTrigger(ProgressEvent.PROGRESS)) {
                        loaderInfo.dispatchEvent(new ProgressEvent(
                            ProgressEvent.PROGRESS,
                            false, false, event.loaded, event.total
                        ));
                    }

                    // http status event
                    const responseHeaders = Util.$getArray();

                    const headers = Util.$headerToArray(
                        event.target.getAllResponseHeaders()
                    );

                    const length  = headers.length;
                    for (let idx = 0; idx < length; ++idx) {

                        const obj = headers[idx];

                        responseHeaders.push(new URLRequestHeader(obj.name, obj.value));

                    }

                    if (loaderInfo.willTrigger(HTTPStatusEvent.HTTP_STATUS)) {
                        const httpStatusEvent = new HTTPStatusEvent(
                            HTTPStatusEvent.HTTP_STATUS, false, false,
                            event.target.status
                        );

                        httpStatusEvent._$responseURL     = event.target.responseURL;
                        httpStatusEvent._$responseHeaders = responseHeaders;

                        loaderInfo.dispatchEvent(httpStatusEvent);
                    }

                    if (199 < event.target.status && 400 > event.target.status) {

                        switch (loaderInfo.format) {

                            case URLLoaderDataFormat.JSON:
                                {
                                    loaderInfo._$data = JSON.parse(
                                        event.target.responseText
                                    );

                                    const root = loaderInfo._$data.characters[0];

                                    // setup
                                    loaderInfo._$content = new MovieClip();

                                    // build root
                                    loaderInfo._$content._$build({
                                        "characterId": 0,
                                        "clipDepth": 0,
                                        "depth": 0,
                                        "endFrame": root.controller.length,
                                        "startFrame": 1
                                    }, this);

                                    // fixed logic
                                    loaderInfo._$content._$parent = null;
                                    this.addChild(loaderInfo._$content);

                                    loaderInfo._$content._$added      = false;
                                    loaderInfo._$content._$addedStage = false;

                                    const player = Util.$currentPlayer();

                                    // to event
                                    player._$loaders.push(loaderInfo);

                                    // next
                                    if (player._$loadStatus === Player.LOAD_START) {
                                        player._$loadStatus = Player.LOAD_END;
                                    }
                                }
                                break;

                            case URLLoaderDataFormat.ARRAY_BUFFER:
                                // TODO
                                // buffer clone
                                // this._$byteArray = event.target.response;
                                // this._$decodeImage({
                                //     "type": "image/" + reComposition.imageType
                                // });
                                break;

                            case URLLoaderDataFormat.STRING:
                                break;

                            case URLLoaderDataFormat.VARIABLES:
                                break;

                        }

                    } else {

                        if (loaderInfo.willTrigger(IOErrorEvent.IO_ERROR)) {
                            loaderInfo.dispatchEvent(new IOErrorEvent(
                                IOErrorEvent.IO_ERROR, false, false,
                                event.target.statusText
                            ));
                        }

                    }

                }.bind(this)
            }
        });
    }
}