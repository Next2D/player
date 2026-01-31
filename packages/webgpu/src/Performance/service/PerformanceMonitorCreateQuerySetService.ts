/**
 * @description Timestamp QuerySetを作成
 *              Create Timestamp QuerySet for GPU timing
 *
 * @param {GPUDevice} device - WebGPU device
 * @param {number} count - クエリ数（開始と終了のペアで2個必要）
 * @return {GPUQuerySet | null} QuerySet、または機能がサポートされていない場合はnull
 */
export const execute = (
    device: GPUDevice,
    count: number
): GPUQuerySet | null => {

    // timestamp-query機能がサポートされているか確認
    if (!device.features.has("timestamp-query")) {
        return null;
    }

    try {
        const querySet = device.createQuerySet({
            "type": "timestamp",
            "count": count
        });

        return querySet;
    } catch (_error) {
        return null;
    }
};
