import type { Video } from "../../Video";
import { ProgressEvent as Next2DProgressEvent } from "@next2d/events";

/**
 * @description ビデオ読み込み中の進捗状態の確認イベント処理関数
 *              Event processing function to check the progress status of video loading
 *
 * @param  {Video} video
 * @return {void}
 * @method
 * @protected
 */
export const execute = (video: Video, event: ProgressEvent): void =>
{
    if (video.willTrigger(Next2DProgressEvent.PROGRESS)) {
        video.dispatchEvent(new Next2DProgressEvent(
            Next2DProgressEvent.PROGRESS, false,
            event.loaded, event.total
        ));
    }
};