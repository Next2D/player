import {
    $adaptiveBuffer,
    $adaptiveSegmentCount,
    $getAdaptiveSubdivisionCount,
    $ensureAdaptiveBufferSize,
    $setAdaptiveSegmentCount
} from "../../BezierConverter";

/**
 * @description De Casteljauアルゴリズムで3次ベジエを分割
 *              Split cubic Bezier using De Casteljau algorithm
 *
 * @param  {number} p0x
 * @param  {number} p0y
 * @param  {number} p1x
 * @param  {number} p1y
 * @param  {number} p2x
 * @param  {number} p2y
 * @param  {number} p3x
 * @param  {number} p3y
 * @param  {number} t
 * @param  {Float32Array} left
 * @param  {Float32Array} right
 * @return {void}
 * @method
 * @private
 */
const splitCubicAt = (
    p0x: number, p0y: number,
    p1x: number, p1y: number,
    p2x: number, p2y: number,
    p3x: number, p3y: number,
    t: number,
    left: Float32Array,
    right: Float32Array
): void => {
    const mt = 1 - t;

    // レベル1
    const q0x = mt * p0x + t * p1x;
    const q0y = mt * p0y + t * p1y;
    const q1x = mt * p1x + t * p2x;
    const q1y = mt * p1y + t * p2y;
    const q2x = mt * p2x + t * p3x;
    const q2y = mt * p2y + t * p3y;

    // レベル2
    const r0x = mt * q0x + t * q1x;
    const r0y = mt * q0y + t * q1y;
    const r1x = mt * q1x + t * q2x;
    const r1y = mt * q1y + t * q2y;

    // レベル3（分割点）
    const sx = mt * r0x + t * r1x;
    const sy = mt * r0y + t * r1y;

    // 左側のカーブ
    left[0] = p0x; left[1] = p0y;
    left[2] = q0x; left[3] = q0y;
    left[4] = r0x; left[5] = r0y;
    left[6] = sx;  left[7] = sy;

    // 右側のカーブ
    right[0] = sx;  right[1] = sy;
    right[2] = r1x; right[3] = r1y;
    right[4] = q2x; right[5] = q2y;
    right[6] = p3x; right[7] = p3y;
};

/**
 * @description 3次ベジエを2次ベジエに近似
 *              Approximate cubic Bezier as quadratic Bezier
 *
 * @param  {number} p1x
 * @param  {number} p1y
 * @param  {number} p2x
 * @param  {number} p2y
 * @param  {number} p3x
 * @param  {number} p3y
 * @param  {Float32Array} buffer
 * @param  {number} offset
 * @return {void}
 * @method
 * @private
 */
const cubicToQuad = (
    p1x: number, p1y: number,
    p2x: number, p2y: number,
    p3x: number, p3y: number,
    buffer: Float32Array,
    offset: number
): void => {
    // 3次ベジエの制御点から2次ベジエの制御点を近似
    // Q_control = (3*C1 - P0 + 3*C2 - P1) / 4
    // ただし、分割後は単純に中点を使用
    const cx = (p1x + p2x) * 0.5;
    const cy = (p1y + p2y) * 0.5;

    buffer[offset] = cx;
    buffer[offset + 1] = cy;
    buffer[offset + 2] = p3x;
    buffer[offset + 3] = p3y;
};

// 一時バッファ（分割用）
const $tempLeft: Float32Array = new Float32Array(8);
const $tempRight: Float32Array = new Float32Array(8);

/**
 * @description 3次ベジェ曲線を適応的に2次ベジェ曲線に分割
 *              Adaptively split cubic Bezier curve into quadratic Bezier curves
 *
 * @param  {number} from_x
 * @param  {number} from_y
 * @param  {number} cx1
 * @param  {number} cy1
 * @param  {number} cx2
 * @param  {number} cy2
 * @param  {number} x
 * @param  {number} y
 * @return {{ buffer: Float32Array, count: number }}
 * @method
 * @protected
 */
export const execute = (
    from_x: number, from_y: number,
    cx1: number, cy1: number,
    cx2: number, cy2: number,
    x: number, y: number
): { buffer: Float32Array; count: number } => {

    // 曲率に基づいて分割数を決定
    const subdivisions = $getAdaptiveSubdivisionCount(
        from_x, from_y, cx1, cy1, cx2, cy2, x, y
    );

    // 各2次ベジエは4floats（cx, cy, x, y）
    const requiredSize = subdivisions * 4;
    $ensureAdaptiveBufferSize(requiredSize);

    // 分割数に応じてセグメントを生成
    let offset = 0;

    if (subdivisions <= 2) {
        // 2分割: t=0.5で分割
        splitCubicAt(from_x, from_y, cx1, cy1, cx2, cy2, x, y, 0.5, $tempLeft, $tempRight);

        cubicToQuad(
            $tempLeft[2], $tempLeft[3], $tempLeft[4], $tempLeft[5], $tempLeft[6], $tempLeft[7],
            $adaptiveBuffer, offset
        );
        offset += 4;

        cubicToQuad(
            $tempRight[2], $tempRight[3], $tempRight[4], $tempRight[5], $tempRight[6], $tempRight[7],
            $adaptiveBuffer, offset
        );
        offset += 4;
    } else if (subdivisions <= 4) {
        // 4分割: t=0.25, 0.5, 0.75で分割
        const curves: Float32Array[] = [];
        curves.push(new Float32Array([from_x, from_y, cx1, cy1, cx2, cy2, x, y]));

        // 2段階で4分割
        const temp1 = new Float32Array(8);
        const temp2 = new Float32Array(8);

        splitCubicAt(from_x, from_y, cx1, cy1, cx2, cy2, x, y, 0.5, temp1, temp2);

        const left1 = new Float32Array(8);
        const left2 = new Float32Array(8);
        const right1 = new Float32Array(8);
        const right2 = new Float32Array(8);

        splitCubicAt(temp1[0], temp1[1], temp1[2], temp1[3], temp1[4], temp1[5], temp1[6], temp1[7], 0.5, left1, left2);
        splitCubicAt(temp2[0], temp2[1], temp2[2], temp2[3], temp2[4], temp2[5], temp2[6], temp2[7], 0.5, right1, right2);

        cubicToQuad(left1[2], left1[3], left1[4], left1[5], left1[6], left1[7], $adaptiveBuffer, offset);
        offset += 4;
        cubicToQuad(left2[2], left2[3], left2[4], left2[5], left2[6], left2[7], $adaptiveBuffer, offset);
        offset += 4;
        cubicToQuad(right1[2], right1[3], right1[4], right1[5], right1[6], right1[7], $adaptiveBuffer, offset);
        offset += 4;
        cubicToQuad(right2[2], right2[3], right2[4], right2[5], right2[6], right2[7], $adaptiveBuffer, offset);
        offset += 4;
    } else {
        // 8分割: 3段階で8分割（既存の方法と同等）
        // 最初の分割
        const a1 = new Float32Array(8);
        const a2 = new Float32Array(8);
        splitCubicAt(from_x, from_y, cx1, cy1, cx2, cy2, x, y, 0.5, a1, a2);

        // 2段階目
        const b1 = new Float32Array(8);
        const b2 = new Float32Array(8);
        const b3 = new Float32Array(8);
        const b4 = new Float32Array(8);
        splitCubicAt(a1[0], a1[1], a1[2], a1[3], a1[4], a1[5], a1[6], a1[7], 0.5, b1, b2);
        splitCubicAt(a2[0], a2[1], a2[2], a2[3], a2[4], a2[5], a2[6], a2[7], 0.5, b3, b4);

        // 3段階目
        const c1 = new Float32Array(8);
        const c2 = new Float32Array(8);
        const c3 = new Float32Array(8);
        const c4 = new Float32Array(8);
        const c5 = new Float32Array(8);
        const c6 = new Float32Array(8);
        const c7 = new Float32Array(8);
        const c8 = new Float32Array(8);

        splitCubicAt(b1[0], b1[1], b1[2], b1[3], b1[4], b1[5], b1[6], b1[7], 0.5, c1, c2);
        splitCubicAt(b2[0], b2[1], b2[2], b2[3], b2[4], b2[5], b2[6], b2[7], 0.5, c3, c4);
        splitCubicAt(b3[0], b3[1], b3[2], b3[3], b3[4], b3[5], b3[6], b3[7], 0.5, c5, c6);
        splitCubicAt(b4[0], b4[1], b4[2], b4[3], b4[4], b4[5], b4[6], b4[7], 0.5, c7, c8);

        const segments = [c1, c2, c3, c4, c5, c6, c7, c8];
        for (let i = 0; i < 8; i++) {
            const seg = segments[i];
            cubicToQuad(seg[2], seg[3], seg[4], seg[5], seg[6], seg[7], $adaptiveBuffer, offset);
            offset += 4;
        }
    }

    $setAdaptiveSegmentCount(offset / 4);

    return {
        buffer: $adaptiveBuffer,
        count: $adaptiveSegmentCount
    };
};
