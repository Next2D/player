/**
 * @description パフォーマンス計測ラベル
 *              Performance measurement labels
 */
export type PerformanceLabel =
    | "frame"           // フレーム全体
    | "fill"            // 塗りつぶし
    | "stroke"          // ストローク
    | "blur"            // ブラーフィルター
    | "filter"          // その他フィルター
    | "blend"           // ブレンド処理
    | "instanced"       // インスタンス描画
    | "custom";         // カスタム
