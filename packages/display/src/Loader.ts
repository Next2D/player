import { DisplayObjectContainer } from "./DisplayObjectContainer";
import { LoaderInfo } from "./LoaderInfo";
import { MovieClip } from "./MovieClip";
import { URLRequest } from "@next2d/net";
import { $getMap } from "@next2d/share";
import {
    IOErrorEvent,
    Event,
    ProgressEvent as Next2DProgressEvent,
    HTTPStatusEvent
} from "@next2d/events";
import type { Player } from "@next2d/core";
import type {
    NoCodeDataZlibImpl,
    NoCodeDataImpl,
    ParentImpl,
    MovieClipCharacterImpl
} from "@next2d/interface";
import {
    $ajax,
    $headerToArray,
    $unzipQueues,
    $updateUnzipWorkerStatus,
    $getUnzipWorker,
    $currentPlayer,
    $useUnzipWorker
} from "@next2d/util";

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
export class Loader extends DisplayObjectContainer
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {LoaderInfo}
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
    static toString (): string
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
    static get namespace (): string
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
    toString (): string
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
     * @public
     */
    get namespace (): string
    {
        return "next2d.display.Loader";
    }

    /**
     * @description load メソッドを使用して読み込まれた JSON のルート表示オブジェクトが含まれます。
     *              It contains a JSON root display object loaded using the load method.
     *
     * @member {MovieClip | Sprite | null}
     * @readonly
     * @public
     */
    get content (): ParentImpl<any> | null
    {
        return this._$loaderInfo ? this._$loaderInfo.content : null;
    }

    /**
     * @description 読み込まれているオブジェクトに対応する LoaderInfo オブジェクトを返します。
     *              Returns a LoaderInfo object corresponding to the object being loaded.
     *
     * @member {LoaderInfo}
     * @readonly
     * @public
     */
    get contentLoaderInfo (): LoaderInfo
    {
        return this._$loaderInfo as NonNullable<LoaderInfo>;
    }

    /**
     * @description JSONファイルを、この Loader オブジェクトの子であるcontentプロパティにロードします。
     *              JPEG、GIF、PNGなどの画像データは loadImage で同様にcontentプロパティにロードします。
     *              Load the JSON file into the content property, which is a child of this Loader object.
     *              Image data such as JPEG, GIF, PNG, etc.
     *              are loaded into the content property in the same way with loadImage.
     *
     * @param   {URLRequest} request
     * @returns {void}
     * @method
     * @public
     */
    load (request: URLRequest): void
    {
        const loaderInfo: LoaderInfo | null = this._$loaderInfo;
        if (!loaderInfo) {
            return ;
        }

        loaderInfo.url    = request.url;
        loaderInfo.format = request.responseDataFormat;

        $ajax({
            "format": request.responseDataFormat,
            "url": request.url,
            "method": request.method,
            "data": request.data,
            "headers": request.headers,
            "withCredentials": request.withCredentials,
            "event": {
                "loadstart": (event: ProgressEvent) =>
                {
                    this._$loadstart(event);
                },
                "progress": (event: ProgressEvent) =>
                {
                    this._$progress(event);
                },
                "loadend": (event: ProgressEvent) =>
                {
                    this._$loadend(event);
                }
            }
        });
    }

    /**
     * @description NoCodeToolのJSONを直接読み込む
     *              Read JSON directly from NoCodeTool
     *
     * @param  {object} json
     * @return {void}
     * @method
     * @public
     */
    loadJSON (json: any): void
    {
        if (json.type === "zlib") {

            if ($useUnzipWorker()) {

                $unzipQueues.push(json);

                return ;
            }

            $updateUnzipWorkerStatus(true);

            const unzipWorker: Worker = $getUnzipWorker();

            const buffer: Uint8Array = new Uint8Array(json.buffer);
            unzipWorker.onmessage = (event: MessageEvent) =>
            {
                this._$unzipHandler(event);
            };
            unzipWorker.postMessage(buffer, [buffer.buffer]);

        } else {

            this._$build(json);

        }
    }

    /**
     * @param  {ProgressEvent} event
     * @return {void}
     * @method
     * @private
     */
    _$loadend (event: ProgressEvent): void
    {
        const loaderInfo: LoaderInfo | null = this._$loaderInfo;
        if (!loaderInfo) {
            return ;
        }

        // set
        loaderInfo.bytesLoaded = event.loaded;
        loaderInfo.bytesTotal  = event.total;

        // progress event
        if (loaderInfo.willTrigger(Next2DProgressEvent.PROGRESS)) {
            loaderInfo.dispatchEvent(new Next2DProgressEvent(
                Next2DProgressEvent.PROGRESS,
                false, false, event.loaded, event.total
            ));
        }

        const target: any = event.target;

        // http status event
        if (loaderInfo.willTrigger(HTTPStatusEvent.HTTP_STATUS)) {

            const responseHeaders = $headerToArray(
                target.getAllResponseHeaders()
            );

            loaderInfo.dispatchEvent(new HTTPStatusEvent(
                HTTPStatusEvent.HTTP_STATUS, false, false,
                target.status, target.responseURL,
                responseHeaders
            ));
        }

        if (199 < target.status && 400 > target.status) {

            if (loaderInfo.format === "json") {

                this.loadJSON(target.response);

            } else {

                if (loaderInfo.willTrigger(IOErrorEvent.IO_ERROR)) {
                    loaderInfo.dispatchEvent(new IOErrorEvent(
                        IOErrorEvent.IO_ERROR, false, false,
                        "LoaderInfo format is `json`"
                    ));
                }

            }

        } else {

            if (loaderInfo.willTrigger(IOErrorEvent.IO_ERROR)) {
                loaderInfo.dispatchEvent(new IOErrorEvent(
                    IOErrorEvent.IO_ERROR, false, false,
                    target.statusText
                ));
            }

        }

    }

    /**
     * @param  {MessageEvent} event
     * @return {void}
     * @method
     * @private
     */
    _$unzipHandler (event: MessageEvent): void
    {
        this._$build(event.data);

        if ($unzipQueues.length) {

            const object: NoCodeDataZlibImpl | void = $unzipQueues.pop();
            if (!object) {
                return ;
            }

            const buffer: Uint8Array = new Uint8Array(object.buffer);

            const unzipWorker = $getUnzipWorker();

            unzipWorker.onmessage = (event: MessageEvent) =>
            {
                this._$unzipHandler(event);
            };
            unzipWorker.postMessage(buffer, [buffer.buffer]);

        } else {

            $updateUnzipWorkerStatus(false);

        }
    }

    /**
     * @param  {ProgressEvent} event
     * @return {void}
     * @method
     * @private
     */
    _$loadstart (event: ProgressEvent): void
    {
        const loaderInfo: LoaderInfo | null = this._$loaderInfo;
        if (!loaderInfo) {
            return ;
        }

        loaderInfo.bytesLoaded = event.loaded;
        loaderInfo.bytesTotal  = event.total;

        if (loaderInfo.willTrigger(Event.OPEN)) {
            loaderInfo.dispatchEvent(new Event(Event.OPEN));
        }

        if (loaderInfo.willTrigger(Next2DProgressEvent.PROGRESS)) {
            loaderInfo.dispatchEvent(new Next2DProgressEvent(
                Next2DProgressEvent.PROGRESS,
                false, false, event.loaded, event.total
            ));
        }
    }

    /**
     * @param  {ProgressEvent} event
     * @return {void}
     * @method
     * @private
     */
    _$progress (event: ProgressEvent): void
    {
        const loaderInfo: LoaderInfo | null = this._$loaderInfo;
        if (!loaderInfo) {
            return ;
        }

        // set
        loaderInfo.bytesLoaded = event.loaded;
        loaderInfo.bytesTotal  = event.total;

        // progress event
        if (loaderInfo.willTrigger(Next2DProgressEvent.PROGRESS)) {
            loaderInfo.dispatchEvent(new Next2DProgressEvent(
                Next2DProgressEvent.PROGRESS,
                false, false, event.loaded, event.total
            ));
        }
    }

    /**
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    _$build (object: NoCodeDataImpl): void
    {
        const loaderInfo: LoaderInfo | null = this._$loaderInfo;
        if (!loaderInfo) {
            return ;
        }

        const symbols: Map<string, number> = $getMap();
        if (object.symbols.length) {
            for (let idx: number = 0; idx < object.symbols.length; ++idx) {

                const values: any[] = object.symbols[idx];

                symbols.set(values[0], values[1]);
            }
        }

        loaderInfo._$data = {
            "stage": object.stage,
            "characters": object.characters,
            "symbols": symbols
        };

        // setup
        loaderInfo._$content = new MovieClip();

        // build root
        const root: MovieClipCharacterImpl = object.characters[0];
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

        // fixed logic
        loaderInfo._$content._$added      = false;
        loaderInfo._$content._$addedStage = false;

        // to event
        const player: Player = $currentPlayer();
        player._$loaders.push(loaderInfo);

        if (player._$loadStatus === 1) { // LOAD_START
            player._$loadStatus = 2; // LOAD_END
        }
    }
}
