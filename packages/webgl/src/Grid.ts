/**
 * @type {Map}
 * @private
 */
export const $gridDataMap: Map<number, Float32Array | null> = new Map();

/**
 * @description グリッド情報を初期化
 *              Initialize grid information
 *
 * @return {void}
 * @method
 * @protected
 */
export const $terminateGrid = (): void =>
{
    $gridDataMap.clear();
};