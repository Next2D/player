/**
 * @class
 * @memberOf next2d.ui
 */
class Easing
{
    /**
     * Easeクラスは、イージング機能の関数を提供します。
     * The Ease class provides a collection of easing functions
     *
     * @constructor
     * @public
     */
    constructor () {}

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Easing]
     * @method
     * @static
     */
    static toString ()
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
    static get namespace ()
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
    toString ()
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
     * @static
     */
    get namespace ()
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
    static linear = function (t, b, c, d)
    {
        return c * t / d + b;
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
    static inQuad = function (t, b, c, d)
    {
        t /= d
        return c * t * t + b;
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
    static outQuad = function (t, b, c, d)
    {
        t /= d
        return -c * t * (t - 2) + b;
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
    static inOutQuad = function (t, b, c, d)
    {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * t * t + b;
        }

        t = t - 1
        return -c / 2.0 * (t * (t - 2) - 1) + b;
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
    static inCubic = function (t, b, c, d)
    {
        t /= d;
        return c * t * t * t + b;
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
    static outCubic = function (t, b, c, d)
    {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
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
    static inOutCubic = function (t, b, c, d)
    {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * t * t * t + b;
        }

        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
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
    static inQuart = function (t, b, c, d)
    {
        t /= d;
        return c * t * t * t * t + b;
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
    static outQuart = function (t, b, c, d)
    {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
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
    static inOutQuart = function (t, b, c, d)
    {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * t * t * t * t + b;
        }

        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
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
    static inQuint = function (t, b, c, d)
    {
        t /= d;
        return c * t * t * t * t * t + b;
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
    static outQuint = function (t, b, c, d)
    {
        t /= d;
        t--;
        return c * (t * t * t * t * t + 1) + b;
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
    static inOutQuint = function (t, b, c, d)
    {
        t /= d/2;
        if (t < 1) {
            return c / 2 * t * t * t * t * t + b;
        }

        t -= 2;
        return c / 2 * (t * t * t * t * t + 2) + b;
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
    static inSine = function (t, b, c, d)
    {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
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
    static outSine = function (t, b, c, d)
    {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
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
    static inOutSine = function (t, b, c, d)
    {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
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
    static inExpo = function (t, b, c, d)
    {
        return c * Math.pow(2, 10 * (t / d - 1) ) + b;
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
    static outExpo = function (t, b, c, d)
    {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
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
    static inOutExpo = function (t, b, c, d)
    {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }

        t--;
        return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
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
    static inCirc = function (t, b, c, d)
    {
        t /= d;
        return -c * (Math.sqrt(1 - t * t) - 1) + b;
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
    static outCirc = function (t, b, c, d)
    {
        t /= d;
        t--;
        return c * Math.sqrt(1 - t * t) + b;
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
    static inOutCirc = function (t, b, c, d)
    {
        t /= d / 2;
        if (t < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }

        t -= 2;
        return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
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
    static inBack = function (t, b, c, d)
    {
        return c * (t /= d) * t * ((1.70158 + 1) * t - 1.70158) + b;
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
    static outBack = function (t, b, c, d)
    {
        return c * ((t = t / d - 1) * t * ((1.70158 + 1) * t + 1.70158) + 1) + b;
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
    static inOutBack = function (t, b, c, d)
    {
        let s = 1.70158;
        if ((t /= d / 2) < 1) {
            return c / 2 *
                (t * t * (((s *= (1.525)) + 1)
                    * t - s)) + b;
        }

        return c / 2 *
            ((t -= 2) * t *
                (((s *= (1.525)) + 1) * t
                    + s) + 2) + b;
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
    static inElastic = function (t, b, c, d)
    {
        if (t === 0) {
            return b;
        }

        if ((t /= d) === 1) {
            return b + c;
        }

        let s = 1.70158;
        let p = d * 0.3;
        let a = c;

        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            if (c && a) {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
        }

        t -= 1;
        return -(a * Math.pow(2, 10 * t)
            * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
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
    static outElastic = function (t, b, c, d)
    {
        if (t === 0) {
            return b;
        }

        if ((t /= d) === 1) {
            return b + c;
        }

        let s = 1.70158;
        let p = d * 0.3;
        let a = c;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            if (c && a) {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
        }

        return a * Math.pow(2, -10 * t)
            * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
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
    static inOutElastic = function (t, b, c, d)
    {
        if (t === 0) {
            return b;
        }

        t /= (d / 2);
        if (t === 2) {
            return b + c;
        }

        let s = 1.70158;
        let p = d * (0.3 * 1.5);
        let a = c;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            if (c && a) {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
        }

        if (t < 1) {
            return -0.5 * (a *
                Math.pow(2, 10 * (t -= 1))
                * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }

        return a * Math.pow(2, -10 * (t -= 1))
            * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
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
    static outBounce = function (t, b, c, d)
    {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        }
        if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        }
        if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        }
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
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
    static inBounce = function (t, b, c, d)
    {
        return c - Util.$easeOutBounce(d - t, 0, c, d) + b;
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
    static inOutBounce = function (t, b, c, d)
    {
        if (t < d / 2) {
            return Easing.inBounce(t * 2, 0, c, d) * 0.5 + b;
        }
        return Easing.outBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }

}