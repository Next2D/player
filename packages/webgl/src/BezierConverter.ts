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
 * @description 3次ベジェ曲線を2次ベジェ曲線で近似するときの、画面上の誤差の許容値 (ピクセル)
 *              Allowed on-screen error in pixels when approximating a cubic Bezier curve with quadratic ones
 *
 * @type {number}
 * @const
 */
const CUBIC_TOLERANCE: number = 0.05;

/**
 * @description 3次ベジェ曲線が 1 本の2次ベジェ曲線で足りるかどうかを、平方根を取らずに判定するための上限。
 *              |P3 - 3 * P2 + 3 * P1 - P0|² * scale² がこの値以下なら 1 本で足りる。
 *              (CUBIC_TOLERANCE / (√3 / 36))² = (0.05 * 36 / √3)² = 1.08
 *              Limit for deciding without square roots whether one quadratic curve is enough:
 *              one is enough when |P3 - 3 * P2 + 3 * P1 - P0|² * scale² is at most this value.
 *
 * @type {number}
 * @const
 */
export const $CUBIC_SINGLE_SEGMENT_LIMIT: number = 1.08;

/**
 * @description 3次ベジェ曲線を何本の2次ベジェ曲線で近似するかを、画面上の誤差から求める。
 *
 *              3次ベジェ曲線を 1 本の2次ベジェ曲線 (制御点 = (3 * P1 + 3 * P2 - P0 - P3) / 4) で近似した
 *              ときの誤差の上限は √3 / 36 * |P3 - 3 * P2 + 3 * P1 - P0|。曲線を n 等分してから近似すると、
 *              誤差は 1 / n³ になる。画面上の誤差が CUBIC_TOLERANCE 以内になる最小の n を返す
 *              (1 以上 MAX_SUBDIVISIONS 以下)。
 *
 *              制御点と弦の離れ具合 ($calculateFlatness) は「直線からどれだけ離れているか」であって、
 *              2次曲線で近似したときの誤差とは対応しない。大きく曲がっていても2次曲線に近い曲線は
 *              1 本で足り、小さな図形 (文字や数字の輪郭など) の曲線の多くがこれに当たる。
 *
 *              Returns how many quadratic Bezier curves are needed to approximate a cubic one, from the
 *              on-screen error. Approximating a cubic with a single quadratic (control point
 *              (3 * P1 + 3 * P2 - P0 - P3) / 4) has an error of at most √3 / 36 * |P3 - 3 * P2 + 3 * P1 - P0|,
 *              and splitting the curve into n equal parts first divides the error by n³. The smallest n
 *              keeping the on-screen error within CUBIC_TOLERANCE is returned (1 to MAX_SUBDIVISIONS).
 *
 * @param  {number} p0x
 * @param  {number} p0y
 * @param  {number} p1x
 * @param  {number} p1y
 * @param  {number} p2x
 * @param  {number} p2y
 * @param  {number} p3x
 * @param  {number} p3y
 * @param  {number} pixel_scale 曲線の座標 1 単位が画面上で何ピクセルになるか
 *                              On-screen pixels per unit of the curve's coordinates
 * @return {number}
 * @method
 * @protected
 */
export const $getCubicSegmentCount = (
    p0x: number, p0y: number,
    p1x: number, p1y: number,
    p2x: number, p2y: number,
    p3x: number, p3y: number,
    pixel_scale: number
): number => {

    const dx = p3x - 3 * p2x + 3 * p1x - p0x;
    const dy = p3y - 3 * p2y + 3 * p1y - p0y;

    // √3 / 36 = 0.048112522432468816
    const error = 0.048112522432468816 * Math.sqrt(dx * dx + dy * dy) * pixel_scale;

    let count = 1;
    while (count < MAX_SUBDIVISIONS && error > CUBIC_TOLERANCE * count * count * count) {
        ++count;
    }
    return count;
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

/**
 * @description 分割処理用の再利用可能なFloat32Array(8)バッファプール
 *              Reusable Float32Array(8) buffer pool for split operations
 *
 * @type {Float32Array[]}
 * @private
 */
const $splitBufferPool: Float32Array[] = [];

/**
 * @description プールの現在の使用インデックス
 *              Current usage index of the pool
 *
 * @type {number}
 * @private
 */
let $splitBufferIndex: number = 0;

/**
 * @description 分割用バッファプールをリセット
 *              Reset split buffer pool
 *
 * @return {void}
 * @method
 * @protected
 */
export const $resetSplitBufferPool = (): void => {
    $splitBufferIndex = 0;
};

/**
 * @description 分割用Float32Array(8)を取得（プールから再利用）
 *              Get Float32Array(8) for split (reuse from pool)
 *
 * @return {Float32Array}
 * @method
 * @protected
 */
export const $getSplitBuffer = (): Float32Array => {
    if ($splitBufferIndex >= $splitBufferPool.length) {
        $splitBufferPool.push(new Float32Array(8));
    }
    return $splitBufferPool[$splitBufferIndex++];
};