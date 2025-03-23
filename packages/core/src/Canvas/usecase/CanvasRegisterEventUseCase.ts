import { execute as canvasPointerDownEventUseCase } from "./CanvasPointerDownEventUseCase";
import { execute as canvasPointerUpEventUseCase } from "./CanvasPointerUpEventUseCase";
import { execute as canvasPointerMoveEventUseCase } from "./CanvasPointerMoveEventUseCase";
import { execute as canvasPointerLeaveEventUseCase } from "./CanvasPointerLeaveEventUseCase";
import { execute as canvasWheelEventUseCase } from "./CanvasWheelEventUseCase";
import {
    PointerEvent,
    WheelEvent
} from "@next2d/events";
import {
    $bootAudioContext,
    $getMutedVideos
} from "@next2d/media";

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

        canvas.removeEventListener(PointerEvent.POINTER_UP, $loadAudioContext as EventListener);
    };
    canvas.addEventListener(PointerEvent.POINTER_UP, $loadAudioContext as EventListener);

    canvas.addEventListener(PointerEvent.POINTER_DOWN, canvasPointerDownEventUseCase as EventListener, { "passive": false });
    canvas.addEventListener(PointerEvent.POINTER_UP, canvasPointerUpEventUseCase as EventListener);
    canvas.addEventListener(PointerEvent.POINTER_MOVE, canvasPointerMoveEventUseCase as EventListener, { "passive": false });
    canvas.addEventListener(PointerEvent.POINTER_LEAVE, canvasPointerLeaveEventUseCase as EventListener);
    canvas.addEventListener(WheelEvent.WHEEL, canvasWheelEventUseCase as EventListener);
};