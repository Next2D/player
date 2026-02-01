import type { DisplayObject } from "../../DisplayObject";

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

    let parent = display_object.parent as D | null;                                                                                                                   
    while (parent && !parent.changed) {                                                                                                                      
        parent.changed = true;                                                                                                                              
        parent = parent.parent as D | null;                                                                                                                              
    }
};