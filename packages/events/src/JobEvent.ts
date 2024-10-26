import { Event } from "./Event";

/**
 * @description Tween処理に関するイベントを示します。
 *              Indicates events related to Tween processing.
 *
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
export class JobEvent extends Event
{
    /**
     * @description Jobのプロパティが更新されたときに発生します。
     *              Occurs when the Job property is updated.
     *
     * @return {string}
     * @const
     * @static
     */
    static get UPDATE (): string
    {
        return "jobupdate";
    }

    /**
     * @description TweenのJobが停止したときに発生します。
     *              Occurs when the Tween Job is stopped.
     *
     * @return {string}
     * @const
     * @static
     */
    static get STOP (): string
    {
        return "jobstop";
    }
}