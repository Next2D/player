import { execute as cacheStoreResetService } from "./CacheStore/CacheStoreResetService";
import { execute as cacheStoreDestroyService } from "./CacheStore/CacheStoreDestroyService";
import { execute as cacheStoreRemoveService } from "./CacheStore/CacheStoreRemoveService";
import { execute as cacheStoreRemoveByIdService } from "./CacheStore/CacheStoreRemoveByIdService";
import { execute as cacheStoreGetService } from "./CacheStore/CacheStoreGetService";
import { execute as cacheStoreSetService } from "./CacheStore/CacheStoreSetService";
import { execute as cacheStoreHasService } from "./CacheStore/CacheStoreHasService";
import { execute as cacheStoreGenerateKeysService } from "./CacheStore/CacheStoreGenerateKeysService";

/**
 * @description キャッシュ管理クラス
 *              Cache management class
 *
 * @class
 * @private
 */
class CacheStore
{
    private readonly _$pool: HTMLCanvasElement[];
    private readonly _$store: Map<string, any>;

    /**
     * @constructor
     */
    constructor ()
    {
        /**
         * @type {array}
         * @private
         */
        this._$pool = [];

        /**
         * @type {Map}
         * @private
         */
        this._$store = new Map();
    }

    /**
     * @description 登録された全てのキャッシュをリセット・破棄する
     *              Reset and destroy all registered caches
     *
     * @return {void}
     * @method
     * @public
     */
    reset (): void
    {
        cacheStoreResetService(this, this._$store);
    }

    /**
     * @description 指定のオブジェクトを破棄する
     *              Destroy the specified object
     *
     * @param  {object} [object=null]
     * @return {void}
     * @method
     * @public
     */
    destroy (object: any = null): void
    {
        cacheStoreDestroyService(this._$pool, object);
    }

    /**
     * @description HTMLCanvasElementを返却
     *              Returns HTMLCanvasElement
     *
     * @return {HTMLCanvasElement}
     * @method
     * @public
     */
    getCanvas (): HTMLCanvasElement
    {
        return this._$pool.pop() || document.createElement("canvas");
    }

    /**
     * @description HTMLCanvasElementを再利用する為に、内部配列にプール
     *              Pool in an internal array to reuse HTMLCanvasElement
     *
     * @param   {string} id
     * @param   {string} type
     * @returns {void}
     * @method
     * @public
     */
    remove (id: string, type: string): void
    {
        cacheStoreRemoveService(this._$store, id, type);
    }

    /**
     * @description 指定IDのキャッシュを削除する
     *              Delete the cache for the specified ID
     *
     * @param   {string} id
     * @returns {void}
     * @method
     * @public
     */
    removeCache (id: string): void
    {
        cacheStoreRemoveByIdService(this, this._$store, id);
    }

    /**
     * @description 指定のキーのキャッシュデータを返却
     *              Returns the cache data for the specified key
     *
     * @param  {array} keys
     * @return {*}
     * @method
     * @public
     */
    get (keys: string[]): any
    {
        return cacheStoreGetService(this._$store, keys);
    }

    /**
     * @description キャッシュストアにデータをセット
     *              Set data in the cache store
     *
     * @param  {array} keys
     * @param  {*} value
     * @return {void}
     * @method
     * @public
     */
    set (keys: string[], value: any = null): void
    {
        cacheStoreSetService(
            this, this._$store, keys, value
        );
    }

    /**
     * @description 指定キーのキャッシュが存在するかどうか
     *              Whether the specified key cache exists
     *
     * @param  {array} keys
     * @return {boolean}
     * @method
     * @public
     */
    has (keys: string[]): boolean
    {
        return cacheStoreHasService(this._$store, keys);
    }

    /**
     * @description キャッシュストアのキーを生成
     *              Generate cache store keys
     *
     * @param  {string} unique_key
     * @param  {array} keys
     * @param  {array} [scales=null]
     * @param  {Float32Array} [color=null]
     * @return {void}
     * @method
     * @public
     */
    generateKeys (
        unique_key: string,
        keys: string[],
        scales: number[] | null = null,
        color: Float32Array | null = null
    ): void {
        cacheStoreGenerateKeysService(
            unique_key, keys, scales, color
        );
    }
}

export const $cacheStore = new CacheStore();