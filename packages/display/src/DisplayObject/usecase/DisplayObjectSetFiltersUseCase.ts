import type { DisplayObject } from "../../DisplayObject";
import type { IFilterArray } from "../../interface/IFilterArray";
import { execute as displayObjectApplyChangesService } from "../service/DisplayObjectApplyChangesService";

/**
 * @description DisplayObjectにフィルタを設定
 *              Set a filter to the DisplayObject.
 *
 * @param  {DisplayObject} display_object
 * @param  {IFilterArray | null} filters
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D, filters: IFilterArray | null): void =>
{
    display_object.$filters = filters;
    displayObjectApplyChangesService(display_object);
};