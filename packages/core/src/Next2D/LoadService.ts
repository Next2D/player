import type { IPlayerOptions } from "../interface/IPlayerOptions";
import type { IStageData } from "../interface/IStageData";
import type { MovieClip } from "@next2d/display";
import { $player } from "../Player";
import { $clamp } from "../CoreUtil";
import { URLRequest } from "@next2d/net";
import { IOErrorEvent } from "@next2d/events";
import { execute as playerResizeEventService } from "../Player/PlayerResizeEventService";
import { execute as playerRemoveLoadingElementService } from "../Player/PlayerRemoveLoadingElementService";
import { execute as playerAppendCanvasElementService } from "../Player/PlayerAppendCanvasElementService";
import { execute as playerReadyCompleteService } from "../Player/PlayerReadyCompleteService";
import {
    Loader,
    $stage
} from "@next2d/display";

/**
 * @description 指定のURLからJSONファイルを読み込みます。
 *              Reads a JSON file from the specified URL.
 *
 * @param  {string} url
 * @param  {object} [options=null]
 * @return {Promise}
 * @method
 * @protected
 */
export const execute = async (url: string, options: IPlayerOptions | null = null): Promise<void> =>
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

    // player
    $player.boot(options);

    const loader: Loader = new Loader();

    const loaderInfo = loader.contentLoaderInfo;
    loaderInfo.addEventListener(IOErrorEvent.IO_ERROR, (event: IOErrorEvent): void =>
    {
        alert("Error: " + event.text);
    });

    await loader.load(new URLRequest(url));

    if (!loaderInfo.data) {
        return ;
    }

    // update properties
    const stageData: IStageData = loaderInfo.data.stage;
    $stage.stageWidth      = stageData.width;
    $stage.stageHeight     = stageData.height;
    $stage.frameRate       = $clamp(stageData.fps, 1, 60, 60);
    $stage.backgroundColor = stageData.bgColor;

    $stage.addChild<MovieClip>(loaderInfo.content as MovieClip);

    // resize
    playerResizeEventService();

    // TODO: ready complete
    playerReadyCompleteService();

    // remove loading
    playerRemoveLoadingElementService();

    // append canvas
    playerAppendCanvasElementService();
};