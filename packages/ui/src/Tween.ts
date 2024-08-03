import { Job } from "./Job";
import type { ObjectImpl } from "./interface/ObjectImpl";

/**
 * @class
 * @memberOf next2d.ui
 */
export class Tween
{
    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default "next2d.ui.Tween"
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.ui.Tween";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default "next2d.ui.Tween"
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.ui.Tween";
    }

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
        target: any, from: ObjectImpl, to: ObjectImpl,
        delay: number = 0, duration: number = 1,
        ease: Function | null = null
    ): Job {
        return new Job(target, from, to, delay, duration, ease);
    }
}
