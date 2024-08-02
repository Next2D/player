import type { ParentImpl } from "./interface/ParentImpl";
import type { Sprite } from "./Sprite";
import { DisplayObjectContainer } from "./DisplayObjectContainer";
import { LoaderInfo } from "./LoaderInfo";
import { MovieClip } from "./MovieClip";
import { URLRequest } from "@next2d/net";
import { $ajax } from "./DisplayObjectUtil";
import { execute as loaderLoadstartEventService } from "./Loader/LoaderLoadStartEventService";
import { execute as loaderProgressEventService } from "./Loader/LoaderProgressEventService";
import { execute as loaderLoadEndEventService } from "./Loader/LoaderLoadEndEventService";
import { execute as loaderLoadJsonService } from "./Loader/LoaderLoadJsonService";

/**
 * @description Loader クラスは、JSON ファイルを読み込むために使用します。
 *              外部からの読み込みを開始するには load() メソッドを使用し、ローカルのJSONを読み込むには loadJSON() メソッドを使用します。
 *
 *              The Loader class is used to load JSON files.
 *              To start loading from an external source, use the load() method, and to load local JSON, use the loadJSON() method.
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
     * @default "[class Loader]"
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
     * @default "next2d.display.Loader"
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
     * @default "[object Loader]"
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
     * @default "next2d.display.Loader"
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
    get content (): ParentImpl<MovieClip | Sprite> | null
    {
        return (this._$loaderInfo as NonNullable<LoaderInfo>).content;
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
     * @returns {Promise}
     * @method
     * @public
     */
    async load (request: URLRequest): Promise<void>
    {
        const loaderInfo  = this._$loaderInfo as NonNullable<LoaderInfo>;
        loaderInfo.url    = request.url;
        loaderInfo.format = request.responseDataFormat;

        if (loaderInfo.format !== "json") {
            throw new Error("The only format that can be loaded by this function is `json` format.");
        }

        await new Promise<void>((resolve): void =>
        {
            $ajax({
                "format": request.responseDataFormat,
                "url": request.url,
                "method": request.method,
                "data": request.data,
                "headers": request.headers,
                "withCredentials": request.withCredentials,
                "event": {
                    "loadstart": (event: ProgressEvent): void =>
                    {
                        loaderLoadstartEventService(loaderInfo, event);
                    },
                    "progress": (event: ProgressEvent): void =>
                    {
                        loaderProgressEventService(loaderInfo, event);
                    },
                    "loadend": async (event: ProgressEvent): Promise<void> =>
                    {
                        await loaderLoadEndEventService(loaderInfo, event);
                        resolve();
                    }
                }
            });
        });
    }

    /**
     * @description NoCodeToolのJSONを直接読み込む
     *              Read JSON directly from NoCodeTool
     *
     * @param  {string} json
     * @return {void}
     * @method
     * @public
     */
    async loadJSON (json: string): Promise<void>
    {
        const loaderInfo = this._$loaderInfo as NonNullable<LoaderInfo>;
        await loaderLoadJsonService(loaderInfo, json);
    }

    /**
     * @param  {object} object
     * @return {void}
     * @method
     * @private
     */
    // _$build (object: NoCodeDataImpl): void
    // {
    //     const loaderInfo: LoaderInfo | null = this._$loaderInfo;
    //     if (!loaderInfo) {
    //         return ;
    //     }

    //     const symbols: Map<string, number> = $getMap();
    //     if (object.symbols.length) {
    //         for (let idx: number = 0; idx < object.symbols.length; ++idx) {

    //             const values: any[] = object.symbols[idx];

    //             symbols.set(values[0], values[1]);
    //         }
    //     }

    //     loaderInfo._$data = {
    //         "stage": object.stage,
    //         "characters": object.characters,
    //         "symbols": symbols
    //     };

    //     // setup
    //     loaderInfo._$content = new MovieClip();

    //     // build root
    //     const root: MovieClipCharacterImpl = object.characters[0];
    //     loaderInfo._$content._$build({
    //         "characterId": 0,
    //         "clipDepth": 0,
    //         "depth": 0,
    //         "endFrame": root.controller.length,
    //         "startFrame": 1
    //     }, this);

    //     // fixed logic
    //     loaderInfo._$content._$parent = null;
    //     this.addChild(loaderInfo._$content);

    //     // fixed logic
    //     loaderInfo._$content._$added      = false;
    //     loaderInfo._$content._$addedStage = false;

    //     // to event
    //     const player: Player = $currentPlayer();
    //     player._$loaders.push(loaderInfo);

    //     if (player._$loadStatus === 1) { // LOAD_START
    //         player._$loadStatus = 2; // LOAD_END
    //     }
    // }
}
