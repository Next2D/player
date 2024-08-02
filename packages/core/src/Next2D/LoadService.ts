import type { PlayerOptionsImpl } from "../interface/PlayerOptionsImpl";
import type { StageDataImpl } from "../interface/StageDataImpl";
import { $player } from "../Player";
import { $clamp } from "../CoreUtil";
import { URLRequest } from "@next2d/net";
import { IOErrorEvent } from "@next2d/events";
import {
    Loader,
    $stage
} from "@next2d/display";

/**
 * @description 指定のURLからJSONファイルを読み込みます。
 *              Reads a JSON file from the specified URL.
 *
 * @param  {string} url
 * @param  {PlayerOptionsImpl} options
 * @return {Promise}
 * @method
 * @protected
 */
export const execute = async (url: string, options: PlayerOptionsImpl): Promise<void> =>
{
    if (url === "develop") {
        const path: string = location
            .search
            .slice(1)
            .split("&")[0];

        if (!path) {
            return ;
        }
        url = `${location.origin}/${path}`;
    }

    if (!url) {
        return ;
    }

    if (url.charAt(1) === "/") {
        url = url.slice(1);
    }

    $player.boot(options);

    const loader: Loader = new Loader();

    const loaderInfo = loader.contentLoaderInfo;
    loaderInfo.addEventListener(IOErrorEvent.IO_ERROR, (event: IOErrorEvent): void =>
    {
        alert("Error: " + event.text);
    });

    // loader
    //     .contentLoaderInfo
    //     .addEventListener(Event.COMPLETE, (event: Event): void =>
    //     {
    //         const loaderInfo: LoaderInfo = event.target as NonNullable<LoaderInfo>;

    //         if (event.listener) {
    //             loaderInfo
    //                 .removeEventListener(Event.COMPLETE, event.listener);
    //         }

    //         if (loaderInfo._$data) {

    //             const stage: StageDataImpl = loaderInfo._$data.stage;

    //             $player.bgColor = stage.bgColor;
    //             // $player._$setBackgroundColor(stage.bgColor);

    //             $stage.addChild(loaderInfo.content);

    //             $player.width  = stage.width;
    //             $player.height = stage.height;

    //             // set fps fixed logic
    //             $player.frameRate = $clamp(+stage.fps, 1, 60, 60);
    //         }

    //         // $player._$resize();

    //         resolve();
    //     });

    await loader.load(new URLRequest(url));

    if (!loaderInfo.data) {
        return ;
    }

    const stage: StageDataImpl = loaderInfo.data.stage;

    $player.bgColor = stage.bgColor;
    // $player._$setBackgroundColor(stage.bgColor);

    $stage.addChild(loaderInfo.content);

    $player.rendererWidth  = stage.width;
    $player.rendererHeight = stage.height;

    // set fps fixed logic
    $player.frameRate = $clamp(stage.fps, 1, 60, 60);
};