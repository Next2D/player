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
        // @ifdef DEBUG
        if (url === "develop") {
            const path = Util.$location.search.substr(1).split("&")[0];
            if (!path) {
                return ;
            }
            url = `${Util.$location.origin}/${path}`;
        }
        // @endif

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

        const loader = new Loader();

        const loaderInfo = loader.contentLoaderInfo;

        // create event handler
        const errorHandler = function (event)
        {
            event.target.removeEventListener(IOErrorEvent.IO_ERROR, event.listener);
            alert("Error: " + event.message);
        };
        const completeHandler = function (event)
        {
            const loaderInfo = event.target;
            loaderInfo.removeEventListener(Event.COMPLETE, event.listener);

            const player = Util.$currentPlayer();
            const stage  = player.stage;
            const data   = loaderInfo._$data.stage;

            player.width  = data.width;
            player.height = data.height;
            player.stage.frameRate = data.fps;

            if (player._$bgColor === null) {

                const color = Util.$intToRGBA(
                    `0x${data.bgColor.substr(1)}` | 0
                );

                player._$context._$setColor(
                    color.R / 255,
                    color.G / 255,
                    color.B / 255,
                    1
                );

                player._$backgroundColor = [
                    color.R / 255,
                    color.G / 255,
                    color.B / 255,
                    1
                ];

            }

            stage.addChild(loaderInfo.content);

            player._$resize();
        };

        loaderInfo.addEventListener(IOErrorEvent.IO_ERROR, errorHandler);
        loaderInfo.addEventListener(Event.COMPLETE, completeHandler);
        loader.load(new URLRequest(url));
    }

    /**
     * @description TODO
     *
     * @param  {number} [width=240]
     * @param  {number} [height=240]
     * @param  {number} [fps=60]
     * @param  {object} [options=null]
     * @return {MovieClip}
     * @method
     * @public
     */
    createRootMovieClip (width = 240, height = 240, fps = 60, options = null)
    {
        const player = this._$player;

        player._$loadStatus = Player.LOAD_END;
        player._$mode = "create";
        player._$stage.frameRate = fps | 0;

        // setup
        player.width  = width | 0;
        player.height = height | 0;
        player.setOptions(options);

        return player._$stage.addChild(new Sprite());
    }
}

Util.$window.next2d = new Next2D();
Util.$packages(Util.$window.next2d);