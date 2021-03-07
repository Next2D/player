/**
 * @class
 */
class Next2D
{
    /**
     * @constructor
     * @public
     */
    constructor () {}

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
            url = Util.$location.search.substr(1).split("&")[0];
        }
        // @endif

        if (!url) {
            return ;
        }

        const player = new Player();
        Util.$currentPlayerId = player._$id;


        // base set
        if (!options || !("base" in options)) {
            player.base = url;
        }

        player.setOptions(options);



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
        const player = new Player();
        Util.$currentPlayerId = player._$id;

        player._$mode = "create";
        player._$stage.frameRate = fps|0;

        // setup
        player.width  = width;
        player.height = height;
        player.setOptions(options);

        return player._$stage.addChild(new MovieClip());
    }
}

Util.$window.next2d = new Next2D();
Util.$packages(Util.$window.next2d);
