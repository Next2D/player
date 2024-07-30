import type { PlayerOptionsImpl } from "../interface/PlayerOptionsImpl";
import { Sprite, $stage } from "@next2d/display";
import { $player } from "../Player";
import { $LOAD_END } from "../CoreUtil";

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
    options: PlayerOptionsImpl | null = null
): Promise<Sprite> => {

    // setup
    $player.mode      = "create";
    $player.width     = width | 0;
    $player.height    = height | 0;
    $player.frameRate = fps | 0;

    $player
        .setOptions(options)
        .boot();

    const root: Sprite = $stage.addChild(new Sprite());

    $player._$loadStatus = $LOAD_END;
    $player.play();

    return root;
};