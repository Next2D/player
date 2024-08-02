import type { NoCodeDataImpl } from "../interface/NoCodeDataImpl";
import type { LoaderInfo } from "../LoaderInfo";

export const execute = async (loader_info: LoaderInfo, object: NoCodeDataImpl): Promise<void> =>
{
    const symbols: Map<string, number> = new Map();
    if (object.symbols.length) {
        for (let idx: number = 0; idx < object.symbols.length; ++idx) {

            const values: any[] = object.symbols[idx];

            symbols.set(values[0], values[1]);
        }
    }

    loader_info.data = {
        "stage": object.stage,
        "characters": object.characters,
        "symbols": symbols
    };

    // setup
    // loader_info.content = new MovieClip();
    // console.log(object);

    // build root
    // const root: MovieClipCharacterImpl = object.characters[0];
    // loaderInfo._$content._$build({
    //     "characterId": 0,
    //     "clipDepth": 0,
    //     "depth": 0,
    //     "endFrame": root.controller.length,
    //     "startFrame": 1
    // }, this);
};