import type { IDisplay } from "./interface/IDisplay";
import type { IEvents } from "./interface/IEvents";
import type { IFilters } from "./interface/IFilters";
import type { IGeom } from "./interface/IGeom";
import type { IMedia } from "./interface/IMedia";
import type { INet } from "./interface/INet";
import type { IText } from "./interface/IText";
import type { IUI } from "./interface/IUI";
import type { IPlayerOptions } from "./interface/IPlayerOptions";
import type { Sprite, DisplayObject } from "@next2d/display";
import type { Matrix, ColorTransform } from "@next2d/geom";
import { events } from "./Events";
import { display } from "./Display";
import { filters } from "./Filters";
import { geom } from "./Geom";
import { media } from "./Media";
import { net } from "./Net";
import { text } from "./Text";
import { ui } from "./UI";
import { execute as loadService } from "./Next2D/usecase/LoadUseCase";
import { execute as createRootMovieClipUseCase } from "./Next2D/usecase/CreateRootMovieClipUseCase";
import { execute as captureToCanvasUseCase } from "./Next2D/usecase/CaptureToCanvasUseCase";

/**
 * @description Next2Dの起動管理クラス
 *              Boot management class of Next2D
 *
 * @class
 * @public
 */
export class Next2D
{
    /**
     * @description Displayパッケージ
     *              Display package
     *
     * @type {IDisplay}
     * @public
     */
    public readonly display: IDisplay;

    /**
     * @description Eventsパッケージ
     *              Events package
     *
     * @type {IEvents}
     * @public
     */
    public readonly events: IEvents;

    /**
     * @description Filtersパッケージ
     *              Filters package
     *
     * @type {IFilters}
     * @public
     */
    public readonly filters: IFilters;

    /**
     * @description Geomパッケージ
     *              Geom package
     *
     * @type {IGeom}
     * @public
     */
    public readonly geom: IGeom;

    /**
     * @description Mediaパッケージ
     *              Media package
     *
     * @type {IMedia}
     * @public
     */
    public readonly media: IMedia;

    /**
     * @description Netパッケージ
     *              Net package
     *
     * @type {INet}
     * @public
     */
    public readonly net: INet;

    /**
     * @description Textパッケージ
     *              Text package
     *
     * @type {IText}
     * @public
     */
    public readonly text: IText;

    /**
     * @description UIパッケージ
     *              UI package
     *
     * @type {IUI}
     * @public
     */
    public readonly ui: IUI;

    /**
     * @description 初期起動Promise
     *              Initial boot Promise
     *
     * @type {Promise}
     * @private
     */
    private readonly _$promise: Promise<void>;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        // packages
        this.display = display;
        this.events  = events;
        this.filters = filters;
        this.geom    = geom;
        this.media   = media;
        this.net     = net;
        this.text    = text;
        this.ui      = ui;

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
     * @param  {object} [options=null] {number} width Stageの幅 | Stage width
     *                                 {number} height Stageの高さ | Stage height
     *                                 {string} [tagId=null] canvasを追加対象のDOMのID | ID of the DOM to which the canvas is added
     *                                 {string} [bgColor=null] 背景色 | background color
     *
     * @return {void}
     * @method
     * @public
     */
    async load (url: string, options: IPlayerOptions | null = null): Promise<void>
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
     * @param  {number} [fps=60]
     * @param  {object} [options=null]
     * @return {Sprite}
     * @method
     * @public
     */
    async createRootMovieClip (
        width: number = 240,
        height: number = 240,
        fps: number = 60,
        options: IPlayerOptions | null = null
    ): Promise<Sprite> {
        await Promise.all([this._$promise]);
        return createRootMovieClipUseCase(
            width, height, fps, options
        );
    }

    /**
     * @description 指定のDisplayObjectをcanvasにキャプチャする
     *              Capture the specified DisplayObject to the canvas
     *
     * @param  {D} display_object
     * @param  {Matrix} [matrix=null]
     * @param  {ColorTransform} [color_transform=null]
     * @param  {HTMLCanvasElement} [transferred_canvas=null]
     * @return {void}
     * @method
     * @public
     */
    async captureToCanvas <D extends DisplayObject> (
        display_object: D,
        matrix: Matrix | null = null,
        color_transform: ColorTransform | null = null,
        transferred_canvas: HTMLCanvasElement | null = null
    ): Promise<HTMLCanvasElement> {
        return captureToCanvasUseCase(
            display_object, matrix, color_transform, transferred_canvas
        );
    }
}