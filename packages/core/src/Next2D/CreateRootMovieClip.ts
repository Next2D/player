import type { IPlayerOptions } from "../interface/IPlayerOptions";
import { $player } from "../Player";
import { $clamp } from "../CoreUtil";
import {
    Sprite,
    $stage
} from "@next2d/display";

/**
 * @description RootのMovieClipを作成します。
 *              Create a MovieClip for Root.
 *
 * @param  {number} width
 * @param  {number} height
 * @param  {number} fps
 * @param  {object} options
 * @return {Promise}
 * @method
 * @protected
 */
export const execute = async (
    width: number = 240,
    height: number = 240,
    fps: number = 24,
    options: IPlayerOptions | null = null
): Promise<Sprite> => {

    // setup
    $stage.stageWidth  = width | 0;
    $stage.stageHeight = height | 0;
    $stage.frameRate   = $clamp(fps, 1, 60, 60);
    if (options && options.bgColor) {
        $stage.backgroundColor = options.bgColor;
    }
    
    // boot player
    $player.boot(options);
    $player.play();

    return $stage.addChild<Sprite>(new Sprite());
};