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
        /**
         * @type {number}
         * @private
         */
        this._$id = Util.$players.length;
        Util.$players.push(this);

        /**
         * @type {Stage}
         * @private
         */
        this._$stage = new Stage();
        this._$stage._$playerId = this._$id;

        /**
         * @type {CacheStore}
         * @private
         */
        this._$cacheStore = new CacheStore();
        this._$cacheStore._$playerId = this._$id;

        /**
         * @type {string}
         * @private
         */
        this._$name = `${Util.$PREFIX}${this._$id}`;

        /**
         * @type {number}
         * @private
         */
        this._$actionOffset = 0;

        /**
         * @type {array}
         * @private
         */
        this._$actions = Util.$getArray();

        /**
         * @type {array}
         * @private
         */
        this._$loaders  = Util.$getArray();

        /**
         * @type {array}
         * @private
         */
        this._$sounds  = Util.$getArray();

        /**
         * @type {DisplayObject|null}
         * @default null
         * @private
         */
        this._$rollOverObject = null;

        /**
         * @type {DisplayObject|null}
         * @default null
         * @private
         */
        this._$mouseOverTarget = null;

        /**
         * @type {DisplayObject|null}
         * @default null
         * @private
         */
        this._$mouseWheelEvent  = null;

        /**
         * @type {number}
         * @private
         */
        this._$ratio = Util.$devicePixelRatio;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$intervalId = -1;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$stopFlag = true;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$startTime = 0;

        /**
         * @type {number}
         * @default 60
         * @private
         */
        this._$fps = 60;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isLoad = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$loadStatus = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$width = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$height = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$baseWidth = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$baseHeight = 0;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$scale = 1;

        /**
         * @type {Float64Array}
         * @private
         */
        this._$matrix = Util.$getMatrixArray(1, 0, 0, 1, 0, 0);

        /**
         * @type {string|number}
         * @default transparent
         * @private
         */
        this._$backgroundColor = "transparent";

        /**
         * @type {string}
         * @default up
         * @private
         */
        this._$state = "up";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$hitTest = false;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$stageX = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$stageY = -1;

        /**
         * @type {TextField|null}
         * @default null
         * @private
         */
        this._$textarea = null;

        /**
         * @type {Map}
         * @private
         */
        this._$broadcastEvents = Util.$getMap();


        /**
         * TODO
         * @type {null}
         * @default null
         * @private
         */
        this._$context = null;

        /**
         * TODO
         * @type {null}
         * @default null
         * @private
         */
        this._$canvas = null;

        /**
         * TODO
         * @type {null}
         * @default null
         * @private
         */
        this._$buffer = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$optionWidth = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$optionHeight = 0;

        /**
         * @type {string|null}
         * @default null
         * @private
         */
        this._$tagId = null;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$bgcolor = "";

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$base = "";

        // TODO
        // delay
        // this._$delayRun  = this.run.bind(this);
        // this._$loadEvent = this.loadEvent.bind(this);
        // this._$timerId = -1;
        // this._$loadId = -1;

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