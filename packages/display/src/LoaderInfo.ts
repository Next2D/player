import { EventDispatcher } from "@next2d/events";
import { $getLoaderInfoId } from "@next2d/util";
import type {
    URLLoaderDataFormatImpl,
    ParentImpl,
    LoaderInfoDataImpl
} from "@next2d/interface";

/**
 * LoaderInfo クラスは、読み込まれる JSON ファイルやイメージファイル（JPEG、GIF、PNG ファイルなど）に関する情報を提供します。
 * LoaderInfo オブジェクトは、すべての表示オブジェクトで使用できます。
 * 提供される情報には、読み込みの進行状況、読み込む側と読み込まれたコンテンツの URL、メディアの総バイト数、メディアの規格高さと幅などが含まれます。
 *
 * The LoaderInfo class provides information about a loaded JSON file or a loaded image file (JPEG, GIF, or PNG).
 * LoaderInfo objects are available for any display object.
 * The information provided includes load progress, the URLs of the loader and loaded content,
 * the number of bytes total for the media, and the nominal height and width of the media.
 *
 * @class
 * @memberOf next2d.display
 * @extends  EventDispatcher
 */
export class LoaderInfo extends EventDispatcher
{
    public readonly _$id: number;
    public _$content: ParentImpl<any> | null;
    public _$data: LoaderInfoDataImpl | null;
    private _$bytesLoaded: number;
    private _$bytesTotal: number;
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
        this._$id = $getLoaderInfoId();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$bytesLoaded = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$bytesTotal = 0;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$url = "";

        /**
         * @type {DisplayObject}
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
     * @default [class LoaderInfo]
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
     * @default next2d.display.LoaderInfo
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
     * @default [object LoaderInfo]
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
     * @default next2d.display.LoaderInfo
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.display.LoaderInfo";
    }

    /**
     * @description そのメディアのロード済みのバイト数です。
     *              The uint of bytes that are loaded for the media.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get bytesLoaded (): number
    {
        return this._$bytesLoaded;
    }
    set bytesLoaded (bytes_loaded: number)
    {
        this._$bytesLoaded = bytes_loaded | 0;
    }

    /**
     * @description メディアファイル全体のバイト数です。
     *              The number of bytes in the entire media file.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get bytesTotal (): number
    {
        return this._$bytesTotal;
    }
    set bytesTotal (bytes_total: number)
    {
        this._$bytesTotal = bytes_total | 0;
    }

    /**
     * @description LoaderInfo オブジェクトに関係したロードされたオブジェクトです。
     *              The loaded object associated with this LoaderInfo object.
     *
     * @member {DisplayObject}
     * @public
     */
    get content (): ParentImpl<any>
    {
        return this._$content;
    }
    set content (content: ParentImpl<any>)
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
