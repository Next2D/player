import type { ParentImpl } from "./interface/ParentImpl";
import type { Sprite } from "./Sprite";
import type { AnimationToolDataImpl } from "./interface/AnimationToolDataImpl";
import type { AnimationToolDataZlibImpl } from "./interface/AnimationToolDataZlibImpl";
import type { MovieClip } from "./MovieClip";
import type { URLRequest } from "@next2d/net";
import { DisplayObjectContainer } from "./DisplayObjectContainer";
import { LoaderInfo } from "./LoaderInfo";
import { execute as loaderLoadJsonUseCase } from "./Loader/usecase/LoaderLoadJsonUseCase";
import { execute as loaderLoadUseCase } from "./Loader/usecase/LoaderLoadUseCase";

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
     * @description 読み込まれているオブジェクトに対応する LoaderInfo オブジェクトを返します。
     *              Returns a LoaderInfo object corresponding to the object being loaded.
     *
     * @member {LoaderInfo}
     * @readonly
     * @public
     */    
    public readonly contentLoaderInfo: LoaderInfo;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        this.contentLoaderInfo = new LoaderInfo();
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return {string}
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.display.Loader";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return {string}
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
        return this.contentLoaderInfo.content;
    }

    /**
     * @description この表示オブジェクトが属するファイルの読み込み情報を含む LoaderInfo オブジェクトを返します。
     *              Returns a LoaderInfo object containing information
     *              about loading the file to which this display object belongs.
     *
     * @member  {LoaderInfo}
     * @default null
     * @readonly
     * @public
     */
    get loaderInfo (): LoaderInfo
    {
        return this.contentLoaderInfo;
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
        if (request.responseDataFormat !== "json") {
            throw new Error("The only format that can be loaded by this function is `json` format.");
        }

        this.contentLoaderInfo.url    = request.url;
        this.contentLoaderInfo.format = request.responseDataFormat;

        await loaderLoadUseCase(this, request);
    }

    /**
     * @description AnimationToolで書き出したJSONオブジェクトを直接読み込む
     *              Load the JSON object exported with AnimationTool directly.
     *
     * @param  {object} json
     * @return {void}
     * @method
     * @public
     */
    async loadJSON (json: AnimationToolDataImpl | AnimationToolDataZlibImpl): Promise<void>
    {
        await loaderLoadJsonUseCase(this, json);
    }
}
