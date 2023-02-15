/**
 * @description TODO
 * @class
 */
class Next2D
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {Player}
         * @private
         */
        this._$player = new Player();
    }

    /**
     * @description TODO
     *
     * @param  {string} url JSONファイルのURL
     *                      URL of the JSON file
     *
     * @param  {object} [options=null] {number} width = Stageの幅 | Stage width
     *                                 {number} height = Stageの高さ | Stage height
     *                                 {string} [tagId=null] canvasを追加対象のDOMのID | ID of the DOM to which the canvas is added
     *                                 {string} [base="/"] Loaderが読み込む際の絶対パス | Absolute path for Loader to load.
     *                                 {number|string|boolean} [bgColor=null] 背景色 | background color
     * @return {void}
     * @method
     * @public
     */
    load (url, options = null)
    {
        if (url === "develop") {
            const path = $location.search.slice(1).split("&")[0];
            if (!path) {
                return ;
            }
            url = `${$location.origin}/${path}`;
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

        const loader     = new Loader();
        const loaderInfo = loader.contentLoaderInfo;

        loaderInfo.addEventListener(IOErrorEvent.IO_ERROR, (event) =>
        {
            event.target.removeEventListener(IOErrorEvent.IO_ERROR, event.listener);
            alert("Error: " + event.message);
        });

        loaderInfo.addEventListener(Event.COMPLETE, (event) =>
        {
            const loaderInfo = event.target;
            loaderInfo.removeEventListener(Event.COMPLETE, event.listener);

            const player = Util.$currentPlayer();
            const stage  = loaderInfo._$data.stage;

            if (player._$bgColor === null) {
                player._$bgColor = Util.$getArray(1, 1, 1, 1);
            }

            const color = Util.$intToRGBA(
                `0x${stage.bgColor.slice(1)}` | 0
            );

            player._$bgColor[0] = color.R / 255;
            player._$bgColor[1] = color.G / 255;
            player._$bgColor[2] = color.B / 255;

            player._$setBackgroundColor(player._$bgColor);

            player.stage.addChild(loaderInfo.content);

            player._$baseWidth  = stage.width | 0;
            player._$baseHeight = stage.height | 0;
            player.stage._$frameRate = Util.$clamp(+stage.fps, 1, 60, 60);

            player._$resize();
        });

        loader.load(new URLRequest(url));
    }

    /**
     * @description TODO
     *
     * @param  {number} [width=240]
     * @param  {number} [height=240]
     * @param  {number} [fps=24]
     * @param  {object} [options=null]
     * @return {Sprite}
     * @method
     * @public
     */
    createRootMovieClip (width = 240, height = 240, fps = 24, options = null)
    {
        const player = this._$player;

        // setup
        player.width  = width | 0;
        player.height = height | 0;
        player.setOptions(options);

        player._$loadStatus = Player.LOAD_END;
        player._$mode = "create";
        player._$stage._$frameRate = fps | 0;

        const root = player._$stage.addChild(new Sprite());

        player.play();

        return root;
    }
}

$window.next2d = new Next2D();
Util.$packages($window.next2d);
