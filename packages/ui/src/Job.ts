import type { ObjectImpl } from "./interface/ObjectImpl";
import type { EntriesObjectImpl } from "./interface/EntriesObjectImpl";
import { Easing } from "./Easing";
import { execute as jobEntriesService } from "./Job/JobEntriesService";
import { execute as jobUpdateFrameService } from "./Job/JobUpdateFrameService";
import {
    EventDispatcher,
    Event
} from "@next2d/events";

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
    private _$from: ObjectImpl;
    private _$to: ObjectImpl;
    private _$entries: EntriesObjectImpl[] | null;
    private _$startTime: number;
    private _$stopFlag: boolean;
    private _$currentTime: number;
    private _$timerId: number;
    // eslint-disable-next-line no-use-before-define
    private _$nextJob: Job | null;

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
        from: ObjectImpl, to: ObjectImpl,
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
        this._$entries = null;

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
         * @type {number}
         * @default 0
         * @private
         */
        this._$currentTime = 0;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$timerId = -1;

        /**
         * @type {Job}
         * @default null
         * @private
         */
        this._$nextJob = null;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default "[class Job]"
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
     * @default "next2d.ui.Job"
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
     * @default "[object Job]"
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
     * @default "next2d.ui.Job"
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.ui.Job";
    }

    /**
     * @description イージングの計算関数を返します。
     *              Returns the calculation function of the easing.
     *
     * @see Easing
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
        this._$ease = ease;
    }

    /**
     * @description イージングの開始までの遅延時間を返します。
     *              Returns the delay time until the start of the easing.
     *
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
     * @description イージング完了時間を返します。
     *              Returns the easing completion time.
     *
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
     * @description イージングの開始オブジェクトを返します。
     *              Returns the start object of the easing.
     *
     * @member {object}
     * @default null
     * @public
     */
    get from (): ObjectImpl
    {
        return this._$from;
    }
    set from (from: ObjectImpl)
    {
        this._$from = from;
    }

    /**
     * @description イージングの終了オブジェクトを返します。
     *              Returns the end object of the easing.
     *
     * @member {object}
     * @default null
     * @public
     */
    get to (): ObjectImpl
    {
        return this._$to;
    }
    set to (to: ObjectImpl)
    {
        this._$to = to;
    }

    /**
     * @description イージングの現在時間を返します。
     *              Returns the current time of the easing.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get currentTime (): number
    {
        return this._$currentTime;
    }
    set currentTime (time: number)
    {
        this._$currentTime = time;
    }

    /**
     * @description イージングの対象オブジェクトを返します（読み取り専用）
     *              Returns the target object of the easing (read-only)
     *
     * @member {object}
     * @default null
     * @readonly
     * @public
     */
    get target (): any
    {
        return this._$target;
    }

    /**
     * @description イージングのエントリーオブジェクトを返します。
     *              Returns the entry object of the easing.
     *
     * @member {array | null}
     * @default null
     * @readonly
     * @public
     */
    get entries (): EntriesObjectImpl[] | null
    {
        return this._$entries;
    }

    /**
     * @description イージングの次のjobを返します。
     *              Returns the next job of the easing.
     *
     * @member {Job | null}
     * @default null
     * @readonly
     * @public
     */
    get nextJob (): Job | null
    {
        return this._$nextJob;
    }

    /**
     * @description イージングの強制停止フラグを返します。
     *              Returns the forced stop flag of the easing.
     *
     * @member {boolean}
     * @default false
     * @readonly
     * @public
     */
    get stopFlag (): boolean
    {
        return this._$stopFlag;
    }

    /**
     * @description イージングの開始時間を返します。
     *              Returns the start time of the easing.
     *
     * @member {number}
     * @default 0
     * @readonly
     * @public
     */
    get startTime (): number
    {
        return this._$startTime;
    }

    /**
     * @description 指定したjobを次に開始します。nullで解消
     *              Starts the next specified job, resolved by null
     *
     * @return {Job | null}
     * @method
     * @public
     */
    chain (job: Job | null): Job | null
    {
        this._$nextJob = job;
        return job;
    }

    /**
     * @description イージングを開始します。
     *              Starts the easing.
     *
     * @return {void}
     * @method
     * @public
     */
    start (): void
    {
        // stop job
        cancelAnimationFrame(this._$timerId);

        // reset
        this._$stopFlag = false;

        /**
         * @description イージングの起動関数
         *              Easing boot function
         *
         * @return {void}
         * @method
         * @private
         */
        const boot = (): void =>
        {
            if (this._$stopFlag) {
                return ;
            }

            // create entries
            this._$entries = jobEntriesService(this._$from);
            if (!this._$entries) {
                return ;
            }

            // setup
            this._$startTime = performance.now();

            // start
            this._$timerId = jobUpdateFrameService(this, this._$startTime);
        };

        // delayed start
        if (this._$delay) {
            setTimeout(boot, this._$delay * 1000);
        } else {
            boot();
        }
    }

    /**
     * @description イージングを停止します。
     *              Stops the easing.
     *
     * @return {void}
     * @method
     * @public
     */
    stop (): void
    {
        cancelAnimationFrame(this._$timerId);

        if (this.hasEventListener(Event.STOP)) {
            this.dispatchEvent(new Event(Event.STOP));
        }

        // reset
        this._$entries  = null;
        this._$stopFlag = true;
    }
}