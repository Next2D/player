import { execute as bezierConverterSplitCubicService } from "../service/BezierConverterSplitCubicService";
import { execute as bezierConverterCubicToQuadService } from "../service/BezierConverterCubicToQuadService";
import {
    $adaptiveBuffer,
    $adaptiveSegmentCount,
    $getAdaptiveSubdivisionCount,
    $ensureAdaptiveBufferSize,
    $setAdaptiveSegmentCount
} from "../../BezierConverter";

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
        bezierConverterSplitCubicService(
            from_x, from_y, cx1, cy1, cx2, cy2, x, y,
            0.5, $tempLeft, $tempRight
        );

        bezierConverterCubicToQuadService(
            $tempLeft[0], $tempLeft[1], $tempLeft[2], $tempLeft[3],
            $tempLeft[4], $tempLeft[5], $tempLeft[6], $tempLeft[7],
            $adaptiveBuffer, offset
        );
        offset += 4;

        bezierConverterCubicToQuadService(
            $tempRight[0], $tempRight[1], $tempRight[2], $tempRight[3],
            $tempRight[4], $tempRight[5], $tempRight[6], $tempRight[7],
            $adaptiveBuffer, offset
        );
        offset += 4;
    } else if (subdivisions <= 4) {
        // 4分割: 2段階で分割
        const temp1 = new Float32Array(8);
        const temp2 = new Float32Array(8);

        bezierConverterSplitCubicService(
            from_x, from_y, cx1, cy1, cx2, cy2, x, y,
            0.5, temp1, temp2
        );

        const left1 = new Float32Array(8);
        const left2 = new Float32Array(8);
        const right1 = new Float32Array(8);
        const right2 = new Float32Array(8);

        bezierConverterSplitCubicService(
            temp1[0], temp1[1], temp1[2], temp1[3],
            temp1[4], temp1[5], temp1[6], temp1[7],
            0.5, left1, left2
        );
        bezierConverterSplitCubicService(
            temp2[0], temp2[1], temp2[2], temp2[3],
            temp2[4], temp2[5], temp2[6], temp2[7],
            0.5, right1, right2
        );

        bezierConverterCubicToQuadService(
            left1[0], left1[1], left1[2], left1[3],
            left1[4], left1[5], left1[6], left1[7],
            $adaptiveBuffer, offset
        );
        offset += 4;
        bezierConverterCubicToQuadService(
            left2[0], left2[1], left2[2], left2[3],
            left2[4], left2[5], left2[6], left2[7],
            $adaptiveBuffer, offset
        );
        offset += 4;
        bezierConverterCubicToQuadService(
            right1[0], right1[1], right1[2], right1[3],
            right1[4], right1[5], right1[6], right1[7],
            $adaptiveBuffer, offset
        );
        offset += 4;
        bezierConverterCubicToQuadService(
            right2[0], right2[1], right2[2], right2[3],
            right2[4], right2[5], right2[6], right2[7],
            $adaptiveBuffer, offset
        );
        offset += 4;
    } else {
        // 8分割: 3段階で8分割
        const a1 = new Float32Array(8);
        const a2 = new Float32Array(8);
        bezierConverterSplitCubicService(
            from_x, from_y, cx1, cy1, cx2, cy2, x, y,
            0.5, a1, a2
        );

        // 2段階目
        const b1 = new Float32Array(8);
        const b2 = new Float32Array(8);
        const b3 = new Float32Array(8);
        const b4 = new Float32Array(8);
        bezierConverterSplitCubicService(
            a1[0], a1[1], a1[2], a1[3], a1[4], a1[5], a1[6], a1[7],
            0.5, b1, b2
        );
        bezierConverterSplitCubicService(
            a2[0], a2[1], a2[2], a2[3], a2[4], a2[5], a2[6], a2[7],
            0.5, b3, b4
        );

        // 3段階目
        const c1 = new Float32Array(8);
        const c2 = new Float32Array(8);
        const c3 = new Float32Array(8);
        const c4 = new Float32Array(8);
        const c5 = new Float32Array(8);
        const c6 = new Float32Array(8);
        const c7 = new Float32Array(8);
        const c8 = new Float32Array(8);

        bezierConverterSplitCubicService(
            b1[0], b1[1], b1[2], b1[3], b1[4], b1[5], b1[6], b1[7],
            0.5, c1, c2
        );
        bezierConverterSplitCubicService(
            b2[0], b2[1], b2[2], b2[3], b2[4], b2[5], b2[6], b2[7],
            0.5, c3, c4
        );
        bezierConverterSplitCubicService(
            b3[0], b3[1], b3[2], b3[3], b3[4], b3[5], b3[6], b3[7],
            0.5, c5, c6
        );
        bezierConverterSplitCubicService(
            b4[0], b4[1], b4[2], b4[3], b4[4], b4[5], b4[6], b4[7],
            0.5, c7, c8
        );

        const segments = [c1, c2, c3, c4, c5, c6, c7, c8];
        for (let i = 0; i < 8; i++) {
            const seg = segments[i];
            bezierConverterCubicToQuadService(
                seg[0], seg[1], seg[2], seg[3],
                seg[4], seg[5], seg[6], seg[7],
                $adaptiveBuffer, offset
            );
            offset += 4;
        }
    }

    $setAdaptiveSegmentCount(offset / 4);

    return {
        buffer: $adaptiveBuffer,
        count: $adaptiveSegmentCount
    };
};
