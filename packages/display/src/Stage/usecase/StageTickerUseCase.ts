import type { Stage } from "../../Stage";
import { execute as displayObjectContainerAdvanceFrameUseCase } from "../../DisplayObjectContainer/usecase/DisplayObjectContainerAdvanceFrameUseCase";

/**
 * @description ステージに配置されたDisplayObjectの定期処理
 *              Regular processing of DisplayObjects placed on the Stage
 * 
 * @param  {Stage} stage
 * @return {void}
 * @method
 * @protected
 */
export const execute = (stage: Stage): void =>
{
    // next frame
    displayObjectContainerAdvanceFrameUseCase(stage);

    // action

    // sound
};