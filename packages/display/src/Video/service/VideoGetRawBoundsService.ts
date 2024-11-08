import type { Video } from "@next2d/media";
import { $getArray } from "../../DisplayObjectUtil";

/**
 * @description Videoのローカルバウンディングボックスを取得します。
 *              Get the local bounding box of the Video.
 *
 * @param  {Video} video
 * @return {number[]}
 * @method
 * @protected
 */
export const execute = (video: Video): number[] =>
{
    return $getArray(0, 0, video.videoWidth, video.videoHeight);
};