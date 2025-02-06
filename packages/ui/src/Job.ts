import type { IObject } from "./interface/IObject";
import type { IEntriesObject } from "./interface/IEntriesObject";
import { Easing } from "./Easing";
import { execute as jobStopService } from "./Job/service/JobStopService";
import { execute as jobStartUseCase } from "./Job/usecase/JobStartUseCase";
import { EventDispatcher } from "@next2d/events";

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
     * @public
     */
    public readonly target: any;

    /**
     * @description イージングのエントリーオブジェクト
     *              Entry object of easing
     *
     * @type {array}
     * @default null
     * @public
     */
    public entries: IEntriesObject[] | null;

    /**
     * @description イージングの開始時間
     *              Start time of easing
     *
     * @type {number}
     * @default 0
     * @public
     */
    public startTime: number;

    /**
     * @description イージングの強制停止フラグ
     *              Forced stop flag of easing
     *
     * @type {boolean}
     * @default false
     * @public
     */
    public stopFlag: boolean;

    /**
     * @description イージングの遅延実行のタイマーID
     *              Timer ID for delayed execution of easing
     *
     * @type {number}
     * @default -1
     * @protected
     */
    public $timerId: number;

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
        from: IObject,
        to: IObject,
        delay: number = 0,
        duration: number = 1,
        ease: Function | null = null
    ) {
        super();

        this.target      = target;
        this.from        = from;
        this.to          = to;
        this.delay       = delay;
        this.duration    = duration;
        this.ease        = ease || Easing.linear;

        // default value
        this.currentTime = 0;
        this.nextJob     = null;
        this.entries     = null;
        this.startTime   = 0;
        this.stopFlag    = false;
        this.$timerId    = -1;
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
        jobStartUseCase(this);
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
        jobStopService(this);
    }
}