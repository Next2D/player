import { execute as playerResizeEventUseCase } from "./PlayerResizeEventUseCase";

/**
 * @type {number}
 * @private
 */
let timerId: number = -1;

/**
 * @description 画面リサイズのイベントを登録
 *              Register screen resize event
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    window.addEventListener("resize", (): void =>
    {
        cancelAnimationFrame(timerId);
        timerId = requestAnimationFrame(playerResizeEventUseCase);
    });
};