import type { PlayerOptionsImpl } from "../interface/PlayerOptionsImpl";
import type { StageDataImpl } from "../interface/StageDataImpl";
import { $player } from "../Player";
import { $clamp } from "../CoreUtil";
import {
    Event,
    IOErrorEvent
} from "@next2d/events";
import {
    Loader,
    LoaderInfo,
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
export const execute = (url: string, options: PlayerOptionsImpl): Promise<void> =>
{
    return new Promise((resolve: Function) =>
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

        $player
            .setOptions(options)
            .boot();

        const loader: Loader = new Loader();

        loader
            .contentLoaderInfo
            .addEventListener(IOErrorEvent.IO_ERROR, (event: IOErrorEvent): void =>
            {
                alert("Error: " + event.text);
                resolve();
            });

        loader
            .contentLoaderInfo
            .addEventListener(Event.COMPLETE, (event: Event): void =>
            {
                const loaderInfo: LoaderInfo = event.target as NonNullable<LoaderInfo>;

                if (event.listener) {
                    loaderInfo
                        .removeEventListener(Event.COMPLETE, event.listener);
                }

                if (loaderInfo._$data) {

                    const stage: StageDataImpl = loaderInfo._$data.stage;

                    $player.bgColor = stage.bgColor;
                    // $player._$setBackgroundColor(stage.bgColor);

                    $stage.addChild(loaderInfo.content);

                    $player.width  = stage.width;
                    $player.height = stage.height;

                    // set fps fixed logic
                    $player.frameRate = $clamp(+stage.fps, 1, 60, 60);
                }

                // $player._$resize();

                resolve();
            });

        // loader.load(new URLRequest(url));
    });
};