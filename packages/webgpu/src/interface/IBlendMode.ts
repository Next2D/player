/**
 * @description ブレンドモードの型定義
 *              Blend mode type definition
 *
 * 描画オブジェクトに適用可能なブレンドモードを定義します。
 * Defines the blend modes that can be applied to display objects.
 */
export type IBlendMode =
    | "normal"
    | "layer"
    | "multiply"
    | "screen"
    | "lighten"
    | "darken"
    | "difference"
    | "add"
    | "subtract"
    | "invert"
    | "alpha"
    | "erase"
    | "overlay"
    | "hardlight"
    | "copy";
