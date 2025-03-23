import type { Context } from "../../Context";

/**
 * @description コンテキストのカラースタイル設定を初期化する
 *              Initialize the color style settings of the context
 *
 * @param  {Context} context
 * @return {void}
 * @method
 * @protected
 */
export const execute = (context: Context): void =>
{
    context.$fillStyle.fill(1);
    context.$strokeStyle.fill(1);
};