import { Easing } from "./Easing";
import {
    EventDispatcher,
    Event
} from "@next2d/events";
import {
    $setTimeout,
    $performance
} from "@next2d/share";

/**
 * @class
 * @memberOf next2d.ui
 * @extends  EventDispatcher
 */
export class Job extends EventDispatcher
{
    private readonly _$target: any;
    private _$delay: number;
    private _$duration: number;
    private _$ease: Function;
    private _$from: any;
    private _$names: any[] | null;
    private _$startTime: number;
    private _$stopFlag: boolean;
    private _$forceStop: boolean;
    private _$to: any;
    private _$currentTime: number;

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
    constructor (
        target: any,
        from: any = null, to: any = null,
        delay: number = 0, duration: number = 1,
        ease: Function | null = null
    ) {

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
         * @type {boolean}
         * @default false
         * @private
         */
        this._$forceStop = false;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$to = to;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$currentTime = 0;
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
    static toString (): string
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
    static get namespace (): string
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
    toString (): string
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
     * @public
     */
    get namespace (): string
    {
        return "next2d.ui.Job";
    }

    /**
     * @member {function}
     * @default Easing.linear
     * @public
     */
    get ease (): Function
    {
        return this._$ease;
    }
    set ease (ease: Function)
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
    get delay (): number
    {
        return this._$delay;
    }
    set delay (delay: number)
    {
        this._$delay = delay;
    }

    /**
     * @member {number}
     * @default 1
     * @public
     */
    get duration (): number
    {
        return this._$duration;
    }
    set duration (duration: number)
    {
        this._$duration = duration;
    }

    /**
     * @member {object}
     * @default null
     * @public
     */
    get from (): any
    {
        return this._$from;
    }
    set from (from: any)
    {
        this._$from = from;
    }

    /**
     * @member {object}
     * @default null
     * @public
     */
    get to (): any
    {
        return this._$to;
    }
    set to (to: any)
    {
        this._$to = to;
    }

    /**
     * @member {object}
     * @readonly
     * @public
     */
    get target (): any
    {
        return this._$target;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    initialize (): void
    {
        if (this._$forceStop) {
            return ;
        }

        // setup
        this._$stopFlag  = false;
        this._$startTime = $performance.now();

        this._$names = this._$entries(this._$from);

        // start
        this._$update();
    }

    /**
     * @param  {object} object
     * @return {array}
     * @method
     * @private
     */
    _$entries (object: any): any[]
    {
        const entries: any[] = Object.entries(object);

        for (let idx = 0; idx < entries.length; ++idx) {

            const values = entries[idx];

            const value: any = values[1];
            if (value && typeof value === "object") {
                values[1] = this._$entries(value);
            }
        }

        return entries;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    start (): void
    {
        if (this._$delay) {

            $setTimeout((): void =>
            {
                this.initialize();
            }, this._$delay * 1000);

            return ;
        }

        this.initialize();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    stop (): void
    {
        if (this.hasEventListener(Event.STOP)) {
            this.dispatchEvent(new Event(Event.STOP));
            this.removeAllEventListener(Event.STOP);
        }

        if (this.hasEventListener(Event.UPDATE)) {
            this.removeAllEventListener(Event.UPDATE);
        }

        if (this.hasEventListener(Event.COMPLETE)) {
            this.removeAllEventListener(Event.COMPLETE);
        }

        this._$forceStop = true;
        this._$stopFlag  = true;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$update (): void
    {
        if (this._$stopFlag) {
            return ;
        }

        if (!this._$names) {
            return this.stop();
        }

        // update current time
        this._$currentTime = ($performance.now() - this._$startTime) * 0.001;

        this._$updateProperty(
            this._$target, this._$from, this._$to, this._$names
        );

        if (this.hasEventListener(Event.UPDATE)) {
            this.dispatchEvent(new Event(Event.UPDATE));
        }

        if (this._$currentTime >= this._$duration) {
            if (this.hasEventListener(Event.COMPLETE)) {
                this.dispatchEvent(new Event(Event.COMPLETE));
            }
        } else {
            requestAnimationFrame(() => {
                this._$update();
            });
        }
    }

    /**
     * @param  {object} target
     * @param  {object} from
     * @param  {object} to
     * @param  {array}  names
     * @return {void}
     * @method
     * @private
     */
    _$updateProperty (target: any, from: any, to: any, names: any[]): void
    {
        for (let idx = 0; idx < names.length; ++idx) {

            const values = names[idx];

            const name = values[0];
            if (name === "__proto__"
                || name === "constructor"
                || name === "prototype"
            ) {
                continue;
            }

            const value = values[1];
            if (value && typeof value === "object") {
                this._$updateProperty(target[name], from[name], to[name], value);
                continue;
            }

            if (!(name in target)) {
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
