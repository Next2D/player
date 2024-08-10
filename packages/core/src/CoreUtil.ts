/**
 * @type {string}
 * @const
 */
export const $PREFIX: string = "__next2d__";

/**
 * @type {number}
 * @const
 */
export const $devicePixelRatio: number = window.devicePixelRatio;

/**
 * @param  {number} value
 * @param  {number} min
 * @param  {number} max
 * @param  {number} [default_value=null]
 * @return {number}
 * @method
 * @static
 */
export const $clamp = (
    value: number,
    min: number,
    max: number,
    default_value: number | null = null
): number => {

    const number: number = +value;

    return isNaN(number) && default_value !== null
        ? default_value
        : Math.min(Math.max(min, isNaN(number) ? 0 : number), max);
};

const canvas = document.createElement("canvas");
canvas.width = canvas.height = 1;

/**
 * @type {CanvasRenderingContext2D}
 * @const
 */
export const $hitContext: CanvasRenderingContext2D = canvas.getContext("2d") as NonNullable<CanvasRenderingContext2D>;