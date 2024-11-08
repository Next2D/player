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

    canvas.addEventListener($POINTER_DOWN, (event: PointerEvent): void =>
    {
        // イベントの伝播を止める
        event.preventDefault();
        event.stopPropagation();

        // $setEvent(event);
        // $setEventType($POINTER_DOWN);

        // // start position
        // this._$hitTest();
    });

    canvas.addEventListener($POINTER_UP, (event: PointerEvent): void =>
    {
        // イベントの伝播を止める
        event.preventDefault();
        event.stopPropagation();

        const element: HTMLElement = event.target as HTMLElement;
        if (!element) {
            return ;
        }

        element.releasePointerCapture(event.pointerId);
        // $setEvent(event);
        // $setEventType($POINTER_UP);
        // this._$hitTest();
    });

    canvas.addEventListener($POINTER_MOVE, (event: PointerEvent) =>
    {
        // イベントの伝播を止める
        event.preventDefault();
        event.stopPropagation();

        const element: HTMLElement = event.target as HTMLElement;
        if (!element) {
            return ;
        }

        element.setPointerCapture(event.pointerId);
        // $setEvent(event);
        // $setEventType($POINTER_MOVE);

        // this._$hitTest();
    }, { "passive": false });
};