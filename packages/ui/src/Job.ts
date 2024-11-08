import type { IObject } from "./interface/IObject";
import type { IEntriesObject } from "./interface/IEntriesObject";
import { Easing } from "./Easing";
import { execute as jobEntriesService } from "./Job/service/JobEntriesService";
import { execute as jobUpdateFrameService } from "./Job/service/JobUpdateFrameService";
import {
    EventDispatcher,
    JobEvent
} from "@next2d/events";

/**
 * @class
 * @memberOf next2d.ui
 * @extends  EventDispatcher
 */
export class Job extends EventDispatcher
{
    /**
     * @description イージングの対象オブジェクト
     *              Target object of easing
     *
     * @type {object}
     * @default null
     * @private
     */
    private readonly _$target: any;

    /**
     * @description イージングのエントリーオブジェクト
     *              Entry object of easing
     *
     * @type {array}
     * @default null
     * @private
     */
    private _$entries: IEntriesObject[] | null;

    /**
     * @description イージングの開始時間
     *              Start time of easing
     *
     * @type {number}
     * @default 0
     * @private
     */
    private _$startTime: number;

    /**
     * @description イージングの強制停止フラグ
     *              Forced stop flag of easing
     *
     * @type {boolean}
     * @default false
     * @private
     */
    private _$stopFlag: boolean;

    /**
     * @description イージングの遅延実行のタイマーID
     *              Timer ID for delayed execution of easing
     *
     * @type {number}
     * @default -1
     * @private
     */
    private _$timerId: number;

    /**
     * @description イージングの開始までの遅延時間を返します。
     *              Returns the delay time until the start of the easing.
     *
     * @type {number}
     * @default 0
     * @public
     */
    public delay: number;

    /**
     * @description イージング完了時間を返します。
     *              Returns the easing completion time.
     *
     * @type {number}
     * @default 1
     * @public
     */
    public duration: number;

    /**
     * @description イージングの計算関数を返します。
     *              Returns the calculation function of the easing.
     *
     * @see Easing
     * @type {function}
     * @default Easing.linear
     * @public
     */
    public ease: Function;

    /**
     * @description イージングの開始オブジェクトを返します。
     *              Returns the start object of the easing.
     *
     * @type {object}
     * @public
     */
    public from: IObject;

    /**
     * @description イージングの終了オブジェクトを返します。
     *              Returns the end object of the easing.
     *
     * @type {object}
     * @public
     */
    public to: IObject;

    /**
     * @description イージングの現在時間を返します。
     *              Returns the current time of the easing.
     *
     * @type {number}
     * @default 0
     * @public
     */
    public currentTime: number;

    /**
     * @description イージングの次のjobを返します。
     *              Returns the next job of the easing.
     *
     * @member {Job | null}
     * @default null
     * @readonly
     * @public
     */

    public nextJob: Job | null;

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
        from: IObject, to: IObject,
        delay: number = 0, duration: number = 1,
        ease: Function | null = null
    ) {

        super();

        this.delay       = delay;
        this.duration    = duration;
        this.ease        = ease || Easing.linear;
        this.from        = from;
        this.to          = to;
        this.currentTime = 0;
        this.nextJob     = null;

        // private params
        this._$target    = target;
        this._$entries   = null;
        this._$startTime = 0;
        this._$stopFlag  = false;
        this._$timerId   = -1;
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
    get entries (): IEntriesObject[] | null
    {
        return this._$entries;
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
        this.nextJob = job;
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
            this._$entries = jobEntriesService(this.from);
            if (!this._$entries) {
                return ;
            }

            // setup
            this._$startTime = performance.now();

            // start
            this._$timerId = jobUpdateFrameService(this, this._$startTime);
        };

        // delayed start
        if (this.delay) {
            setTimeout(boot, this.delay * 1000);
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

        if (this.hasEventListener(JobEvent.STOP)) {
            this.dispatchEvent(new JobEvent(JobEvent.STOP));
        }

        // reset
        this._$entries  = null;
        this._$stopFlag = true;
    }
}