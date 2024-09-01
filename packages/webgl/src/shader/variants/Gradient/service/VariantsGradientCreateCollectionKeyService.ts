/**
 * @description グラデーションのマップキーを生成
 *              Generates a map key for the gradient
 *
 * @param  {boolean} is_stroke
 * @param  {boolean} has_grid
 * @param  {boolean} is_radial
 * @param  {boolean} has_focal_point
 * @param  {number} spread_method
 * @return {string}
 * @method
 * @protected
 */
export const execute = (
    is_stroke: boolean, has_grid: boolean,
    is_radial: boolean, has_focal_point: boolean,
    spread_method: number
): string => {

    const key1: string = is_stroke ? "y" : "n";
    const key2: string = has_grid  ? "y" : "n";
    const key3: string = is_radial ? "y" : "n";
    const key4: string = is_radial && has_focal_point ? "y" : "n";
    const key5: string = `${spread_method}`;

    return `${key1}${key2}${key3}${key4}${key5}`;
};