import type { IEventListener } from "./interface/IEventListener";

/**
 * @type {Map}
 * @private
 */
export const $broadcastEvents: Map<string, IEventListener[]> = new Map();

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
 * @private
 */
type IEvent = PointerEvent | KeyboardEvent | WheelEvent | Event | null;

/**
 * @type {IEvent}
 * @private
 */
let $event: IEvent = null;

/**
 * @description アクティブなイベントオブジェクをセット
 *              Set the active event object
 *
 * @param  {IEvent} event
 * @return {void}
 * @method
 * @protected
 */
export const $setEvent = (event: IEvent): void =>
{
    $event = event;
};

/**
 * @description アクティブなイベントオブジェクを取得
 *              Get the active event object
 *
 * @return {IEvent}
 * @method
 * @protected
 */
export const $getEvent = (): IEvent =>
{
    return $event;
};