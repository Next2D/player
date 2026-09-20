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

interface ICompositeBindingCache {
    device: GPUDevice;
    layout: GPUBindGroupLayout;
    buffer: GPUBuffer;
    size: number | undefined;
    sampler: GPUSampler;
    base: GPUTextureView;
    lut: GPUTextureView | null;
    groups: Map<number, GPUBindGroup>;
}

const $compositeBindings = new WeakMap<GPUTextureView, ICompositeBindingCache>();
const $compositeEntries4: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView },
    { "binding": 3, "resource": null as unknown as GPUTextureView }
];
const $compositeEntries5: GPUBindGroupEntry[] = [
    ...$compositeEntries4, { "binding": 4, "resource": null as unknown as GPUTextureView }
];

/**
 * @description 合成フィルターの静的bindingを再利用する。viewごとに直近の組と最大64 offsetを保持。
 *              Reuse static composite bindings; retain the latest resource tuple and at most 64 offsets per view.
 */
export const getCompositeBindGroup = (
    device: GPUDevice,
    layout: GPUBindGroupLayout,
    binding: GPUBufferBinding,
    sampler: GPUSampler,
    blur_view: GPUTextureView,
    base_view: GPUTextureView,
    lut_view: GPUTextureView | null,
    cacheable: boolean
): GPUBindGroup => {
    const offset = binding.offset ?? 0;
    let cache: ICompositeBindingCache | undefined;
    if (cacheable) {
        cache = $compositeBindings.get(blur_view);
        if (!cache || cache.device !== device || cache.layout !== layout || cache.buffer !== binding.buffer
            || cache.size !== binding.size || cache.sampler !== sampler || cache.base !== base_view || cache.lut !== lut_view) {
            cache = { device, layout, "buffer": binding.buffer, "size": binding.size, sampler,
                "base": base_view, "lut": lut_view, "groups": new Map() };
            $compositeBindings.set(blur_view, cache);
        }
        const existing = cache.groups.get(offset);
        if (existing) return existing;
    }
    $compositeEntries4[0].resource = binding;
    $compositeEntries4[1].resource = sampler;
    $compositeEntries4[2].resource = blur_view;
    $compositeEntries4[3].resource = base_view;
    const entries = lut_view ? $compositeEntries5 : $compositeEntries4;
    if (lut_view) $compositeEntries5[4].resource = lut_view;
    const group = device.createBindGroup({ layout, entries });
    if (cache) {
        if (cache.groups.size >= 64) cache.groups.clear();
        cache.groups.set(offset, group);
    }
    return group;
};
