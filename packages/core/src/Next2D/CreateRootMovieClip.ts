import type { PlayerOptionsImpl } from "../interface/PlayerOptionsImpl";
import { Sprite } from "@next2d/display";
import { Player } from "../Player";

/**
 * @description RootのMovieClipを作成します。
 *              Create a MovieClip for Root.
 *
 * @param  {Player} player
 * @param  {number} width
 * @param  {number} height
 * @param  {number} fps
 * @param  {object} options
 * @return {Promise}
 * @method
 * @protected
 */
export const execute = async (
    player: Player,
    width: number = 240,
    height: number = 240,
    fps: number = 24,
    options: PlayerOptionsImpl | null = null
): Promise<Sprite> => {

    // setup
    player.width  = width | 0;
    player.height = height | 0;
    player.mode   = "create";
    player.stage._$frameRate = fps | 0;
    player.setOptions(options);
    player._$initialize();

    const root: Sprite = player.stage.addChild(new Sprite());

    player._$loadStatus = Player.LOAD_END;
    player.play();

    return root;
};