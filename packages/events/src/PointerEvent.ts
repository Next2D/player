import { Event } from "./Event";
import { $getEvent } from "./EventUtil";

/**
 * @description ポインターは、入力機器（マウス、ペン、またはタッチ可能な面の上の接触点など）のハードウェアにとらわれない表現です。
 *              ポインターは、画面などの接触面上の特定の座標（または座標の集合）をターゲットにすることができます。
 *              A pointer is a hardware-agnostic representation of an input device (such as a mouse, pen, or point of contact on a touchable surface).
 *              A pointer can target a specific coordinate (or set of coordinates) on a screen or other contact surface.
 *
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
export class PointerEvent extends Event
{
    /**
     * @param {string}  type
     * @param {boolean} [bubbles=true]
     *
     * @constructor
     * @public
     */
    constructor (type: string, bubbles: boolean = true)
    {
        super(type, bubbles);

        return new Proxy(this, {
            "get": (object: any, name: string) =>
            {
                if (name in object) {
                    return object[name];
                }

                const event = $getEvent();
                if (!event) {
                    return undefined;
                }

                switch (event.type) {

                    case PointerEvent.POINTER_DOWN:
                    case PointerEvent.POINTER_MOVE:
                    case PointerEvent.POINTER_UP:
                    case PointerEvent.POINTER_LEAVE:
                    case PointerEvent.POINTER_OVER:
                    case PointerEvent.POINTER_OUT:
                        if (name in event) {
                            // @ts-ignore
                            return $event[name];
                        }
                        return undefined;

                    default:
                        return undefined;

                }

            }
        });
    }

    /**
     * @description ボタンが連続で押された時に発生します。
     *              Occurs when a button is pressed continuously.
     *
     * @return {string}
     * @const
     * @static
     */
    static get DOUBLE_CLICK (): string
    {
        return "dblclick";
    }

    /**
     * @description ボタンが押されていない状態から 1 つ以上のボタンが押されている状態に遷移したときに発生します
     *              Occurs when one or more buttons are pressed from the state where no buttons are pressed.
     *
     * @return {string}
     * @const
     * @static
     */
    static get POINTER_DOWN (): string
    {
        return "pointerdown";
    }

    /**
     * @description ポインティングデバイスが要素のヒットテスト領域を出た時に発生します
     *              Occurs when the pointing device leaves the hit test area of an element
     *
     * @return {string}
     * @const
     * @static
     */
    static get POINTER_LEAVE (): string
    {
        return "pointerleave";
    }

    /**
     * @description ポインターの座標が変化し、かつタッチ操作によってポインターがキャンセルされていないときに発生します。
     *              Occurs when the pointer coordinates change and the pointer is not canceled by a touch operation.
     *
     * @return {string}
     * @const
     * @static
     */
    static get POINTER_MOVE (): string
    {
        return "pointermove";
    }

    /**
     * @description ヒットテスト境界を出たに発生します。ホバーに対応していない端末では発生しません。
     *              Occurs when the hit test boundary is exited. Does not occur on devices that do not support hover.
     *
     * @return {string}
     * @const
     * @static
     */
    static get POINTER_OUT (): string
    {
        return "pointerout";
    }

    /**
     * @description インティングデバイスが要素のヒットテスト境界内に移動したときに発生します。
     *              Occurs when the pointing device moves into the hit test boundary of an element.
     *
     * @return {string}
     * @const
     * @static
     */
    static get POINTER_OVER (): string
    {
        return "pointerover";
    }

    /**
     * @description ポインターがアクティブではなくなったときに発生します。
     *              Occurs when the pointer is no longer active.
     *
     * @return {string}
     * @const
     * @static
     */
    static get POINTER_UP (): string
    {
        return "pointerup";
    }

    /**
     * @description ポインターのキャンセル時に発生します。
     *              Occurs when the pointer is canceled.
     *
     * @return {string}
     * @const
     * @static
     */
    static get POINTER_CANCEl (): string
    {
        return "pointercancel";
    }
}