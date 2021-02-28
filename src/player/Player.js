/**
 * @class
 */
class Player
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        this._$id = Util.$players.length;
        Util.$players.push(this);

        this._$stage = new Stage();
        this._$stage._$playerId = this._$id;

        // cache store
        this._$cacheStore = new CacheStore();
        this._$cacheStore._$playerId = this._$id;


        // set div name
        this._$name = `${Util.$PREFIX}${this._$id}`;

        // pool action script
        this._$actionOffset = 0;
        this._$actions      = [];
        this._$loaders      = [];
        this._$sounds       = [];

        // events
        this._$rollOverObject   = null;
        this._$mouseOverTarget  = null;
        this._$mouseWheelEvent  = null;


        // params
        this._$ratio            = Util.$devicePixelRatio;
        this._$intervalId       = 0;
        this._$stopFlag         = true;
        this._$startTime        = 0;
        this._$fps              = 0;
        this._$isLoad           = false;
        this._$loadStatus       = 0;
        this._$width            = 0;
        this._$height           = 0;
        this._$baseWidth        = 0;
        this._$baseHeight       = 0;
        this._$scale            = 1;
        this._$matrix           = Util.$getMatrixArray(1, 0, 0, 1, 0, 0);
        this._$colorTransform   = Util.$getColorArray(1, 1, 1, 1, 0, 0, 0, 0);
        this._$backgroundColor  = "transparent";
        this._$state            = "up";
        this._$hitTest          = false;
        this._$stageX           = -1;
        this._$stageY           = -1;
        this._$textarea         = null;
        this._$broadcastEvents  = Util.$getMap();


        // canvas
        this._$context          = null;
        this._$canvas           = null;
        this._$buffer           = null;


        // options
        this._$optionWidth      = 0;
        this._$optionHeight     = 0;
        this._$tagId            = null;
        this._$bgcolor          = "";
        this._$base             = "";


        // delay
        // this._$delayRun         = this.run.bind(this);
        // this._$loadEvent        = this.loadEvent.bind(this);
        // this._$timerId          = -1;
        // this._$loadId           = -1;

    }

    /**
     * @return {Map}
     * @readonly
     * @public
     */
    get broadcastEvents ()
    {
        return this._$broadcastEvents;
    }

    /**
     * @return {Stage}
     * @readonly
     * @public
     */
    get stage ()
    {
        return this._$stage;
    }

    get contentElementId ()
    {
        return this._$name;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    play ()
    {

    }

    /**
     * @return {void}
     * @method
     * @public
     */
    stop ()
    {

    }
}