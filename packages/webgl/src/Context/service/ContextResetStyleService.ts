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
    // todo type reset
    switch (context.$fillType) {

        case 0:
            context.$fillStyle.fill(1);
            break;

        case 1:
            // todo gradient
            break;

        case 2:
            // todo bitmap
            break;

        default:
            break;

    }

    switch (context.$strokeType) {

        case 0:
            context.$strokeStyle.fill(1);
            break;

        case 1:
            // todo gradient
            break;

        case 2:
            // todo bitmap
            break;

        default:
            break;

    }

    // reset
    context.$fillType   = -1;
    context.$strokeType = -1;
};