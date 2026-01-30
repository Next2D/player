/**
 * @description パフォーマンス計測結果
 *              Performance measurement result
 */
export interface IPerformanceResult {
    /**
     * @description 計測インデックス
     */
    index: number;

    /**
     * @description 実行時間（ナノ秒）
     */
    durationNs: number;

    /**
     * @description 実行時間（ミリ秒）
     */
    durationMs: number;

    /**
     * @description 開始タイムスタンプ（ナノ秒）
     */
    startTime: number;

    /**
     * @description 終了タイムスタンプ（ナノ秒）
     */
    endTime: number;
}
