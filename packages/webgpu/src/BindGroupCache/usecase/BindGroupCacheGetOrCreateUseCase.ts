import type { ICachedBindGroup } from "../interface/ICachedBindGroup";
import { execute as bindGroupCacheEvictOldestService } from "../service/BindGroupCacheEvictOldestService";

/**
 * @description BindGroupを取得または作成
 *              Get or create BindGroup
 *
 * @param  {GPUDevice} device
 * @param  {Map<string, ICachedBindGroup>} cache
 * @param  {string} key - キャッシュキー
 * @param  {GPUBindGroupLayout} layout - BindGroupレイアウト
 * @param  {GPUBindGroupEntry[]} entries - BindGroupエントリ
 * @param  {number} currentFrame
 * @param  {number} maxCacheEntries
 * @return {GPUBindGroup}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    cache: Map<string, ICachedBindGroup>,
    key: string,
    layout: GPUBindGroupLayout,
    entries: GPUBindGroupEntry[],
    currentFrame: number,
    maxCacheEntries: number
): GPUBindGroup => {
    const cached = cache.get(key);

    if (cached) {
        cached.lastUsedFrame = currentFrame;
        return cached.bindGroup;
    }

    // 新規作成
    const bindGroup = device.createBindGroup({
        layout,
        entries
    });

    // キャッシュが満杯なら最も古いエントリを削除
    if (cache.size >= maxCacheEntries) {
        bindGroupCacheEvictOldestService(cache);
    }

    cache.set(key, {
        bindGroup,
        lastUsedFrame: currentFrame
    });

    return bindGroup;
};
