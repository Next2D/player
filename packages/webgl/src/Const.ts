/**
 * @type {number}
 * @public
 */
export let $RENDER_SIZE: number = 2048;

/**
 * @param  {number} size
 * @return {void}
 * @method
 * @public
 */
export const $setRenderSize = (size: number): void =>
{
    $RENDER_SIZE = Math.min(4096, size / 2);
};