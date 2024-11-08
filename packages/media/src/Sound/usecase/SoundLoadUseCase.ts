import type { URLRequest } from "@next2d/net";
import type { Sound } from "../../Sound";
import { execute as soundLoadStartEventService } from "../service/SoundLoadStartEventService";
import { execute as soundProgressEventService } from "../service/SoundProgressEventService";
import { execute as soundLoadEndEventUseCase } from "../usecase/SoundLoadEndEventUseCase";
import { $ajax } from "../../MediaUtil";

/**
 * @description 外部サウンドの読み込みを実行
 *              Execute sound loading
 *
 * @param {Sound} sound
 * @param {URLRequest} request
 * @return {Promise}
 * @method
 * @protected
 */
export const execute = async (sound: Sound, request: URLRequest): Promise<void> =>
{
    await new Promise<void>((resolve): void =>
    {
        $ajax({
            "format": "arraybuffer",
            "url": request.url,
            "method": request.method,
            "data": request.data,
            "headers": request.headers,
            "withCredentials": request.withCredentials,
            "event": {
                "loadstart": (event: ProgressEvent): void =>
                {
                    soundLoadStartEventService(sound, event);
                },
                "progress": (event: ProgressEvent): void =>
                {
                    soundProgressEventService(sound, event);
                },
                "loadend": async (event: ProgressEvent): Promise<void> =>
                {
                    await soundLoadEndEventUseCase(sound, event);
                    resolve();
                }
            }
        });
    });
};