import type { IPoint } from "./IPoint";

/**
 * @description 二次ベジェ近似のセグメント
 *              Quadratic bezier segment approximation
 */
export interface IQuadraticSegment {
    ctrl: IPoint;
    end: IPoint;
}
