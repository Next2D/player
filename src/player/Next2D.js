/**
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
     * @param  {string} url
     * @param  {object} [options=null]
     * @return {void}
     * @method
     * @public
     */
    load (url, options = null)
    {
        // @ifdef DEBUG
        if (url === "develop") {
            url = `${Util.$location.origin}/${Util.$location.search.substr(1).split("&")[0]}`;
        }
        // @endif

        if (!url) {
            return ;
        }

        // base set
        if (!options || !("base" in options)) {
            this._$player.base = url;
        }

        this._$player.setOptions(options);

        const loader = new Loader();

        const loaderInfo = loader.contentLoaderInfo;

        // create event handler
        const errorHandler = function (event)
        {
            event.target.removeEventListener(Event.COMPLETE, completeHandler);
            event.target.removeEventListener(IOErrorEvent.IO_ERROR, errorHandler);
            alert("Error: " + event.message);
        };
        const completeHandler = function (event)
        {
            const loaderInfo = event.target;
            loaderInfo.removeEventListener(Event.COMPLETE, completeHandler);
            loaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, errorHandler);

            const player = Util.$currentPlayer();
            const stage  = player.stage;
            const data   = loaderInfo._$data.stage;

            player.width  = data.width;
            player.height = data.height;
            player.stage.frameRate = data.fps;

            const color = Util.$intToRGBA(
                `0x${data.bgColor.substr(1)}`|0
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

            stage.addChild(loaderInfo.content);

            player._$resize();
        };

        loaderInfo.addEventListener(IOErrorEvent.IO_ERROR, errorHandler);
        loaderInfo.addEventListener(Event.COMPLETE, completeHandler);
        loader.load(new URLRequest(url));
    }

    /**
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

        player._$mode = "create";
        player._$stage.frameRate = fps|0;

        // setup
        player.width  = width|0;
        player.height = height|0;
        player.setOptions(options);

        return player._$stage.addChild(new MovieClip());
    }
}

Util.$window.next2d = new Next2D();
Util.$packages(Util.$window.next2d);