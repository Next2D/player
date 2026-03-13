/**
 * @description 度数法からラジアンへの変換係数
 *              Conversion factor from degrees to radians
 */
export const DEG_TO_RAD: number = Math.PI / 180;

/**
 * @description 32bit整数カラーからプリマルチプライドアルファRGBA値を抽出
 *              Extract premultiplied alpha RGBA values from 32bit integer color
 *
 * @param  {number} color - 32bit整数カラー値
 * @param  {number} alpha - アルファ値 (0-1)
 * @return {[number, number, number, number]} - [r, g, b, a] (プリマルチプライドアルファ)
 */
export const intToPremultipliedRGBA = (color: number, alpha: number): [number, number, number, number] => {
    const r = (color >> 16 & 0xFF) / 255 * alpha;
    const g = (color >> 8 & 0xFF) / 255 * alpha;
    const b = (color & 0xFF) / 255 * alpha;
    return [r, g, b, alpha];
};

/**
 * @description 32bit整数カラーからストレートRGBA値を抽出
 *              Extract straight (non-premultiplied) RGBA values from 32bit integer color
 *
 * @param  {number} color - 32bit整数カラー値
 * @param  {number} alpha - アルファ値 (0-1)
 * @return {[number, number, number, number]} - [r, g, b, a] (ストレート)
 */
export const intToStraightRGBA = (color: number, alpha: number): [number, number, number, number] => {
    const r = (color >> 16 & 0xFF) / 255;
    const g = (color >> 8 & 0xFF) / 255;
    const b = (color & 0xFF) / 255;
    return [r, g, b, alpha];
};
