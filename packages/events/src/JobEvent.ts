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
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default "next2d.events.JobEvent"
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.events.JobEvent";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default "next2d.events.JobEvent"
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.events.JobEvent";
    }

    /**
     * @description Jobのプロパティが更新されたときに発生します。
     *              Occurs when the Job property is updated.
     *
     * @return {string}
     * @default "jobupdate"
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
     * @default "jobstop"
     * @const
     * @static
     */
    static get STOP (): string
    {
        return "jobstop";
    }
}