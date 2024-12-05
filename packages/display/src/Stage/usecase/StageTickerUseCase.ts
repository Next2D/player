import { stage } from "../../Stage";
import { execute as displayObjectContainerAdvanceFrameUseCase } from "../../DisplayObjectContainer/usecase/DisplayObjectContainerAdvanceFrameUseCase";
import { execute as stageExecuteFrameActionsService } from "../service/StageExecuteFrameActionsService";

/**
 * @description ステージに配置されたDisplayObjectの定期処理
 *              Regular processing of DisplayObjects placed on the Stage
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    // next frame
    displayObjectContainerAdvanceFrameUseCase(stage);

    // action
    stageExecuteFrameActionsService();
};