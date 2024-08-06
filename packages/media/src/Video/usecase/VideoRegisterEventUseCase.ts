import type { Video } from "../../Video";
import type { IBounds } from "../../interface/IBounds";
import { execute as videoCanplaythroughEventService } from "../service/VideoCanplaythroughEventService";
import { execute as videoLoadedmetadataEventService } from "../service/VideoLoadedmetadataEventService";
import { execute as videoProgressEventService } from "../service/VideoProgressEventService";
import { execute as videoEndedEventService } from "../service/VideoEndedEventService";

/**
 * @description HTMLVideoElementにイベントを登録する
 *              Register events on HTMLVideoElement
 *
 * @param  {HTMLVideoElement} element
 * @param  {Video} video
 * @param  {object} bounds
 * @return {void}
 * @method
 * @protected
 */
export const execute = (element: HTMLVideoElement, video: Video, bounds: IBounds): void =>
{
    element.addEventListener("loadedmetadata", (): void =>
    {
        videoLoadedmetadataEventService(element, video, bounds);
    }, { "once": true });

    element.addEventListener("progress", (event: ProgressEvent): void =>
    {
        videoProgressEventService(video, event);
    });

    element.addEventListener("canplaythrough", async (): Promise<void> =>
    {
        await videoCanplaythroughEventService(video);
    }, { "once": true });

    element.addEventListener("ended", (): void =>
    {
        videoEndedEventService(video);
    });
};