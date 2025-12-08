/**
 * @description ベジェ曲線の変換後の値を格納するバッファ
 *              Buffer to store the converted values of the Bezier curve
 *
 * @type {Float32Array}
 * @public
 */
export const $bezierBuffer: Float32Array = new Float32Array(32);

/**
 * @description 適応的テッセレーション用の動的バッファ
 *              Dynamic buffer for adaptive tessellation
 *
 * @type {Float32Array}
 * @public
 */
export let $adaptiveBuffer: Float32Array = new Float32Array(64);

/**
 * @description 適応的テッセレーションの結果のセグメント数
 *              Number of segments from adaptive tessellation
 *
 * @type {number}
 * @public
 */
export let $adaptiveSegmentCount: number = 0;

/**
 * @description 適応的テッセレーションのフラットネス閾値
 *              Flatness threshold for adaptive tessellation
 *
 * @type {number}
 * @const
 */
const FLATNESS_THRESHOLD: number = 0.5;

/**
 * @description 最小分割数
 *              Minimum subdivision count
 *
 * @type {number}
 * @const
 */
const MIN_SUBDIVISIONS: number = 2;

/**
 * @description 最大分割数
 *              Maximum subdivision count
 *
 * @type {number}
 * @const
 */
const MAX_SUBDIVISIONS: number = 8;

/**
 * @description 3次ベジエ曲線のフラットネス（平坦度）を計算
 *              Calculate flatness of a cubic Bezier curve
 *
 * @param  {number} p0x
 * @param  {number} p0y
 * @param  {number} p1x
 * @param  {number} p1y
 * @param  {number} p2x
 * @param  {number} p2y
 * @param  {number} p3x
 * @param  {number} p3y
 * @return {number}
 * @method
 * @protected
 */
export const $calculateFlatness = (
    p0x: number, p0y: number,
    p1x: number, p1y: number,
    p2x: number, p2y: number,
    p3x: number, p3y: number
): number => {
    // 制御点から直線への最大距離を計算
    // Calculate maximum distance from control points to the line P0-P3
    const ux = 3 * p1x - 2 * p0x - p3x;
    const uy = 3 * p1y - 2 * p0y - p3y;
    const vx = 3 * p2x - 2 * p3x - p0x;
    const vy = 3 * p2y - 2 * p3y - p0y;

    return Math.max(ux * ux + uy * uy, vx * vx + vy * vy);
};

/**
 * @description 曲率に基づいて最適な分割数を決定
 *              Determine optimal subdivision count based on curvature
 *
 * @param  {number} p0x
 * @param  {number} p0y
 * @param  {number} p1x
 * @param  {number} p1y
 * @param  {number} p2x
 * @param  {number} p2y
 * @param  {number} p3x
 * @param  {number} p3y
 * @return {number}
 * @method
 * @protected
 */
export const $getAdaptiveSubdivisionCount = (
    p0x: number, p0y: number,
    p1x: number, p1y: number,
    p2x: number, p2y: number,
    p3x: number, p3y: number
): number => {
    const flatness = $calculateFlatness(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);

    // フラットネスに基づいて分割数を決定
    // log2(flatness / threshold) で必要な分割レベルを推定
    if (flatness < FLATNESS_THRESHOLD * FLATNESS_THRESHOLD) {
        return MIN_SUBDIVISIONS;
    }

    const level = Math.ceil(Math.log2(Math.sqrt(flatness) / FLATNESS_THRESHOLD) / 2);
    return Math.min(Math.max(level + MIN_SUBDIVISIONS, MIN_SUBDIVISIONS), MAX_SUBDIVISIONS);
};

/**
 * @description 適応的バッファのサイズを確保
 *              Ensure adaptive buffer size
 *
 * @param  {number} size
 * @return {void}
 * @method
 * @protected
 */
export const $ensureAdaptiveBufferSize = (size: number): void => {
    if ($adaptiveBuffer.length < size) {
        $adaptiveBuffer = new Float32Array(size * 2);
    }
};

/**
 * @description 適応的セグメント数を設定
 *              Set adaptive segment count
 *
 * @param  {number} count
 * @return {void}
 * @method
 * @protected
 */
export const $setAdaptiveSegmentCount = (count: number): void => {
    $adaptiveSegmentCount = count;
};
