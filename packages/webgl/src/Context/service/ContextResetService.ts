import type { Context } from "../../Context";

/**
 * @description コンテキストの値を初期化する
 *              Initialize the values of the context
 *
 * @param  {Context} context
 * @return {void}
 * @method
 * @protected
 */
export const execute = (context: Context): void =>
{
    context.globalAlpha = 1;
    context.globalCompositeOperation = "normal";
    context.imageSmoothingEnabled = false;
};