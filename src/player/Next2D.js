/**
 * @class
 */
class Next2D
{
    /**
     * @constructor
     */
    constructor () {}

    /**
     * @param {string} url
     * @param {object} [options=null]
     */
    load (url, options)
    {

        // @ifdef DEBUG
        if (url === "develop") {
            url = Util.$window.location.search.substr(1).split("&")[0];
        }
        // @endif

        if (!url) {
            return ;
        }

        // create player
        const player = new Player();
        Util.$currentPlayerId = player._$id;

        // base set
        let urls;
        switch (true) {

            // option
            case (typeof options === "object" && "base" in options):
                break;

            // relative path
            case (url.indexOf("//") === -1):

                urls = url.split("/");
                if (urls[0] === "" || urls[0] === ".") {
                    urls.shift();
                }
                url = urls.pop();

                let base = Util.$location.origin + "/";
                if (urls.length) {
                    base += urls.join("/") + "/";
                }

                player.base = base;

                break;

            // absolute path
            default:

                urls = url.split("?")[0].split("/");
                urls.pop();

                player.base = urls.join("/");

                break;

        }


        // setup stage
        const stage = new Stage();
        player._$stage     = stage;
        stage._$playerId   = player._$id;
        stage._$added      = true;
        stage._$addedStage = true;

        // init loader
        const loader = new Loader();
        loader._$player      = player;
        stage._$loaderInfoId = loader._$fixLoaderInfoId;

        // set current LoaderInfo
        Util.$currentLoaderInfo = loader.loaderInfo;

        // player initialize
        player.setOptions(options);
        player.initialize();


        // set FlashVars
        const loaderInfo = loader.contentLoaderInfo;
        loaderInfo._$parameters = Util.$toOriginalObject(player._$FlashVars);


        // create error handler
        const errorHandler = function (event)
        {
            event._$target.removeEventListener(Event.COMPLETE, completeHandler);
            event._$target.removeEventListener(IOErrorEvent.IO_ERROR, errorHandler);
            alert("Error: " + event._$message);
        };
        loaderInfo.addEventListener(IOErrorEvent.IO_ERROR, errorHandler);


        // create complete handler
        const completeHandler = function (event)
        {
            event._$target.removeEventListener(Event.COMPLETE, completeHandler);
            event._$target.removeEventListener(IOErrorEvent.IO_ERROR, errorHandler);
        };
        loaderInfo.addEventListener(Event.COMPLETE, completeHandler);


        // set current applicationDomain
        Util.$currentDomain = loaderInfo._$applicationDomain;


        // start load
        loader.load(
            new URLRequest(url),
            new LoaderContext(false, new ApplicationDomain())
        );
    }

    /**
     * @return {void}
     * @public
     */
    reset ()
    {
        if (!instanceId) {
            return ;
        }

        instanceId    = 0;
        packageId     = 0;
        programId     = 0;
        Util.$stages  = [];
        Util.$avm2    = [];
        SoundMixer.stopAll();

        for (let idx = 0; idx < Util.$players.length; ++idx) {

            const player = Util.$players[idx];
            player.stop();

            const manager = player._$context.frameBuffer;
            manager._$objectPool                     = [];
            manager._$colorBufferPool._$objectPool   = [];
            manager._$stencilBufferPool._$objectPool = [];

            const extension = player
                ._$context
                ._$gl
                .getExtension("WEBGL_lose_context");

            if (extension) {
                extension.loseContext();
            }

            player._$cacheStore.reset();
        }

        Util.$players = [];
    }

// @ifdef DEBUG
    /**
     * @param   {uint}   [width=240]
     * @param   {uint}   [height=240]
     * @param   {uint}   [fps=60]
     * @param   {object} [options=null]
     * @returns {MovieClip|DisplayObject}
     */
    createRootMovieClip (width = 240, height = 240, fps = 60, options = null)
    {
        // init player
        const player = new Player();
        Util.$currentPlayerId = player._$id;

        // setup stage
        const stage      = new Stage();
        player._$stage   = stage;
        stage._$playerId = player._$id;


        // default params
        width  = Util.$toUint32(width);
        height = Util.$toUint32(height);
        fps    = Util.$toUint32(fps);

        // setup stage
        stage._$frameRate = fps;


        // init loader
        const loader = new Loader();
        loader._$player      = player;
        stage._$loaderInfoId = loader._$fixLoaderInfoId;


        // application domain
        loader.contentLoaderInfo._$applicationDomain = new ApplicationDomain();


        // set FlashVars
        loader.contentLoaderInfo._$parameters = Util.$toOriginalObject(player._$FlashVars);
        loader.contentLoaderInfo._$frameRate  = fps;
        loader.contentLoaderInfo._$width      = width  * 20;
        loader.contentLoaderInfo._$height     = height * 20;


        // player setup
        player.setOptions(options);
        player.initialize();
        player._$baseWidth  = width;
        player._$baseHeight = height;
        if (player._$tagId && !player._$optionWidth && !player._$optionHeight) {
            player._$optionWidth  = width;
            player._$optionHeight = height;
        }


        // readyState
        switch (Util.$document.readyState) {

            // retry
            case "loading":

                const reTry = function () {
                    this.removeEventListener("DOMContentLoaded", reTry, false);
                    player._$loadStatus = 2;
                    player._$isLoad     = true;
                };

                // DOMContentLoaded
                Util.$window.addEventListener("DOMContentLoaded", reTry, false);

                break;

            // player start
            case "complete":

                player._$loadStatus = 2;
                player._$isLoad     = true;

                break;

        }

        // set info
        Util.$currentDomain = loader.contentLoaderInfo;

        return stage.addChildAt(new MovieClip(), 0);
    }
// @endif
}

window.next2d = new Next2D();
