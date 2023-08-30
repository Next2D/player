import { events } from "./Events";
import { display } from "./Display";
import { filters } from "./Filters";
import { geom } from "./Geom";
import { media } from "./Media";
import { net } from "./Net";
import { text } from "./Text";
import { ui } from "./UI";
import { Player } from "@next2d/core";
import { URLRequest } from "@next2d/net";
import {
    Loader,
    Sprite,
    LoaderInfo
} from "@next2d/display";
import {
    Event,
    IOErrorEvent
} from "@next2d/events";
import {
    PlayerOptionsImpl,
    DisplayImpl,
    EventsImpl,
    FiltersImpl,
    GeomImpl,
    MediaImpl,
    NetImpl,
    TextImpl,
    UIImpl,
    StageDataImpl
} from "@next2d/interface";
import {
    $clamp,
    $poolArray
} from "@next2d/share";

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
    async createRootMovieClip (
        width: number = 240, height: number = 240,
        fps: number = 24, options: PlayerOptionsImpl|null = null
    ): Promise<Sprite> {

        await Promise.all(this._$promises);
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

        return root;
    }
}
