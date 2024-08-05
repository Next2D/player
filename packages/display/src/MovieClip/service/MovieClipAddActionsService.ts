import type { IMovieClipActionObject } from "../../interface/IMovieClipActionObject";
import { $getArray } from "../../DisplayObjectUtil";

/**
 * @description 指定フレームに関数を追加
 *              Add a function to the specified frame
 *
 * @param  {Map} actions
 * @param  {array} objects
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    actions: Map<number, Function[]>,
    objects: IMovieClipActionObject[]
): void => {

    for (let idx = 0; idx < objects.length; ++idx) {

        const object = objects[idx];
        if (!object) {
            continue;
        }

        if (!object.script) {
            object.script = Function(object.action);
        }

        const frame = object.frame;
        if (!actions.has(frame)) {
            actions.set(frame, $getArray());
        }

        actions.get(frame)?.push(object.script);
    }
};