import { execute as canvasPointerDownEventUseCase } from "./CanvasPointerDownEventUseCase";
import { execute as canvasPointerUpEventUseCase } from "./CanvasPointerUpEventUseCase";
import { execute as canvasPointerMoveEventUseCase } from "./CanvasPointerMoveEventUseCase";
import {
    $bootAudioContext,
    $getMutedVideos
} from "@next2d/media";
import {
    $POINTER_DOWN,
    $POINTER_UP,
    $POINTER_MOVE
} from "../../Canvas";

/**
 * @description HTMLCanvasElementにイベントを登録します。
 *              Register events on HTMLCanvasElement.
 *
 * @param  {HTMLCanvasElement} canvas
 * @return {void}
 * @method
 * @public
 */
export const execute = (canvas: HTMLCanvasElement): void =>
{
    const $loadAudioContext = (): void =>
    {
        // audio contextを起動
        $bootAudioContext();

        // ミュートになっているビデオの音声をon
        const mutedVideos = $getMutedVideos();
        for (let idx = 0; idx < mutedVideos.length; ++idx) {
            const video = mutedVideos[idx];
            if (!video) {
                continue;
            }

            video.muted = false;
        }
        mutedVideos.length = 0;

        canvas.removeEventListener("pointerup", $loadAudioContext);
    };
    canvas.addEventListener("pointerup", $loadAudioContext);

    canvas.addEventListener($POINTER_DOWN, canvasPointerDownEventUseCase);
    canvas.addEventListener($POINTER_UP, canvasPointerUpEventUseCase);
    canvas.addEventListener($POINTER_MOVE, canvasPointerMoveEventUseCase, { "passive": false });
};