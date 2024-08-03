import type { PlayerOptionsImpl } from "../interface/PlayerOptionsImpl";
import type { StageDataImpl } from "../interface/StageDataImpl";
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
 * @param  {PlayerOptionsImpl} options
 * @return {Promise}
 * @method
 * @protected
 */
export const execute = async (url: string, options: PlayerOptionsImpl | null = null): Promise<void> =>
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
    const stageData: StageDataImpl = loaderInfo.data.stage;
    $player.stageWidth  = stageData.width;
    $player.stageHeight = stageData.height;
    $player.frameRate   = $clamp(stageData.fps, 1, 60, 60);
    $player.bgColor     = stageData.bgColor;

    $stage.addChild<MovieClip>(loaderInfo.content as MovieClip);

    // resize
    playerResizeEventService();

    // remove loading
    playerRemoveLoadingElementService();

    // append canvas
    playerAppendCanvasElementService();

    // TODO: ready complete
    playerReadyCompleteService();
};