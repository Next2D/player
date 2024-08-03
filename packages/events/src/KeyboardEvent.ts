import { $activeEvent } from "./EventUtil";
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

                if ($activeEvent && name in $activeEvent) {
                    // @ts-ignore
                    return $activeEvent[name];
                }

                return undefined;
            }
        });
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default "next2d.events.KeyboardEvent"
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.events.KeyboardEvent";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default "next2d.events.KeyboardEvent"
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.events.KeyboardEvent";
    }

    /**
     * @description キーボードのキーが押される度に発生します。
     *              Occurs each time a key is pressed on the keyboard.
     *
     * @return {string}
     * @default "dblclick"
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
     * @default "dblclick"
     * @const
     * @static
     */
    static get KEY_UP (): string
    {
        return "keyup";
    }
}