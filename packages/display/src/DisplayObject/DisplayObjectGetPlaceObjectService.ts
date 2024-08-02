import type { DisplayObjectImpl } from "../interface/DisplayObjectImpl";
import type { PlaceObjectImpl } from "../interface/PlaceObjectImpl";
import type { ParentImpl } from "../interface/ParentImpl";

/**
 * @description DisplayObjectのPlaceObjectを返却、存在しない場合はnullを返却
 *              Return the PlaceObject of the DisplayObject, or return null if it does not exist.
 *
 * @param  {DisplayObject} display_object
 * @return {object}
 * @method
 * @protected
 */
export const execute = (display_object: DisplayObjectImpl<any>): PlaceObjectImpl | null =>
{
    // キャッシュされたPlaceObjectがあれば返却
    const placeObject: PlaceObjectImpl | null = display_object._$placeObject;
    if (placeObject) {
        return placeObject;
    }

    const placeId = display_object._$placeId;
    if (placeId === -1) {
        return null;
    }

    const parent: ParentImpl<any> | null = display_object.parent;
    if (!parent || !parent._$placeObjects) {
        return null;
    }

    const placeMap: Array<Array<number>> | null = parent._$placeMap;
    if (!placeMap || !placeMap.length) {
        return null;
    }

    const frame: number = "currentFrame" in parent ? parent.currentFrame : 1;
    const places: number[] | void = placeMap[frame];
    if (!places) {
        return null;
    }

    const targetPlaceId: number = places[placeId] | 0;
    const targetPlaceObject: PlaceObjectImpl | void = parent._$placeObjects[targetPlaceId];
    if (!targetPlaceObject) {
        return null;
    }

    // キャッシュ
    display_object._$placeObject = targetPlaceObject;

    return null;
};