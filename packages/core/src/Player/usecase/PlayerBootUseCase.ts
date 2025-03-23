import type { IPlayerOptions } from "../../interface/IPlayerOptions";
import { $player } from "../../Player";
import { execute as playerCreateContainerElementService } from "../service/PlayerCreateContainerElementService";
import { execute as playerApplyContainerElementStyleService } from "../service/PlayerApplyContainerElementStyleService";
import { execute as playerLoadingAnimationService } from "../service/PlayerLoadingAnimationService";
import { execute as playerResizeEventService } from "./PlayerResizeEventUseCase";
import { execute as playerResizeRegisterService } from "./PlayerResizeRegisterUseCase";

/**
 * @description Playerの初期起動処理
 *              Initial startup processing of Player
 *
 * @param  {IPlayerOptions} [options=null]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (options: IPlayerOptions | null = null): void =>
{
    $player.setOptions(options);

    // create element
    const element = playerCreateContainerElementService();

    // apply base style
    playerApplyContainerElementStyleService(
        element, $player.fixedWidth, $player.fixedHeight
    );

    // start loading
    playerLoadingAnimationService(element);

    // register resize event
    if (!$player.fixedWidth && !$player.fixedHeight) {
        playerResizeRegisterService();
    }

    // initialize resize
    playerResizeEventService();
};