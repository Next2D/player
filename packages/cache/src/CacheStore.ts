import { execute as cacheStoreResetService } from "./CacheStore/service/CacheStoreResetService";
import { execute as cacheStoreDestroyService } from "./CacheStore/service/CacheStoreDestroyService";
import { execute as cacheStoreRemoveService } from "./CacheStore/service/CacheStoreRemoveService";
import { execute as cacheStoreRemoveByIdService } from "./CacheStore/service/CacheStoreRemoveByIdService";
import { execute as cacheStoreGetService } from "./CacheStore/service/CacheStoreGetService";
import { execute as cacheStoreSetService } from "./CacheStore/service/CacheStoreSetService";
import { execute as cacheStoreHasService } from "./CacheStore/service/CacheStoreHasService";
import { execute as cacheStoreGenerateKeysService } from "./CacheStore/service/CacheStoreGenerateKeysService";
import { execute as cacheStoreGenerateFilterKeysService } from "./CacheStore/service/CacheStoreGenerateFilterKeysService";
import { execute as cacheStoreRemoveTimerService } from "./CacheStore/service/CacheStoreRemoveTimerService";

/**
 * @description キャッシュ管理クラス
 *              Cache management class
 *
 * @class
 * @private
 */
export class CacheStore
{
    private readonly _$pool: HTMLCanvasElement[];
    private readonly _$store: Map<string, any>;
    private readonly _$trash: Map<string, any>;
    public $timerId: NodeJS.Timeout | null;
    public readonly $removeIds: number[];

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

        /**
         * @type {Map}
         * @private
         */
        this._$trash = new Map();

        /**
         * @type {NodeJS.Timeout}
         * @public
         */
        this.$timerId = null;

        /**
         * @type {array}
         * @public
         */
        this.$removeIds = [];
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
     * @description 指定IDのキャッシュを削除タイマーに登録
     *              Register the cache for the specified ID in the delete timer
     *
     * @param   {string} id
     * @returns {void}
     * @method
     * @public
     */
    removeTimer (id: string): void
    {
        cacheStoreRemoveTimerService(this, this._$store, this._$trash, id);
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
    removeById (id: string): void
    {
        cacheStoreRemoveByIdService(this, this._$store, id);
    }

    /**
     * @description 指定IDのキャッシュデータを返却
     *              Returns the cache data for the specified ID
     *
     * @param  {string} id
     * @return {Map<string, any>}
     * @method
     * @public
     */
    getById (id: string): Map<string, any>
    {
        return this._$store.get(id);
    }

    /**
     * @description 指定のキーのキャッシュデータを返却
     *              Returns the cache data for the specified key
     *
     * @param  {string} unique_key
     * @param  {string} key
     * @return {*}
     * @method
     * @public
     */
    get (unique_key: string, key: string): any
    {
        return cacheStoreGetService(this._$store, unique_key, key);
    }

    /**
     * @description キャッシュストアにデータをセット
     *              Set data in the cache store
     *
     * @param  {string} unique_key
     * @param  {string} key
     * @param  {*} value
     * @return {void}
     * @method
     * @public
     */
    set (unique_key: string, key: string, value: any = null): void
    {
        cacheStoreSetService(
            this, this._$store, unique_key, key, value
        );
    }

    /**
     * @description 指定キーのキャッシュが存在するかどうか
     *              Whether the specified key cache exists
     *
     * @param  {string} unique_key
     * @param  {string} key
     * @return {boolean}
     * @method
     * @public
     */
    has (unique_key: string, key: string = ""): boolean
    {
        return cacheStoreHasService(this._$store, unique_key, key);
    }

    /**
     * @description キャッシュストアのキーを生成
     *              Generate cache store keys
     *
     * @param  {number} x_scale
     * @param  {number} y_scale
     * @param  {number} alpha
     * @return {number}
     * @method
     * @public
     */
    generateKeys (x_scale: number, y_scale: number, alpha: number): number
    {
        return cacheStoreGenerateKeysService(x_scale, y_scale, alpha);
    }

    /**
     * @description フィルター用のキャッシュストアのキーを生成
     *              Generate cache store keys for filters
     *
     * @param  {number} a
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @return {number}
     * @method
     * @public
     */
    generateFilterKeys (a: number, b: number, c: number, d: number): number
    {
        return cacheStoreGenerateFilterKeysService(a, b, c, d);
    }
}

export const $cacheStore = new CacheStore();