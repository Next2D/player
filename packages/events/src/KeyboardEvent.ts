import { $getEvent } from "./EventUtil";
import { Event } from "./Event";

/**
 * @description キーボードによるユーザーの操作を示します。
 *              Indicates user operation via keyboard.
 *
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
export class KeyboardEvent extends Event
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

                    case KeyboardEvent.KEY_DOWN:
                    case KeyboardEvent.KEY_UP:
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
     * @description キーボードのキーが押される度に発生します。
     *              Occurs each time a key is pressed on the keyboard.
     *
     * @return {string}
     * @const
     * @static
     */
    static get KEY_DOWN (): string
    {
        return "keydown";
    }

    /**
     * @description キーボードのキーが離されたときに発生します。
     *              Occurs when a key on the keyboard is released.
     *
     * @return {string}
     * @const
     * @static
     */
    static get KEY_UP (): string
    {
        return "keyup";
    }
}