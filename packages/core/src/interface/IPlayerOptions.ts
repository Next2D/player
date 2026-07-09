export interface IPlayerOptions {
    width?: number;
    height?: number;
    tagId?: string;
    bgColor?: string;
    fullScreen?: boolean;
    /**
     * @description キャッシュストアの最大エントリ数(LRU)。未指定/0は無制限(従来挙動)。
     *              上限を超えると最も長く参照されていないキャッシュから削除され、
     *              worker側のGPUリソース(アトラス領域等)も解放される。
     *              Maximum number of cache entries (LRU). Unset/0 = unlimited
     *              (legacy behavior). When exceeded, the least recently used
     *              caches are evicted and the worker-side GPU resources
     *              (atlas regions etc.) are released as well.
     */
    cacheStoreLimit?: number;
}