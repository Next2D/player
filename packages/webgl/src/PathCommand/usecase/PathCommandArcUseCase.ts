import { execute as pathCommandBezierCurveToUseCase } from "./PathCommandBezierCurveToUseCase";

/**
 * @description 円弧を描画します。
 *              Draw an arc.
 * 
 * @param  {number} x 
 * @param  {number} y 
 * @param  {number} radius 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (x: number, y: number, radius: number): void =>
{
    const r: number = radius;
    const k: number = radius * 0.5522847498307936;
    
    pathCommandBezierCurveToUseCase(
        x + r, y + k, x + k, y + r, x, y + r
    );
    pathCommandBezierCurveToUseCase(
        x - k, y + r, x - r, y + k, x - r, y
    );
    pathCommandBezierCurveToUseCase(
        x - r, y - k, x - k, y - r, x, y - r
    );
    pathCommandBezierCurveToUseCase(
        x + k, y - r, x + r, y - k, x + r, y
    );
};