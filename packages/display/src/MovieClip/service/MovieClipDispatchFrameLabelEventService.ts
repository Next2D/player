import type { MovieClip } from "../../MovieClip";
import type { FrameLabel } from "../../FrameLabel";
import { Event } from "@next2d/events";

/**
 * @description MovieClipのフレームラベルイベントを実行
 *              Execute the frame label event of MovieClip
 * 
 * @param  {MovieClip} movie_clip
 * @param  {Map} labels
 * @return {void}
 * @method
 * @protected
 */
export const execute = (movie_clip: MovieClip, labels: Map<number, FrameLabel> | null = null): void =>
{
    if (!labels || !labels.size) {
        return ;
    }

    const frame = movie_clip.currentFrame;
    if (!labels.has(frame)) {
        return ;
    }

    const frameLabel = labels.get(frame) as FrameLabel;
    if (!frameLabel) {
        return ;
    }

    if (frameLabel.willTrigger(Event.FRAME_LABEL)) {
        frameLabel.dispatchEvent(new Event(Event.FRAME_LABEL));
    }
};