import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { execute as stageExecuteFrameActionsService } from "../../Stage/service/StageExecuteFrameActionsService";
import { execute as displayObjectContainerPrepareActionService } from "../../DisplayObjectContainer/usecase/DisplayObjectContainerPrepareActionUseCase";

/**
 * @description Stageの起動準備完了時のユースーケース
 *              Use case when Stage is ready to start
 * 
 * @param  {DisplayObjectContainer} display_object_container
 * @return {void}
 * @method
 * @protected
 */
export const execute = (display_object_container: DisplayObjectContainer): void =>
{
    // フレームアクションの実行準備
    displayObjectContainerPrepareActionService(display_object_container);

    // フレームアクションを実行
    stageExecuteFrameActionsService();
};