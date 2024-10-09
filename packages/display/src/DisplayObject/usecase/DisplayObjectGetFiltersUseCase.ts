import type { DisplayObject } from "../../DisplayObject";
import type { IFilterArray } from "../../interface/IFilterArray";
import { execute as displayObjectGetPlaceObjectService } from "../service/DisplayObjectGetPlaceObjectService";
import { execute as displayObjectBuildFilterService } from "../service/DisplayObjectBuildFilterService";

/**
 * @description DisplayObjectのフィルタを返却、存在しない場合はnullを返却
 *              Return the filter of the DisplayObject, or return null if it does not exist.
 * 
 * @param  {DisplayObject} display_object
 * @return {IFilterArray | null}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): IFilterArray | null =>
{
    if (display_object.$filters) {
        return display_object.$filters;
    }

    const placeObject = displayObjectGetPlaceObjectService(display_object);
    if (placeObject && placeObject.surfaceFilterList) {

        // build filter
        if (!placeObject.filters) {
            placeObject.filters = displayObjectBuildFilterService(
                placeObject.surfaceFilterList
            );
        }

        return placeObject.filters;
    }

    return null;
};