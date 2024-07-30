import { $PREFIX } from "../CoreUtil";

/**
 * @description ローディングアニメーションを登録
 *              Register loading animation
 *
 * @param {HTMLDivElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLDivElement): void =>
{
    const loadingId: string = `${$PREFIX}_loading`;

    element.innerHTML = `<style>
#${loadingId} {
    width: 50px;
    height: 50px;
    border-radius: 50px;
    border: 8px solid #dcdcdc;
    border-right-color: transparent;
    box-sizing: border-box;
    animation: ${loadingId} 0.8s infinite linear;
}
@keyframes ${loadingId} {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
<div id="${loadingId}"></div>`;

};