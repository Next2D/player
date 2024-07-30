import type { DisplayImpl } from "./interface/DisplayImpl";
import type { EventsImpl } from "./interface/EventsImpl";
import type { FiltersImpl } from "./interface/FiltersImpl";
import type { GeomImpl } from "./interface/GeomImpl";
import type { MediaImpl } from "./interface/MediaImpl";
import type { NetImpl } from "./interface/NetImpl";
import type { TextImpl } from "./interface/TextImpl";
import type { UIImpl } from "./interface/UIImpl";
import type { PlayerOptionsImpl } from "./interface/PlayerOptionsImpl";
import type { Sprite } from "@next2d/display";
import { events } from "./Events";
import { display } from "./Display";
import { filters } from "./Filters";
import { geom } from "./Geom";
import { media } from "./Media";
import { net } from "./Net";
import { text } from "./Text";
import { ui } from "./UI";
import { execute as loadService } from "./Next2D/LoadService";
import { execute as createRootMovieClip } from "./Next2D/CreateRootMovieClip";

/**
 * @description Next2Dの起動管理クラス
 *              Boot management class of Next2D
 *
 * @class
 * @public
 */
export class Next2D
{
    public readonly display: DisplayImpl;
    public readonly events: EventsImpl;
    public readonly filters: FiltersImpl;
    public readonly geom: GeomImpl;
    public readonly media: MediaImpl;
    public readonly net: NetImpl;
    public readonly text: TextImpl;
    public readonly ui: UIImpl;
    private readonly _$promise: Promise<void>;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {DisplayImpl}
         * @public
         */
        this.display = display;

        /**
         * @type {EventsImpl}
         * @public
         */
        this.events = events;

        /**
         * @type {FiltersImpl}
         * @public
         */
        this.filters = filters;

        /**
         * @type {GeomImpl}
         * @public
         */
        this.geom = geom;

        /**
         * @type {MediaImpl}
         * @public
         */
        this.media = media;

        /**
         * @type {NetImpl}
         * @public
         */
        this.net = net;

        /**
         * @type {TextImpl}
         * @public
         */
        this.text = text;

        /**
         * @type {UIImpl}
         * @public
         */
        this.ui = ui;

        /**
         * @type {Promise}
         * @private
         */
        this._$promise = new Promise((resolve): void =>
        {
            if (document.readyState === "loading") {
                window.addEventListener("DOMContentLoaded", (): void => resolve(), { "once": true });
            } else {
                resolve();
            }
        });
    }

    /**
     * @description 指定したURLのJSONファイルを読み込みます。
     *              Reads the JSON file at the specified URL.
     *
     * @param  {string} url JSONファイルのURL
     *                      URL of the JSON file
     *
     * @param  {object} [options=null] {number} width = Stageの幅 | Stage width
     *                                 {number} height = Stageの高さ | Stage height
     *                                 {string} [tagId=null] canvasを追加対象のDOMのID | ID of the DOM to which the canvas is added
     *                                 {string} [base="/"] Loaderが読み込む際の絶対パス | Absolute path for Loader to load.
     *                                 {number|string|boolean} [bgColor=null] 背景色 | background color
     *
     * @return {void}
     * @method
     * @public
     */
    async load (url: string, options: PlayerOptionsImpl): Promise<void>
    {
        await Promise.all([this._$promise]);
        await loadService(url, options);
    }

    /**
     * @description 指定したサイズのplayerを設定して、rootのMovieClipを作成
     *              Create a root MovieClip with the specified size player set
     *
     * @param  {number} [width=240]
     * @param  {number} [height=240]
     * @param  {number} [fps=24]
     * @param  {object} [options=null]
     * @return {Sprite}
     * @method
     * @public
     */
    async createRootMovieClip (
        width: number = 240,
        height: number = 240,
        fps: number = 24,
        options: PlayerOptionsImpl | null = null
    ): Promise<Sprite> {
        await Promise.all([this._$promise]);
        return await createRootMovieClip(
            width, height, fps, options
        );
    }
}
