import type { IObject } from "./interface/IObject";
import { Job } from "./Job";

/**
 * @class
 * @memberOf next2d.ui
 */
export class Tween
{
    /**
     * @description 新しいJobクラスを追加します
     *              Add a new Job class
     *
     * @param  {object}   target
     * @param  {object}   from
     * @param  {object}   to
     * @param  {number}   [delay=0]
     * @param  {number}   [duration=1]
     * @param  {function} [ease=null]
     * @return {Job}
     * @method
     * @static
     */
    static add (
        target: any, from: IObject, to: IObject,
        delay: number = 0, duration: number = 1,
        ease: Function | null = null
    ): Job {
        return new Job(target, from, to, delay, duration, ease);
    }
}
