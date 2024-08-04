import type { AnimationToolDataImpl } from "../../interface/AnimationToolDataImpl";
import type { Loader } from "../../Loader";
import { Event } from "@next2d/events";
import { MovieClip } from "../../MovieClip";

/**
 * @description 読み込んだJSONオブジェクトからrootのMovieClipを構築
 *              Build the root MovieClip from the loaded JSON object
 *
 * @param  {Loader} loader
 * @param  {object} object
 * @return {Promise}
 * @method
 * @protected
 */
export const execute = async (loader: Loader, object: AnimationToolDataImpl): Promise<void> =>
{
    const symbols: Map<string, number> = new Map();
    if (object.symbols.length) {
        for (let idx: number = 0; idx < object.symbols.length; ++idx) {

            const values: any[] = object.symbols[idx];

            symbols.set(values[0], values[1]);
        }
    }

    const loaderInfo = loader.contentLoaderInfo;
    loaderInfo.data = {
        "stage": object.stage,
        "characters": object.characters,
        "symbols": symbols
    };

    // build root content
    const movieClip = new MovieClip();
    await movieClip._$build<Loader>({
        "characterId": 0,
        "name": "main",
        "clipDepth": 0,
        "depth": 0,
        "endFrame": object.characters[0].controller.length,
        "startFrame": 1
    }, loader);

    loaderInfo.content = movieClip;

    // dispatch complete event
    if (loaderInfo.willTrigger(Event.COMPLETE)) {
        loaderInfo.dispatchEvent(new Event(Event.COMPLETE));
    }
};