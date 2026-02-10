/**
 * @description キャッシュされたBindGroup
 *              Cached bind group interface
 */
export interface ICachedBindGroup {
    bindGroup: GPUBindGroup;
    lastUsedFrame: number;
}
