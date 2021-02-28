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

            if (url.indexOf("//") === -1) {

                const urls = url.split("/");
                if (urls[0] === "" || urls[0] === ".") {
                    urls.shift();
                }
                url = urls.pop();

                let base = Util.$location.origin + "/";
                if (urls.length) {
                    base += urls.join("/") + "/";
                }

                player.base = base;

            } else {

                player.base = url
                    .split("?")[0]
                    .split("/")
                    .pop()
                    .join("/");

            }

        }



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

        const stage = player.stage;

        return stage.addChild(new MovieClip());
    }
}

Util.$window.next2d = new Next2D();
Util.$packages(Util.$window.next2d);
