import { stage } from "../../Stage";
import { execute as displayObjectContainerAdvanceFrameUseCase } from "../../DisplayObjectContainer/usecase/DisplayObjectContainerAdvanceFrameUseCase";
import { execute as stageExecuteFrameActionsService } from "../service/StageExecuteFrameActionsService";
import { execute as stageExecuteFrameSoundsService } from "../service/StageExecuteFrameSoundsService";

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
    // フレーム移動処理
    displayObjectContainerAdvanceFrameUseCase(stage);

    // 各フレームのサウンドを再生
    stageExecuteFrameSoundsService();

    // 各フレームのアクションを実行
    stageExecuteFrameActionsService();
};