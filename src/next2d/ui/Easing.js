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
    static inQuad = function (t, b, c, d)
    {
        return (t / d) ** 2 * c + b;
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
    static inOutQuad = function (t, b, c, d)
    {
        return ((t /= (d / 2)) < 1)
            ? t ** 2 * c / 2 + b
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
    static inCubic = function (t, b, c, d)
    {
        return (t /= d) ** 3 * c + b;
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
        return (((t /= d) - 1) ** 3 + 1) * c + b;
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
        return ((t /= (d / 2)) < 1)
            ? t ** 3 * c / 2 + b
            : ((t -= 2) ** 3 + 2) * c / 2 + b;
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
        return (t /= d) ** 4 * c + b;
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
        return (((t /= d) - 1) ** 4 - 1) * -c + b;
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
        return ((t /= (d / 2)) < 1)
            ? t ** 4 * c / 2 + b
            : ((t -= 2) ** 4 - 2) * -c / 2 + b;
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
        return (t /= d) ** 5 * c + b;
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
        return (((t /= d) - 1) ** 5 + 1) * c + b;
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
        return ((t /= (d / 2)) < 1)
            ? t ** 5 * c / 2 + b
            : ((t -= 2) ** 5 + 2) * c / 2 + b;
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
        return ((t /= (d / 2)) < 1)
            ? c / 2 * Math.pow(2, 10 * (t - 1)) + b
            : c / 2 * (-Math.pow(2, -10 * (t -= 1)) + 2) + b;
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
        return (1 - Math.sqrt(1 - (t /= d) ** 2)) * c + b;
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
        return Math.sqrt(1 - ((t /= d) - 1) ** 2) * c + b;
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
        return ((t /= (d / 2)) < 1)
            ? (1 - Math.sqrt(1 - t * t)) * c / 2 + b
            : (Math.sqrt(1 - (t -= 2) ** 2) + 1) * c / 2 + b;
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
        return (2.70158 * (t /= d) ** 3 - 1.70158 * t * t) * c + b;
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
        return (1 + 2.70158 * Math.pow((t /= d) - 1, 3) + 1.70158 * Math.pow(t - 1, 2)) * c + b;
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
        if ((t /= (d / 2)) < 1) {
            return (t ** 2 * (((s *= 1.525) + 1) * t - s)) * c / 2 + b;
        }
        return ((t -= 2) ** 2 * (((s *= 1.525) + 1) * t + s) + 2) * c / 2 + b;
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
        // const c4 = (2 * Math.PI) / 3;
        return ((t /= d) === 0)
            ? b
            : (t === 1)
                ? c + b
                : -Math.pow(2, (t *= 10) - 10) * Math.sin((t - 10.75) * ((2 * Math.PI) / 3)) * c + b;
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
        return ((t /= d) === 0)
            ? b
            : (t === 1)
                ? c + b
                : (Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1) * c + b;
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
        return ((t /= d) === 0)
            ? b
            : (t === 1)
                ? c + b
                : (t < 0.5)
                    ? (-(Math.pow(2, (t *= 20) - 10) * Math.sin((t - 11.125) * ((2 * Math.PI) / 4.5))) / 2) * c + b
                    : ((Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * ((2 * Math.PI) / 4.5))) / 2 + 1) * c + b;
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
            return 7.5625 * t * t * c + b;
        }
        if (t < (2 / 2.75)) {
            return (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) * c + b;
        }
        if (t < (2.5 / 2.75)) {
            return (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) * c + b;
        }
        return (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) * c + b;
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
    static inOutBounce = function (t, b, c, d)
    {
        return (t < d / 2)
            ? Easing.inBounce(t * 2, b, c / 2, d)
            : Easing.outBounce(t * 2 - d, b + c / 2, c / 2, d);
    }
}