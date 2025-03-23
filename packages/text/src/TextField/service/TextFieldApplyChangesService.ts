import type { DisplayObject } from "@next2d/display";

/**
 * @description DisplayObjectの更新フラグを立てる
 *              Set the update flag of DisplayObject
 *
 * @param  {DisplayObject} display_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): void =>
{
    display_object.changed = true;

    const parent = display_object.parent as unknown as D;
    if (parent && !parent.changed) {
        execute(parent);
    }
};