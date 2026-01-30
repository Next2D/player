import type { IPerformanceResult } from "../interface/IPerformanceResult";

/**
 * @description パフォーマンス計測結果を解析
 *              Analyze performance measurement results
 *
 * @param {GPUDevice} device - WebGPU device
 * @param {GPUQuerySet} querySet - 計測に使用したQuerySet
 * @param {GPUBuffer} resolveBuffer - 結果が格納されたバッファ
 * @param {number} queryCount - クエリ数
 * @return {Promise<IPerformanceResult[]>} 計測結果の配列
 */
export const execute = async (
    device: GPUDevice,
    querySet: GPUQuerySet,
    resolveBuffer: GPUBuffer,
    queryCount: number
): Promise<IPerformanceResult[]> => {

    const results: IPerformanceResult[] = [];

    // 結果を読み取り用バッファにコピー
    const readBuffer = device.createBuffer({
        "size": queryCount * 8, // 各タイムスタンプは8バイト（BigInt64）
        "usage": GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });

    const commandEncoder = device.createCommandEncoder();
    commandEncoder.copyBufferToBuffer(
        resolveBuffer, 0,
        readBuffer, 0,
        queryCount * 8
    );
    device.queue.submit([commandEncoder.finish()]);

    // バッファをマップして結果を読み取り
    await readBuffer.mapAsync(GPUMapMode.READ);
    const mappedRange = readBuffer.getMappedRange();
    const timestamps = new BigInt64Array(mappedRange);

    // タイムスタンプをペアで解析（開始、終了）
    for (let i = 0; i < queryCount - 1; i += 2) {
        const startTime = timestamps[i];
        const endTime = timestamps[i + 1];

        // 結果をナノ秒からミリ秒に変換
        const durationNs = Number(endTime - startTime);
        const durationMs = durationNs / 1_000_000;

        results.push({
            "index": i / 2,
            "durationNs": durationNs,
            "durationMs": durationMs,
            "startTime": Number(startTime),
            "endTime": Number(endTime)
        });
    }

    readBuffer.unmap();
    readBuffer.destroy();

    return results;
};
