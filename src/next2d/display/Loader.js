/**
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObjectContainer
 */
class Loader extends DisplayObjectContainer
{
    /**
     * Loader クラスは、JSON ファイルまたはイメージ（JPEG、PNG、または GIF）ファイルを読み込むために使用します。
     * 読み込みを開始するには load() メソッドを使用します。
     * 読み込まれた表示オブジェクトは Loader オブジェクトの子として追加されます。
     *
     * The Loader class is used to load JSON files or image (JPEG, PNG, or GIF) files.
     * Use the load() method to initiate loading.
     * The loaded display object is added as a child of the Loader object.
     *
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
    static toString()
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
     * @description JSON、JPEG、プログレッシブ JPEG、非アニメーション GIF
     *              または PNG ファイルを、この Loader オブジェクトの子であるオブジェクトにロードします。
     *              Loads a JSON, JPEG, progressive JPEG, unanimated GIF
     *              or PNG file into an object that is a child of this Loader object.
     *
     * @param   {URLRequest} request
     * @returns {void}
     * @method
     * @public
     */
    load (request)
    {
        if (!(request instanceof URLRequest)) {
            return ;
        }

        const loaderInfo    = this.contentLoaderInfo;
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

                    loaderInfo.dispatchEvent(new Event(Event.OPEN));
                    loaderInfo.dispatchEvent(new ProgressEvent(
                        ProgressEvent.PROGRESS,
                        false, false, event.loaded, event.total
                    ));

                }.bind(this),
                "progress": function (event)
                {
                    const loaderInfo = this.contentLoaderInfo;

                    // set
                    loaderInfo._$bytesLoaded = event.loaded;
                    loaderInfo._$bytesTotal  = event.total;

                    // progress event
                    loaderInfo.dispatchEvent(new ProgressEvent(
                        ProgressEvent.PROGRESS,
                        false, false, event.loaded, event.total
                    ));

                }.bind(this),
                "loadend": function (event)
                {
                    const loaderInfo = this.contentLoaderInfo;

                    // set
                    loaderInfo._$bytesLoaded = event.loaded;
                    loaderInfo._$bytesTotal  = event.total;

                    // progress event
                    loaderInfo.dispatchEvent(new ProgressEvent(
                        ProgressEvent.PROGRESS,
                        false, false, event.loaded, event.total
                    ));

                    // http status event
                    const responseHeaders = Util.$getArray();

                    const headers = Util.$headerToArray(
                        event.target.getAllResponseHeaders()
                    );

                    let contentType = "";
                    const length  = headers.length;
                    for (let idx = 0; idx < length; ++idx) {

                        const obj = headers[idx];

                        if (obj.name === "content-type") {
                            contentType = obj.value;
                        }

                        responseHeaders.push(new URLRequestHeader(obj.name, obj.value));

                    }

                    const httpStatusEvent = new HTTPStatusEvent(
                        HTTPStatusEvent.HTTP_STATUS, false, false,
                        event.target.status
                    );

                    httpStatusEvent.responseURL     = event.target.responseURL;
                    httpStatusEvent.responseHeaders = responseHeaders;

                    loaderInfo.dispatchEvent(httpStatusEvent);

                    if (199 < event.target.status && 400 > event.target.status) {

                        switch (loaderInfo.format) {

                            case URLLoaderDataFormat.ARRAY_BUFFER:
                                // TODO
                                // buffer clone
                                // this._$byteArray = event.target.response;
                                // this._$decodeImage({
                                //     "type": "image/" + reComposition.imageType
                                // });
                                break;

                            case URLLoaderDataFormat.STRING:

                                const object = JSON.parse(event.target.responseText);
                                console.log(object);

                                // setup
                                loaderInfo._$characters = object.characters;
                                loaderInfo._$symbols    = object.symbols;

                                loaderInfo._$content = new MovieClip();
                                loaderInfo._$content._$loaderInfo = loaderInfo;
                                loaderInfo._$content._$build(object.characters[0]);

                                const player = Util.$currentPlayer();
                                if (loaderInfo._$mainInfo) {

                                    player.width  = object.stage.width;
                                    player.height = object.stage.height;

                                    const stage = player.stage;
                                    stage.frameRate = object.stage.fps;

                                    // TODO
                                    player._$context._$setColor(1, 1, 1, 1);

                                    // background color
                                    // const color = loaderInfo._$backgroundColor;
                                    // if (color) {
                                    //     this._$player.setBackgroundColor(color.R, color.G, color.B);
                                    // }
                                }

                                player._$loaders.push(loaderInfo);
                                break;

                        }

                    } else {

                        loaderInfo.dispatchEvent(
                            new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, event.target.statusText)
                        );

                    }

                }.bind(this)
            }
        });
    }




}