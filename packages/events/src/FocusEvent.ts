import { Event } from "./Event";
import { $getEvent } from "./EventUtil";

/**
 * @description FocusEvent オブジェクトは、ユーザーが表示リストの1つのオブジェクトから
 *              別のオブジェクトにフォーカスを変更したときにオブジェクトによって送出されます。
 *              次の2種類のフォーカスイベントがあります。
 *
 *              An object dispatches a FocusEvent object when the user changes
 *              the focus from one object in the display list to another.
 *              There are two types of focus events:
 *
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
export class FocusEvent extends Event
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

                    case FocusEvent.FOCUS_IN:
                    case FocusEvent.FOCUS_OUT:
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
     * @description focusIn イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a focusIn event object.
     *
     * @return {string}
     * @const
     * @static
     */
    static get FOCUS_IN (): string
    {
        return "focusin";
    }

    /**
     * @description focusOut イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a focusOut event object.
     *
     * @return {string}
     * @const
     * @static
     */
    static get FOCUS_OUT (): string
    {
        return "focusout";
    }
}