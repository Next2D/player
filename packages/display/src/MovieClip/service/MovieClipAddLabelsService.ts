import type { IMovieClipLabelObject } from "../../interface/IMovieClipLabelObject";
import { FrameLabel } from "../../FrameLabel";

/**
 * @description ラベル情報をマップに追加
 *              Add label information to map
 *
 * @param  {Map} label_map
 * @param  {array} labels
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    label_map: Map<number, FrameLabel>,
    labels: IMovieClipLabelObject[]
): void => {

    for (let idx: number = 0; idx < labels.length; ++idx) {
        const label = labels[idx];
        if (!label) {
            continue;
        }

        label_map.set(label.frame, new FrameLabel(label.name, label.frame));
    }
};