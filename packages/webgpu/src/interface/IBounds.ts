/**
 * @description バウンディングボックスのインターフェース
 *              Bounding box interface
 *
 * 描画オブジェクトの矩形領域を最小・最大座標で定義します。
 * Defines a rectangular area of a display object using min/max coordinates.
 */
export interface IBounds
{
    /**
     * @description X軸の最小値
     *              Minimum value on the X axis
     */
    xMin: number;
    /**
     * @description Y軸の最小値
     *              Minimum value on the Y axis
     */
    yMin: number;
    /**
     * @description X軸の最大値
     *              Maximum value on the X axis
     */
    xMax: number;
    /**
     * @description Y軸の最大値
     *              Maximum value on the Y axis
     */
    yMax: number;
}
