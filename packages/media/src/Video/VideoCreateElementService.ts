import type { BoundsImpl } from "../interface/BoundsImpl";
import type { Video } from "../Video";
import { execute as videoCanplaythroughEventService } from "./VideoCanplaythroughEventService";
import { execute as videoLoadedmetadataEventService } from "./VideoLoadedmetadataEventService";
import { execute as videoProgressEventService } from "./VideoProgressEventService";
import { execute as videoEndedEventService } from "./VideoEndedEventService";

/**
 * @description HTMLVideoElementを作成して、各種イベントを設定する
 *              Create an HTMLVideoElement and set various events
 *
 * @param  {Video} video
 * @return {HTMLVideoElement}
 * @method
 * @protected
 */
export const execute = (video: Video, bounds: BoundsImpl): HTMLVideoElement =>
{
    const element = document.createElement("video");
    element.autoplay    = false;
    element.crossOrigin = "anonymous";

    // Required for iOS
    element.setAttribute("playsinline", "");

    element.addEventListener("loadedmetadata", (): void =>
    {
        videoLoadedmetadataEventService(video, element, bounds);
    }, { "once": true });

    element.addEventListener("progress", (event: ProgressEvent): void =>
    {
        videoProgressEventService(video, event);
    });

    element.addEventListener("canplaythrough", async (): Promise<void> =>
    {
        await videoCanplaythroughEventService(video, element);
    }, { "once": true });

    element.addEventListener("ended", (): void =>
    {
        videoEndedEventService(video);
    });

    return element;
};