import { Job } from "./Job";

/**
 * @class
 * @memberOf next2d.ui
 */
export class Tween
{
    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Tween]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class Tween]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.ui.Tween
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.ui.Tween";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Tween]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object Tween]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.ui.Tween
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
        target: any, from: any, to: any,
        delay: number = 0, duration: number = 1,
        ease: Function | null = null
    ): Job {
        return new Job(target, from, to, delay, duration, ease);
    }
}
