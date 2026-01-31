import type { PerformanceLabel } from "./IPerformanceLabel";

/**
 * @description 計測結果の統計情報
 *              Statistics for measurement results
 */
export interface IPerformanceStats {
    label: PerformanceLabel | string;
    count: number;
    totalMs: number;
    avgMs: number;
    minMs: number;
    maxMs: number;
}
