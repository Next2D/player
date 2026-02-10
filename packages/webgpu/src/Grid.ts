/**
 * @description グリッドデータマップ（9-slice用）
 *              Grid data map for 9-slice transformation
 * @type {Map<number, Float32Array | null>}
 */
export const $gridDataMap: Map<number, Float32Array | null> = new Map();

/**
 * @description 現在のフィルバッファインデックス
 *              Current fill buffer index
 * @type {number}
 */
export let $fillBufferIndex: number = 0;

/**
 * @description グリッド情報を初期化
 *              Initialize grid information
 * @return {void}
 */
export const $terminateGrid = (): void => {
    $gridDataMap.clear();
    $fillBufferIndex = 0;
};
