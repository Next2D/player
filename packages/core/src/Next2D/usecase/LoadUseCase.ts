import type { IPlayerOptions } from "../../interface/IPlayerOptions";
import type { MovieClip } from "@next2d/display";
import { $clamp } from "../../CoreUtil";
import { URLRequest } from "@next2d/net";
import { IOErrorEvent } from "@next2d/events";
import { execute as playerResizeEventUseCase } from "../../Player/usecase/PlayerResizeEventUseCase";
import { execute as playerRemoveLoadingElementService } from "../../Player/service/PlayerRemoveLoadingElementService";
import { execute as playerAppendCanvasElementService } from "../../Player/service/PlayerAppendElementService";
import { execute as playerReadyCompleteUseCase } from "../../Player/usecase/PlayerReadyCompleteUseCase";
import { execute as playerBootUseCase } from "../../Player/usecase/PlayerBootUseCase";
import { execute as canvasSetPositionService } from "../../Canvas/service/CanvasSetPositionService";
import {
    Loader,
    stage
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
    playerBootUseCase(options);

    const loader = new Loader();

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
    const stageData = loaderInfo.data.stage;
    stage.stageWidth      = stageData.width;
    stage.stageHeight     = stageData.height;
    stage.frameRate       = $clamp(stageData.fps, 1, 60, 60);
    stage.backgroundColor = options && options.bgColor ? options.bgColor : stageData.bgColor;

    stage.addChild<MovieClip>(loaderInfo.content as MovieClip);

    // resize
    playerResizeEventUseCase();

    // // ready complete
    playerReadyCompleteUseCase();

    // // remove loading
    playerRemoveLoadingElementService();

    // // append canvas
    playerAppendCanvasElementService();

    // // set position
    canvasSetPositionService();
};