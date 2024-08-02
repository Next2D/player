import type { MovieClip } from "./MovieClip";
import type { Sprite } from "./Sprite";
import type { ParentImpl } from "./interface/ParentImpl";
import type { URLLoaderDataFormatImpl } from "./interface/URLLoaderDataFormatImpl";
import type { LoaderInfoDataImpl } from "./interface/LoaderInfoDataImpl";
import { EventDispatcher } from "@next2d/events";
import { $getInstanceId } from "./DisplayObjectUtil";

/**
 * @description LoaderInfo クラスは、読み込まれる JSON ファイルに関する情報を提供します。
 *              LoaderInfo オブジェクトは、すべての表示オブジェクトで使用できます。
 *
 *              The LoaderInfo class provides information about the JSON file to be loaded.
 *              The LoaderInfo object can be used with all display objects.
 *
 * @class
 * @memberOf next2d.display
 * @extends  EventDispatcher
 */
export class LoaderInfo extends EventDispatcher
{
    private readonly _$id: number;
    private _$content: ParentImpl<MovieClip | Sprite> | null;
    private _$data: LoaderInfoDataImpl | null;
    private _$url: string;
    private _$format: URLLoaderDataFormatImpl;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {number}
         * @private
         */
        this._$id = $getInstanceId();

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$url = "";

        /**
         * @type {Sprite}
         * @default null
         * @private
         */
        this._$content = null;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$data = null;

        /**
         * @type {string}
         * @default "json"
         * @private
         */
        this._$format = "json";
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default "[class LoaderInfo]"
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class LoaderInfo]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default "next2d.display.LoaderInfo"
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.display.LoaderInfo";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default "[object LoaderInfo]"
     * @method
     * @public
     */
    toString (): string
    {
        return "[object LoaderInfo]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default "next2d.display.LoaderInfo"
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.display.LoaderInfo";
    }

    /**
     * @description LoaderInfoのユニークIDを返却
     *              Returns the unique ID of LoaderInfo
     *
     * @member {number}
     * @readonly
     * @public
     */
    get id (): number
    {
        return this._$id;
    }

    /**
     * @description Loaderで読み込まれたデータオブジェクトを返却
     *              Returns the data object loaded by the Loader
     *
     * @member {object}
     * @public
     */
    get data (): LoaderInfoDataImpl | null
    {
        return this._$data;
    }
    set data (data: LoaderInfoDataImpl | null)
    {
        this._$data = data;
    }

    /**
     * @description LoaderInfo オブジェクトに関係したロードされたオブジェクトです。
     *              The loaded object associated with this LoaderInfo object.
     *
     * @member {MovieClip | Sprite | null}
     * @public
     */
    get content (): ParentImpl<MovieClip | Sprite> | null
    {
        return this._$content;
    }
    set content (content: ParentImpl<MovieClip | Sprite>)
    {
        this._$content = content;
    }

    /**
     * @description 読み込まれるメディアの URL です。
     *              The URL of the media being loaded.
     *
     * @member {string}
     * @default ""
     * @readonly
     * @public
     */
    get url (): string
    {
        return this._$url;
    }
    set url (url: string)
    {
        this._$url = url;
    }

    /**
     * @description 読み込まれるメディアの データフォーマット です。
     *              The data format of the media being loaded.
     *
     * @member {string}
     * @default "json"
     * @public
     */
    get format (): URLLoaderDataFormatImpl
    {
        return this._$format;
    }
    set format (format: URLLoaderDataFormatImpl)
    {
        this._$format = format;
    }
}
