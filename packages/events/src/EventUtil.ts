import type { EventListenerImpl } from "./interface/EventListenerImpl";

/**
 * @type {Map}
 * @private
 */
export const $broadcastEvents: Map<string, EventListenerImpl[]> = new Map();

/**
 * @type {array}
 * @private
 */
const $array: any[] = [];

/**
 * @return {array}
 * @method
 * @private
 */
export const $getArray = (): any[] =>
{
    return $array.length
        ? $array.pop()
        : [];
};

/**
 * @return {void}
 * @method
 * @private
 */
export const $poolArray = (array: any[]): void =>
{
    if (10 > $array.length) {
        array.length = 0;
        $array.push(array);
    }
};

/**
 * @type {Event}
 * @private
 */
let $activeEvent: PointerEvent | null = null;

/**
 * @description アクティブなイベントオブジェクを返却
 *              Returns the active event object
 *
 * @return {PointerEvent | null}
 * @default null
 * @method
 * @protected
 */
export const $getEvent = (): PointerEvent | null =>
{
    return $activeEvent;
};

/**
 * @description アクティブなイベントオブジェクをセット
 *              Set the active event object
 *
 * @param  {PointerEvent | null} event
 * @return {void}
 * @method
 * @protected
 */
export const $setEvent = (event: PointerEvent | null = null): void =>
{
    $activeEvent = event;
};
