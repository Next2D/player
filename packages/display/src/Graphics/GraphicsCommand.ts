/**
 * @description Graphics の描画命令の種類。Graphics.MOVE_TO などの static getter と同じ値。
 *              経路の点ごとに通る処理では、getter の呼び出しを避けてこの定数を直接参照する。
 *              Kinds of Graphics drawing commands. Same values as the static getters such as
 *              Graphics.MOVE_TO. Code that runs per path point reads these constants directly
 *              instead of calling the getters.
 */
export const $MOVE_TO: number = 0;
export const $CURVE_TO: number = 1;
export const $LINE_TO: number = 2;
export const $CUBIC: number = 3;
export const $ARC: number = 4;
export const $FILL_STYLE: number = 5;
export const $STROKE_STYLE: number = 6;
export const $END_FILL: number = 7;
export const $END_STROKE: number = 8;
export const $BEGIN_PATH: number = 9;
export const $GRADIENT_FILL: number = 10;
export const $GRADIENT_STROKE: number = 11;
export const $CLOSE_PATH: number = 12;
export const $BITMAP_FILL: number = 13;
export const $BITMAP_STROKE: number = 14;
