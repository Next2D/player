import type { IPlayerOptions } from "../../interface/IPlayerOptions";
import { $clamp } from "../../CoreUtil";
import { execute as playerRemoveLoadingElementService } from "../../Player/service/PlayerRemoveLoadingElementService";
import { execute as playerAppendElementService } from "../../Player/service/PlayerAppendElementService";
import { execute as playerReadyCompleteUseCase } from "../../Player/usecase/PlayerReadyCompleteUseCase";
import { execute as playerBootUseCase } from "../../Player/usecase/PlayerBootUseCase";
import { execute as canvasSetPositionService } from "../../Canvas/service/CanvasSetPositionService";
import {
    Sprite,
    stage
} from "@next2d/display";

/**
 * @description RootのMovieClipを作成します。
 *              Create a MovieClip for Root.
 *
 * @param  {number} [width=240]
 * @param  {number} [height=240]
 * @param  {number} [fps=60]
 * @param  {object} [options=null]
 * @return {Promise}
 * @method
 * @protected
 */
export const execute = async (
    width: number = 240,
    height: number = 240,
    fps: number = 60,
    options: IPlayerOptions | null = null
): Promise<Sprite> => {

    // setup
    stage.stageWidth  = width | 0;
    stage.stageHeight = height | 0;
    stage.frameRate   = $clamp(fps, 1, 60, 60);
    if (options && options.bgColor) {
        stage.backgroundColor = options.bgColor;
    }

    // boot player
    playerBootUseCase(options);

    const root = stage.addChild<Sprite>(new Sprite());

    // ready complete
    playerReadyCompleteUseCase();

    // remove loading
    playerRemoveLoadingElementService();

    // append canvas
    playerAppendElementService();

    // set position
    canvasSetPositionService();

    return root;
};