/**
 * @class
 * @memberOf next2d.ui
 * @extends  EventDispatcher
 */
class Job extends EventDispatcher
{
    /**
     * @param {object}   target
     * @param {object}   [from=null]
     * @param {object}   [to=null]
     * @param {number}   [delay=0]
     * @param {number}   [duration=1]
     * @param {function} [ease=null]
     *
     * @constructor
     * @public
     */
    constructor (target, from = null, to = null, delay = 0, duration = 1, ease = null)
    {
        super();

        /**
         * @type {object}
         * @private
         */
        this._$target = target;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$delay = delay;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$duration = duration;

        /**
         * @type {function}
         * @default Easing.linear
         * @private
         */
        this._$ease = ease || Easing.linear;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$from = from;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$names = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$startTime = 0;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$stopFlag = false;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$to = to;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$update = null;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Job]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class Job]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.ui.Job
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.ui.Job";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Job]
     * @method
     * @public
     */
    toString ()
    {
        return "[object Job]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.ui.Job
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.ui.Job";
    }

    /**
     * @member {function}
     * @default Easing.linear
     * @public
     */
    get ease ()
    {
        return this._$ease;
    }
    set ease (ease)
    {
        if (typeof ease === "function") {
            this._$ease = ease;
        }
    }

    /**
     * @member {number}
     * @default 0
     * @public
     */
    get delay ()
    {
        return this._$delay;
    }
    set delay (delay)
    {
        this._$delay = delay;
    }

    /**
     * @member {number}
     * @default 1
     * @public
     */
    get duration ()
    {
        return this._$duration;
    }
    set duration (duration)
    {
        this._$duration = duration;
    }

    /**
     * @member {object}
     * @default null
     * @public
     */
    get from ()
    {
        return this._$from;
    }
    set from (from)
    {
        this._$from = from;
    }

    /**
     * @member {object}
     * @default null
     * @public
     */
    get to ()
    {
        return this._$to;
    }
    set to (to)
    {
        this._$to = to;
    }

    /**
     * @member {object}
     * @readonly
     * @public
     */
    get target ()
    {
        return this._$target;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        // setup
        this._$stopFlag  = false;
        this._$startTime = Util.$performance.now();
        this._$update    = this.update.bind(this);

        this._$names = this.entries(this._$from);

        // add event
        this.addEventListener(Event.ENTER_FRAME, this._$update);
    }

    /**
     * @param  {object} object
     * @return {array}
     * @method
     * @public
     */
    entries (object)
    {
        const entries = Object.entries(object);

        for (let idx = 0; idx < entries.length; ++idx) {

            const values = entries[idx];

            const value = values[1];
            if (value && typeof value === "object") {
                values[1] = this.entries(value);
            }
        }

        return entries;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    start ()
    {
        if (this._$delay) {

            const timer = Util.$setTimeout;
            timer(function ()
            {
                this.initialize();
            }.bind(this), this._$delay * 1000);

            return ;
        }

        this.initialize();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    stop ()
    {
        this._$stopFlag = true;

        this.removeEventListener(Event.ENTER_FRAME, this._$update);

        if (this.hasEventListener(Event.STOP)) {
            this.dispatchEvent(new Event(Event.STOP));
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    update ()
    {
        if (this._$stopFlag) {
            this.removeEventListener(Event.ENTER_FRAME, this._$update);
            return ;
        }

        this._$currentTime = (Util.$performance.now() - this._$startTime) * 0.001;

        this.updateProperty(
            this._$target, this._$from, this._$to, this._$names
        );

        if (this.hasEventListener(Event.UPDATE)) {
            this.dispatchEvent(new Event(Event.UPDATE));
        }

        if (this._$currentTime >= this._$duration) {

            this.removeEventListener(Event.ENTER_FRAME, this._$update);

            if (this.hasEventListener(Event.COMPLETE)) {
                this.dispatchEvent(new Event(Event.COMPLETE));
            }
        }
    }

    /**
     * @param  {object} target
     * @param  {object} from
     * @param  {object} to
     * @param  {array}  names
     * @return {void}
     * @method
     * @public
     */
    updateProperty (target, from, to, names)
    {
        for (let idx = 0; idx < names.length; ++idx) {

            const values = names[idx];

            const name  = values[0];
            const value = values[1];

            if (value && typeof value === "object") {
                this.updateProperty(target[name], from[name], to[name], value);
                continue;
            }

            // update
            const fromValue = from[name];
            if (this._$duration > this._$currentTime) {

                target[name] = this._$ease(
                    this._$currentTime,
                    fromValue, to[name] - fromValue,
                    this._$duration
                );

            } else {

                target[name] = to[name];

            }
        }
    }
}