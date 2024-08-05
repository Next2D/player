import type { MovieClip } from "./MovieClip";
import type { Sprite } from "./Sprite";
import type { IParent } from "./interface/IParent";
import type { IURLLoaderDataFormat } from "./interface/IURLLoaderDataFormat";
import type { ILoaderInfoData } from "./interface/ILoaderInfoData";
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
    /**
     * @description LoaderInfoのユニークIDを返却
     *              Returns the unique ID of LoaderInfo
     *
     * @type {number}
     * @readonly
     * @public
     */
    public readonly id: number;

    /**
     * @description LoaderInfo オブジェクトに関係したロードされたオブジェクトです。
     *              The loaded object associated with this LoaderInfo object.
     *
     * @type {MovieClip | Sprite | null}
     * @public
     */
    public content: IParent<MovieClip | Sprite> | null;

    /**
     * @description Loaderで読み込まれたデータオブジェクトを返却
     *              Returns the data object loaded by the Loader
     *
     * @type {object}
     * @public
     */
    public data: ILoaderInfoData | null;

    /**
     * @description 読み込まれるメディアの URL です。
     *              The URL of the media being loaded.
     *
     * @type {string}
     * @default ""
     * @readonly
     * @public
     */
    public url: string;

    /**
     * @description 読み込まれるメディアの データフォーマット です。
     *              The data format of the media being loaded.
     *
     * @type {string}
     * @default "json"
     * @public
     */
    public format: IURLLoaderDataFormat;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        this.id      = $getInstanceId();
        this.url     = "";
        this.content = null;
        this.data    = null;
        this.format  = "json";
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
        return "next2d.display.LoaderInfo";
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
        return "next2d.display.LoaderInfo";
    }
}
