
import { $stage } from "@next2d/display";

/**
 * @type {array}
 * @private
 */
const $renderQueue: number[] = [];

export const execute = (): void =>
{
    $renderQueue.length = 0;

    $stage._$generateRenderQueue($renderQueue, matrix);
};