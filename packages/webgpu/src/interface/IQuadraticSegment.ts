import type { IPoint } from "./IPoint";

/**
 * @description 二次ベジェ近似のセグメント
 *              Quadratic bezier segment approximation
 */
export interface IQuadraticSegment {
    /**
     * @description 制御点
     *              Control point
     */
    ctrl: IPoint;
    /**
     * @description 終点
     *              End point
     */
    end: IPoint;
}
