import { execute as easingLinearService } from "./Easing/service/EasingLinearService";
import { execute as easingInQuadService } from "./Easing/service/EasingInQuadService";
import { execute as easingOutQuadService } from "./Easing/service/EasingOutQuadService";
import { execute as easingInOutQuadService } from "./Easing/service/EasingInOutQuadService";
import { execute as easingInCubicService } from "./Easing/service/EasingInCubicService";
import { execute as easingOutCubicService } from "./Easing/service/EasingOutCubicService";
import { execute as easingInOutCubicService } from "./Easing/service/EasingInOutCubicService";
import { execute as easingInQuartService } from "./Easing/service/EasingInQuartService";
import { execute as easingOutQuartService } from "./Easing/service/EasingOutQuartService";
import { execute as easingInOutQuartService } from "./Easing/service/EasingInOutQuartService";
import { execute as easingInQuintService } from "./Easing/service/EasingInQuintService";
import { execute as easingOutQuintService } from "./Easing/service/EasingOutQuintService";
import { execute as easingInOutQuintService } from "./Easing/service/EasingInOutQuintService";
import { execute as easingInSineService } from "./Easing/service/EasingInSineService";
import { execute as easingOutSineService } from "./Easing/service/EasingOutSineService";
import { execute as easingInOutSineService } from "./Easing/service/EasingInOutSineService";
import { execute as easingInExpoService } from "./Easing/service/EasingInExpoService";
import { execute as easingOutExpoService } from "./Easing/service/EasingOutExpoService";
import { execute as easingInOutExpoService } from "./Easing/service/EasingInOutExpoService";
import { execute as easingInCircService } from "./Easing/service/EasingInCircService";
import { execute as easingOutCircService } from "./Easing/service/EasingOutCircService";
import { execute as easingInOutCircService } from "./Easing/service/EasingInOutCircService";
import { execute as easingInBackService } from "./Easing/service/EasingInBackService";
import { execute as easingOutBackService } from "./Easing/service/EasingOutBackService";
import { execute as easingInOutBackService } from "./Easing/service/EasingInOutBackService";
import { execute as easingInElasticService } from "./Easing/service/EasingInElasticService";
import { execute as easingOutElasticService } from "./Easing/service/EasingOutElasticService";
import { execute as easingInOutElasticService } from "./Easing/service/EasingInOutElasticService";
import { execute as easingOutBounceService } from "./Easing/service/EasingOutBounceService";
import { execute as easingInBounceService } from "./Easing/service/EasingInBounceService";
import { execute as easingInOutBounceService } from "./Easing/service/EasingInOutBounceService";

/**
 * @description Easeクラスは、イージング機能の関数を提供します。
 *              The Ease class provides a collection of easing functions
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
     * @default "[class Easing]"
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
     * @default "next2d.ui.Easing"
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
     * @default "[object Easing]"
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
     * @default "next2d.ui.Easing"
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
        return easingLinearService(t, b, c, d);
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
        return easingInQuadService(t, b, c, d);
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
        return easingOutQuadService(t, b, c, d);
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
        return easingInOutQuadService(t, b, c, d);
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
        return easingInCubicService(t, b, c, d);
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
        return easingOutCubicService(t, b, c, d);
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
        return easingInOutCubicService(t, b, c, d);
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
        return easingInQuartService(t, b, c, d);
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
        return easingOutQuartService(t, b, c, d);
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
        return easingInOutQuartService(t, b, c, d);
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
        return easingInQuintService(t, b, c, d);
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
        return easingOutQuintService(t, b, c, d);
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
        return easingInOutQuintService(t, b, c, d);
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
        return easingInSineService(t, b, c, d);
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
        return easingOutSineService(t, b, c, d);
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
        return easingInOutSineService(t, b, c, d);
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
        return easingInExpoService(t, b, c, d);
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
        return easingOutExpoService(t, b, c, d);
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
        return easingInOutExpoService(t, b, c, d);
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
        return easingInCircService(t, b, c, d);
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
        return easingOutCircService(t, b, c, d);
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
        return easingInOutCircService(t, b, c, d);
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
        return easingInBackService(t, b, c, d);
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
        return easingOutBackService(t, b, c, d);
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
        return easingInOutBackService(t, b, c, d);
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
        return easingInElasticService(t, b, c, d);
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
        return easingOutElasticService(t, b, c, d);
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
        return easingInOutElasticService(t, b, c, d);
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
        return easingOutBounceService(t, b, c, d);
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
        return easingInBounceService(t, b, c, d);
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
        return easingInOutBounceService(t, b, c, d);
    }
}
