import { Event } from "./Event";
import { $getEvent } from "./EventUtil";

/**
 * @description ホイールイベントは、マウスホイールの回転を表します。
 *              A WheelEvent represents events that occur due to the user moving a mouse wheel or similar input device.
 *
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
export class WheelEvent extends Event
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

                if (event.type === WheelEvent.WHEEL) {
                    // @ts-ignore
                    return name in event ? $event[name] : undefined;
                }
                return undefined;
            }
        });
    }

    /**
     * @description ポインティングデバイス（通常はマウス）のホイールボタンを回転させたときに発生します。
     *              Occurs when the wheel button of a pointing device (usually a mouse) is rotated.
     *
     * @return {string}
     * @const
     * @static
     */
    static get WHEEL (): string
    {
        return "wheel";
    }
}