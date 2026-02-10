/**
 * @description グラデーションストップ数に応じた適応的解像度を計算
 *              Calculate adaptive resolution based on number of gradient stops
 *
 * @param  {number} stopsCount - グラデーションストップの数
 * @param  {number} [minResolution=64] - 最小解像度
 * @param  {number} [maxResolution=512] - 最大解像度
 * @return {number}
 * @method
 * @protected
 */
export const execute = (
    stopsCount: number,
    minResolution: number = 64,
    maxResolution: number = 512
): number => {

    // ストップ数に応じて解像度を調整
    // 2ストップ: 64px
    // 3-4ストップ: 128px
    // 5-8ストップ: 256px
    // 9以上: 512px
    if (stopsCount <= 2) {
        return Math.max(minResolution, 64);
    }

    if (stopsCount <= 4) {
        return Math.min(maxResolution, Math.max(minResolution, 128));
    }

    if (stopsCount <= 8) {
        return Math.min(maxResolution, Math.max(minResolution, 256));
    }

    return maxResolution;
};
