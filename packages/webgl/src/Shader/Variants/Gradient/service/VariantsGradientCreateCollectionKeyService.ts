/**
 * @description グラデーションのマップキーを生成
 *              Generates a map key for the gradient
 *
 * @param  {boolean} has_grid
 * @param  {boolean} is_radial
 * @param  {boolean} has_focal_point
 * @param  {number} spread_method
 * @return {string}
 * @method
 * @protected
 */
export const execute = (
    has_grid: boolean,
    is_radial: boolean,
    has_focal_point: boolean,
    spread_method: number
): string => {

    const key1 = has_grid  ? "y" : "n";
    const key2 = is_radial ? "y" : "n";
    const key3 = is_radial && has_focal_point ? "y" : "n";
    const key4 = `${spread_method}`;

    return `${key1}${key2}${key3}${key4}`;
};