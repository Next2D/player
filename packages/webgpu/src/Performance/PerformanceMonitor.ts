import type { IPerformanceResult } from "../interface/IPerformanceResult";
import type { PerformanceLabel } from "../interface/IPerformanceLabel";
import type { IPerformanceStats } from "../interface/IPerformanceStats";
import { execute as createQuerySetService } from "./service/PerformanceMonitorCreateQuerySetService";
import { execute as measurePassUseCase } from "./usecase/PerformanceMonitorMeasurePassUseCase";

export type { PerformanceLabel, IPerformanceStats };

/**
 * @description GPU処理時間を計測するパフォーマンスモニター
 *              Performance monitor for GPU processing time measurement
 *
 * Timestamp Query機能を使用してGPU上での実際の処理時間を計測。
 * ボトルネックの特定と最適化効果の定量的評価に使用。
 *
 * @class
 */
export class PerformanceMonitor
{
    private device: GPUDevice;
    private enabled: boolean = false;
    private querySet: GPUQuerySet | null = null;
    private resolveBuffer: GPUBuffer | null = null;
    private queryIndex: number = 0;

    // 計測結果を蓄積
    private measurements: Map<string, IPerformanceResult[]> = new Map();
    private currentLabel: string = "";

    // QuerySetの最大クエリ数
    private static readonly MAX_QUERIES = 256;

    /**
     * @constructor
     * @param {GPUDevice} device - WebGPU device
     */
    constructor (device: GPUDevice)
    {
        this.device = device;
    }

    /**
     * @description パフォーマンス計測を有効化
     *              Enable performance measurement
     * @return {boolean} 有効化に成功したかどうか
     */
    enable(): boolean
    {
        if (this.enabled) {
            return true;
        }

        // QuerySetを作成
        this.querySet = createQuerySetService(
            this.device,
            PerformanceMonitor.MAX_QUERIES
        );

        if (!this.querySet) {
            return false;
        }

        // 結果格納用バッファを作成
        this.resolveBuffer = this.device.createBuffer({
            "size": PerformanceMonitor.MAX_QUERIES * 8,
            "usage": GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC
        });

        this.enabled = true;
        this.measurements.clear();
        this.queryIndex = 0;

        return true;
    }

    /**
     * @description パフォーマンス計測を無効化
     *              Disable performance measurement
     */
    disable(): void
    {
        if (this.querySet) {
            this.querySet.destroy();
            this.querySet = null;
        }
        if (this.resolveBuffer) {
            this.resolveBuffer.destroy();
            this.resolveBuffer = null;
        }
        this.enabled = false;
        this.measurements.clear();
        this.queryIndex = 0;
    }

    /**
     * @description 計測が有効かどうか
     *              Whether measurement is enabled
     * @return {boolean}
     */
    isEnabled(): boolean
    {
        return this.enabled;
    }

    /**
     * @description フレーム開始時にリセット
     *              Reset at frame start
     */
    beginFrame(): void
    {
        if (!this.enabled) {
            return;
        }
        this.queryIndex = 0;
    }

    /**
     * @description 計測区間の開始タイムスタンプを記録
     *              Record start timestamp for measurement
     *
     * @param {GPUCommandEncoder} commandEncoder
     * @param {PerformanceLabel | string} label - 計測ラベル
     */
    beginMeasure(
        commandEncoder: GPUCommandEncoder,
        label: PerformanceLabel | string
    ): void {
        if (!this.enabled || !this.querySet) {
            return;
        }

        if (this.queryIndex >= PerformanceMonitor.MAX_QUERIES - 1) {
            return;
        }

        this.currentLabel = label;
        commandEncoder.writeTimestamp(this.querySet, this.queryIndex);
        this.queryIndex++;
    }

    /**
     * @description 計測区間の終了タイムスタンプを記録
     *              Record end timestamp for measurement
     *
     * @param {GPUCommandEncoder} commandEncoder
     */
    endMeasure(commandEncoder: GPUCommandEncoder): void
    {
        if (!this.enabled || !this.querySet) {
            return;
        }

        if (this.queryIndex >= PerformanceMonitor.MAX_QUERIES) {
            return;
        }

        commandEncoder.writeTimestamp(this.querySet, this.queryIndex);
        this.queryIndex++;
    }

    /**
     * @description RenderPassのタイムスタンプ設定を取得
     *              Get timestamp settings for RenderPass
     *
     * @param {PerformanceLabel | string} label - 計測ラベル
     * @return {GPURenderPassTimestampWrites | undefined}
     */
    getRenderPassTimestamps(
        label: PerformanceLabel | string
    ): GPURenderPassTimestampWrites | undefined {
        if (!this.enabled || !this.querySet) {
            return undefined;
        }

        if (this.queryIndex >= PerformanceMonitor.MAX_QUERIES - 1) {
            return undefined;
        }

        this.currentLabel = label;
        const beginQueryIndex = this.queryIndex;
        this.queryIndex += 2;

        return {
            "querySet": this.querySet,
            "beginningOfPassWriteIndex": beginQueryIndex,
            "endOfPassWriteIndex": beginQueryIndex + 1
        };
    }

    /**
     * @description フレーム終了時に結果を解決
     *              Resolve results at frame end
     *
     * @param {GPUCommandEncoder} commandEncoder
     */
    resolveQueries(commandEncoder: GPUCommandEncoder): void
    {
        if (!this.enabled || !this.querySet || !this.resolveBuffer) {
            return;
        }

        if (this.queryIndex === 0) {
            return;
        }

        commandEncoder.resolveQuerySet(
            this.querySet,
            0,
            this.queryIndex,
            this.resolveBuffer,
            0
        );
    }

    /**
     * @description 計測結果を取得（非同期）
     *              Get measurement results (async)
     *
     * @return {Promise<IPerformanceResult[]>}
     */
    async getResults(): Promise<IPerformanceResult[]>
    {
        if (!this.enabled || !this.querySet || !this.resolveBuffer) {
            return [];
        }

        if (this.queryIndex === 0) {
            return [];
        }

        return measurePassUseCase(
            this.device,
            this.querySet,
            this.resolveBuffer,
            this.queryIndex
        );
    }

    /**
     * @description 統計情報を取得
     *              Get statistics
     *
     * @param {IPerformanceResult[]} results - 計測結果
     * @return {IPerformanceStats[]}
     */
    getStats(results: IPerformanceResult[]): IPerformanceStats[]
    {
        // 結果をラベルごとにグループ化する場合は
        // 呼び出し側で結果を管理する必要がある
        // ここでは全体の統計を返す

        if (results.length === 0) {
            return [];
        }

        const durations = results.map((r) => r.durationMs);
        const totalMs = durations.reduce((a, b) => a + b, 0);

        return [{
            "label": "total",
            "count": results.length,
            "totalMs": totalMs,
            "avgMs": totalMs / results.length,
            "minMs": Math.min(...durations),
            "maxMs": Math.max(...durations)
        }];
    }

    /**
     * @description 計測結果をコンソールに出力
     *              Log measurement results to console
     *
     * @param {IPerformanceResult[]} results - 計測結果
     */
    logResults(results: IPerformanceResult[]): void
    {
        if (results.length === 0) {
            console.log("PerformanceMonitor: No results");
            return;
        }

        console.group("PerformanceMonitor Results");

        for (const result of results) {
            console.log(
                `[${result.index}] ${result.durationMs.toFixed(3)}ms (${result.durationNs}ns)`
            );
        }

        const stats = this.getStats(results);
        if (stats.length > 0) {
            const s = stats[0];
            console.log("--- Summary ---");
            console.log(`Total: ${s.totalMs.toFixed(3)}ms`);
            console.log(`Avg: ${s.avgMs.toFixed(3)}ms`);
            console.log(`Min: ${s.minMs.toFixed(3)}ms`);
            console.log(`Max: ${s.maxMs.toFixed(3)}ms`);
        }

        console.groupEnd();
    }

    /**
     * @description リソースを破棄
     *              Destroy resources
     */
    destroy(): void
    {
        this.disable();
    }
}
