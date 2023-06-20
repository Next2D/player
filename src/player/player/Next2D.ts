import { events } from "../packages/Events";
import { display } from "../packages/Display";
import { filters } from "../packages/Filters";
import { geom } from "../packages/Geom";
import { media } from "../packages/Media";
import { net } from "../packages/Net";
import { text } from "../packages/Text";
import { ui } from "../packages/UI";
import { Player } from "./Player";
import { Loader } from "../next2d/display/Loader";
import { Sprite } from "../next2d/display/Sprite";
import { Event } from "../next2d/events/Event";
import { IOErrorEvent } from "../next2d/events/IOErrorEvent";
import { URLRequest } from "../next2d/net/URLRequest";
import type { LoaderInfo } from "../next2d/display/LoaderInfo";
import type { PlayerOptionsImpl } from "../../interface/PlayerOptionsImpl";
import type { DisplayImpl } from "../../interface/DisplayImpl";
import type { EventsImpl } from "../../interface/EventsImpl";
import type { FiltersImpl } from "../../interface/FiltersImpl";
import type { GeomImpl } from "../../interface/GeomImpl";
import type { MediaImpl } from "../../interface/MediaImpl";
import type { NetImpl } from "../../interface/NetImpl";
import type { TextImpl } from "../../interface/TextImpl";
import type { UIImpl } from "../../interface/UIImpl";
import type { StageDataImpl } from "../../interface/StageDataImpl";
import {
    $clamp,
    $poolArray
} from "../util/RenderUtil";

/**
 * playerの起動管理クラス
 * player startup management class
 * @class
 */
export class Next2D
{
    private readonly _$promises: Promise<void>[];
    private readonly _$player: Player;
    public readonly display: DisplayImpl;
    public readonly events: EventsImpl;
    public readonly filters: FiltersImpl;
    public readonly geom: GeomImpl;
    public readonly media: MediaImpl;
    public readonly net: NetImpl;
    public readonly text: TextImpl;
    public readonly ui: UIImpl;

    /**
     * @constructor
     * @public
     */
    constructor (promises: Promise<void>[])
    {
        /**
         * @type {array}
         * @private
         */
        this._$promises = promises;

        /**
         * @type {Player}
         * @private
         */
        this._$player = new Player();

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
    }

    /**
     * @member {Player}
     * @readonly
     * @return {Player}
     */
    get player (): Player
    {
        return this._$player;
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
    load (url: string, options: PlayerOptionsImpl): void
    {
        Promise
            .all(this._$promises)
            .then(() =>
            {
                $poolArray(this._$promises);

                if (url === "develop") {
                    const path: string = location
                        .search
                        .slice(1)
                        .split("&")[0];

                    if (!path) {
                        return ;
                    }
                    url = `${location.origin}/${path}`;
                }

                if (!url) {
                    return ;
                }

                if (url.charAt(1) === "/") {
                    url = url.slice(1);
                }

                // base set
                if ((!options || !("base" in options)) && url.indexOf("//") > -1) {
                    this._$player.base = url;
                }

                this._$player.setOptions(options);
                this._$player._$initialize();

                const loader: Loader = new Loader();

                loader
                    .contentLoaderInfo
                    .addEventListener(IOErrorEvent.IO_ERROR, (event: IOErrorEvent) =>
                    {
                        if (event.target) {
                            event.target.removeEventListener(IOErrorEvent.IO_ERROR, event.listener);
                        }
                        alert("Error: " + event.text);
                    });

                loader
                    .contentLoaderInfo
                    .addEventListener(Event.COMPLETE, (event: Event) =>
                    {
                        const loaderInfo: LoaderInfo = event.target as NonNullable<LoaderInfo>;
                        const player: Player = this._$player;

                        loaderInfo
                            .removeEventListener(Event.COMPLETE, event.listener);

                        if (loaderInfo._$data) {

                            const stage: StageDataImpl = loaderInfo._$data.stage;

                            player.bgColor = stage.bgColor;
                            player._$setBackgroundColor(stage.bgColor);

                            player.stage.addChild(loaderInfo.content);

                            player.width  = stage.width;
                            player.height = stage.height;

                            // set fps fixed logic
                            player.stage._$frameRate = $clamp(+stage.fps, 1, 60, 60);
                        }

                        player._$resize();
                    });

                loader.load(new URLRequest(url));
            });
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
    createRootMovieClip (
        width: number = 240, height: number = 240,
        fps: number = 24, options: PlayerOptionsImpl|null = null
    ): Promise<Sprite> {

        return Promise
            .all(this._$promises)
            .then(() =>
            {
                $poolArray(this._$promises);

                const player: Player = this._$player;

                // setup
                player.width  = width | 0;
                player.height = height | 0;
                player.mode   = "create";
                player.stage._$frameRate = fps | 0;
                player.setOptions(options);
                player._$initialize();

                const root: Sprite = player.stage.addChild(new Sprite());

                player._$loadStatus = Player.LOAD_END;
                player.play();

                return Promise.resolve(root);
            });
    }
}
