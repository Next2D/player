import { $Math } from "@next2d/share";

/**
 * Easeクラスは、イージング機能の関数を提供します。
 * The Ease class provides a collection of easing functions
 *
 * @class
 * @memberOf next2d.ui
 */
export class Easing
{
    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Easing]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class Easing]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.ui.Easing
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.ui.Easing";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Easing]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object Easing]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.ui.Easing
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.ui.Easing";
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static linear (t: number, b: number, c: number, d: number): number
    {
        return t / d * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inQuad (t: number, b: number, c: number, d: number): number
    {
        return (t /= d) * t * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static outQuad (t: number, b: number, c: number, d: number): number
    {
        return -(t /= d) * (t - 2) * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inOutQuad (t: number, b: number, c: number, d: number): number
    {
        return (t /= d / 2) < 1
            ? t * t * c / 2 + b
            : -((t -= 1) * (t - 2) - 1) * c / 2 + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inCubic (t: number, b: number, c: number, d: number): number
    {
        return (t /= d) * t * t * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static outCubic (t: number, b: number, c: number, d: number): number
    {
        t /= d;
        return (--t * t * t + 1) * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inOutCubic (t: number, b: number, c: number, d: number): number
    {
        return (t /= d / 2) < 1
            ? t * t * t * c / 2 + b
            : ((t -= 2) * t * t + 2) * c / 2 + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inQuart (t: number, b: number, c: number, d: number): number
    {
        return (t /= d) * t * t * t * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static outQuart (t: number, b: number, c: number, d: number): number
    {
        t /= d;
        return (--t * t * t * t - 1) * -c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inOutQuart (t: number, b: number, c: number, d: number): number
    {
        return (t /= d / 2) < 1
            ? t * t * t * t * c / 2 + b
            : ((t -= 2) * t * t * t - 2) * -c / 2 + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inQuint (t: number, b: number, c: number, d: number): number
    {
        return (t /= d) * t * t * t * t * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static outQuint (t: number, b: number, c: number, d: number): number
    {
        t /= d;
        return (--t * t * t * t * t + 1) * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inOutQuint (t: number, b: number, c: number, d: number): number
    {
        return (t /= d / 2) < 1
            ? t * t * t * t * t * c / 2 + b
            : ((t -= 2) * t * t * t * t + 2) * c / 2 + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inSine (t: number, b: number, c: number, d: number): number
    {
        return -c * $Math.cos(t / d * ($Math.PI / 2)) + c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static outSine (t: number, b: number, c: number, d: number): number
    {
        return c * $Math.sin(t / d * ($Math.PI / 2)) + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inOutSine (t: number, b: number, c: number, d: number): number
    {
        return -c / 2 * ($Math.cos($Math.PI * t / d) - 1) + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inExpo (t: number, b: number, c: number, d: number): number
    {
        return c * $Math.pow(2, 10 * (t / d - 1) ) + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static outExpo (t: number, b: number, c: number, d: number): number
    {
        return c * (-$Math.pow(2, -10 * t / d) + 1) + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inOutExpo (t: number, b: number, c: number, d: number): number
    {
        return (t /= d / 2) < 1
            ? c / 2 * $Math.pow(2, 10 * (t - 1)) + b
            : c / 2 * (-$Math.pow(2, -10 * (t - 1)) + 2) + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inCirc (t: number, b: number, c: number, d: number): number
    {
        return (1 - $Math.sqrt(1 - (t /= d) * t)) * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static outCirc (t: number, b: number, c: number, d: number): number
    {
        t /= d;
        return $Math.sqrt(1 - --t * t) * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inOutCirc (t: number, b: number, c: number, d: number): number
    {
        return (t /= d * 2) < 1
            ? ($Math.sqrt(1 - t * t) - 1) / -2 * c + b
            : ($Math.sqrt(1 - (t -= 2) * t) + 1) / 2 * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inBack (t: number, b: number, c: number, d: number): number
    {
        return (2.70158 * (t /= d) * t * t - 1.70158 * t * t) * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static outBack (t: number, b: number, c: number, d: number): number
    {
        return (1 + 2.70158
            * $Math.pow((t /= d) - 1, 3) + 1.70158
            * $Math.pow(t - 1, 2)
        ) * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inOutBack (t: number, b: number, c: number, d: number): number
    {
        let s = 1.70158;
        if ((t /= d / 2) < 1) {
            return t * t * (((s *= 1.525) + 1) * t - s) * c / 2 + b;
        }
        return ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) * c / 2 + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inElastic (t: number, b: number, c: number, d: number): number
    {
        return (t /= d) === 0
            ? b
            : t === 1
                ? c + b
                : -$Math.pow(2, (t *= 10) - 10)
                    * $Math.sin((t - 10.75) * (2 * $Math.PI / 3))
                        * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static outElastic (t: number, b: number, c: number, d: number): number
    {
        return (t /= d) === 0
            ? b
            : t === 1
                ? c + b
                : ($Math.pow(2, -10 * t)
                    * $Math.sin((t * 10 - 0.75) * (2 * $Math.PI / 3)) + 1)
                        * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inOutElastic (t: number, b: number, c: number, d: number): number
    {
        return (t /= d) === 0
            ? b
            : t === 1
                ? c + b
                : t < 0.5
                    ? -($Math.pow(2, 20  * t - 10) * $Math.sin((20 * t - 11.125) * (2 * $Math.PI / 4.5))) / 2    * c + b
                    : ($Math.pow(2, -20 * t + 10) * $Math.sin((20 * t - 11.125) * (2 * $Math.PI / 4.5)) / 2 + 1) * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static outBounce (t: number, b: number, c: number, d: number): number
    {
        if ((t /= d) < 1 / 2.75) {
            return 7.5625 * t * t * c + b;
        }
        if (t < 2 / 2.75) {
            return (7.5625 * (t -= 1.5 / 2.75)   * t + 0.75) * c + b;
        }
        if (t < 2.5 / 2.75) {
            return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) * c + b;
        }
        return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) * c + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inBounce (t: number, b: number, c: number, d: number): number
    {
        return c - Easing.outBounce(d - t, 0, c, d) + b;
    }

    /**
     * @param  {number} t
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @static
     */
    static inOutBounce (t: number, b: number, c: number, d: number): number
    {
        return t < d / 2
            ? Easing.inBounce(t * 2, b, c / 2, d)
            : Easing.outBounce(t * 2 - d, b + c / 2, c / 2, d);
    }
}
