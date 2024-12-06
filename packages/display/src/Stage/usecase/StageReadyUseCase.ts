import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { execute as stageExecuteFrameActionsService } from "../../Stage/service/StageExecuteFrameActionsService";
import { execute as stageExecuteFrameSoundsService } from "../../Stage/service/StageExecuteFrameSoundsService";
import { execute as displayObjectContainerPrepareUseCase } from "../../DisplayObjectContainer/usecase/DisplayObjectContainerPrepareUseCase";

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
    // 1フレーム目の実行準備
    displayObjectContainerPrepareUseCase(display_object_container);

    // サウンドの実行
    stageExecuteFrameSoundsService();

    // フレームアクションを実行
    stageExecuteFrameActionsService();
};