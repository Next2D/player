import type { ITextureObject } from "./interface/ITextureObject";

/**
 * @description 現在のアクティブなテクスチャーの番号
 *              Number of the currently binded active texture
 *
 * @type {number}
 * @protected
 */
export let $activeTextureUnit: number = -1;

/**
 * @description 現在
 * @param {number} unit
 * @return {void}
 * @method
 * @protected
 */
export const $setActiveTextureUnit = (unit: number): void =>
{
    $activeTextureUnit = unit;
};

/**
 * @description 現在bindされてるテクスチャの配列
 *              Array of currently binded textures
 *
 * @type {Array}
 * @protected
 */
export const $boundTextures: Array<ITextureObject | null> = [null, null, null];