import type { DisplayObject } from "../../DisplayObject";
import type { IPlaceObject } from "../../interface/IPlaceObject";

/**
 * @description DisplayObjectのPlaceObjectを返却、存在しない場合はnullを返却
 *              Return the PlaceObject of the DisplayObject, or return null if it does not exist.
 *
 * @param  {DisplayObject} display_object
 * @return {object}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): IPlaceObject | null =>
{
    // キャッシュされたPlaceObjectがあれば返却
    if (display_object.placeObject) {
        return display_object.placeObject;
    }

    const placeId = display_object.placeId;
    if (placeId === -1) {
        return null;
    }

    const parent = display_object.parent;
    if (!parent) {
        return null;
    }

    const loaderInfo = parent.loaderInfo;
    if (!loaderInfo || !loaderInfo.data) {
        return null;
    }

    const character = loaderInfo.data.characters[parent.characterId];
    const frame: number = parent.isTimelineEnabled ? parent.currentFrame : 1;
    const places: number[] | void = character.placeMap[frame];
    if (!places || !(placeId in places)) {
        return null;
    }

    const id: number = places[placeId];
    const placeObject: IPlaceObject | void = character.placeObjects[id];
    if (!placeObject) {
        return null;
    }

    // キャッシュ
    display_object.placeObject = placeObject;

    return placeObject;
};