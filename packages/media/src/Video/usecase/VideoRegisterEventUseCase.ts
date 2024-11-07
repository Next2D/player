import type { Video } from "../../Video";
import { execute as videoCanplaythroughEventUseCase } from "./VideoCanplaythroughEventUseCase";
import { execute as videoLoadedmetadataEventService } from "../service/VideoLoadedmetadataEventService";
import { execute as videoProgressEventService } from "../service/VideoProgressEventService";
import { execute as videoEndedEventService } from "../service/VideoEndedEventService";

/**
 * @description HTMLVideoElementにイベントを登録する
 *              Register events on HTMLVideoElement
 *
 * @param  {HTMLVideoElement} element
 * @param  {Video} video
 * @return {void}
 * @method
 * @protected
 */
export const execute = (element: HTMLVideoElement, video: Video): void =>
{
    element.addEventListener("loadedmetadata", (): void =>
    {
        videoLoadedmetadataEventService(element, video);
    }, { "once": true });

    element.addEventListener("progress", (event: ProgressEvent): void =>
    {
        videoProgressEventService(video, event);
    });

    element.addEventListener("canplaythrough", async (): Promise<void> =>
    {
        await videoCanplaythroughEventUseCase(video);
        element.volume = video.volume;
    }, { "once": true });

    element.addEventListener("ended", (): void =>
    {
        videoEndedEventService(video);
    });
};