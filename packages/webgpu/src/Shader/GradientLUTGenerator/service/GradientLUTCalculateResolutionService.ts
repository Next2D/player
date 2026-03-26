/**
 * @description グラデーションストップ数に応じた適応的解像度を計算
 *              Calculate adaptive resolution based on number of gradient stops
 *
 * @param  {number} stops_count - グラデーションストップの数
 * @param  {number} [min_resolution=64] - 最小解像度
 * @param  {number} [max_resolution=512] - 最大解像度
 * @return {number}
 * @method
 * @protected
 */
export const execute = (
    stops_count: number,
    min_resolution: number = 64,
    max_resolution: number = 512
): number => {

    // ストップ数に応じて解像度を調整
    // 2ストップ: 64px
    // 3-4ストップ: 128px
    // 5-8ストップ: 256px
    // 9以上: 512px
    if (stops_count <= 2) {
        return Math.max(min_resolution, 64);
    }

    if (stops_count <= 4) {
        return Math.min(max_resolution, Math.max(min_resolution, 128));
    }

    if (stops_count <= 8) {
        return Math.min(max_resolution, Math.max(min_resolution, 256));
    }

    return max_resolution;
};
