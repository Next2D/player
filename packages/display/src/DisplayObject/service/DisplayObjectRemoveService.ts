import type { DisplayObject } from "../../DisplayObject";

/**
 * @description 親子関係を解除する。
 *              Break the parent-child relationship.
 *
 * @param  {DisplayObject} display_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): void =>
{
    const parent = display_object.parent;
    if (!parent) {
        return ;
    }
    parent.removeChild(display_object);
};