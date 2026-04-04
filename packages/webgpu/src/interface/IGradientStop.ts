/**
 * @description グラデーションストップの型定義
 *              Gradient stop type definition
 */
export interface IGradientStop {
    /**
     * @description グラデーション位置（0.0〜1.0）
     *              Gradient position ratio (0.0 to 1.0)
     */
    ratio: number;
    /**
     * @description 赤チャンネル値（0〜255）
     *              Red channel value (0 to 255)
     */
    r: number;
    /**
     * @description 緑チャンネル値（0〜255）
     *              Green channel value (0 to 255)
     */
    g: number;
    /**
     * @description 青チャンネル値（0〜255）
     *              Blue channel value (0 to 255)
     */
    b: number;
    /**
     * @description アルファチャンネル値（0〜255）
     *              Alpha channel value (0 to 255)
     */
    a: number;
}
