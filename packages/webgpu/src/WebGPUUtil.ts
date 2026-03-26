/**
 * @description 描画のサンプリング数（MSAA）
 *              Number of samples for drawing (MSAA)
 *
 * @type {number}
 * @default 4
 */
export const $samples: number = 4;

/**
 * @description WebGPU描画ユーティリティクラス
 *              Utility class for WebGPU rendering operations
 */
export class WebGPUUtil
{
    /**
     * @description GPUデバイスインスタンス
     *              GPU device instance
     *
     * @type {GPUDevice | null}
     */
    private static device: GPUDevice | null = null;

    /**
     * @description デバイスピクセル比率
     *              Device pixel ratio for high-DPI rendering
     *
     * @type {number}
     */
    private static devicePixelRatio: number = 1;

    /**
     * @description レンダリング最大サイズ（テクスチャアトラス用）
     *              Maximum render size for texture atlas
     *
     * @type {number}
     */
    private static renderMaxSize: number = 8192;

    /**
     * @description Float32Array(4) のオブジェクトプール
     *              Object pool for Float32Array(4) instances
     *
     * @type {Float32Array[]}
     */
    private static float32Array4Pool: Float32Array[] = [];

    /**
     * @description GPUデバイスを設定する
     *              Set the GPUDevice instance
     *
     * @param {GPUDevice} gpu_device - GPUデバイス / GPU device
     * @return {void}
     */
    public static setDevice(gpu_device: GPUDevice): void
    {
        WebGPUUtil.device = gpu_device;
    }

    /**
     * @description GPUデバイスを取得する
     *              Get the GPUDevice instance
     *
     * @return {GPUDevice}
     */
    public static getDevice(): GPUDevice
    {
        if (!WebGPUUtil.device) {
            throw new Error("GPUDevice is not initialized");
        }
        return WebGPUUtil.device;
    }

    /**
     * @description デバイスピクセル比率を設定する
     *              Set the device pixel ratio
     *
     * @param {number} ratio - ピクセル比率 / pixel ratio
     * @return {void}
     */
    public static setDevicePixelRatio(ratio: number): void
    {
        WebGPUUtil.devicePixelRatio = ratio;
    }

    /**
     * @description デバイスピクセル比率を取得する
     *              Get the device pixel ratio
     *
     * @return {number}
     */
    public static getDevicePixelRatio(): number
    {
        return WebGPUUtil.devicePixelRatio;
    }

    /**
     * @description レンダリング最大サイズを設定する
     *              Set the maximum render size
     *
     * @param {number} size - 最大サイズ / maximum size in pixels
     * @return {void}
     */
    public static setRenderMaxSize(size: number): void
    {
        WebGPUUtil.renderMaxSize = size;
    }

    /**
     * @description レンダリング最大サイズを取得する（アトラス用）
     *              Get the maximum render size (for texture atlas)
     *
     * @return {number}
     */
    public static getRenderMaxSize(): number
    {
        return WebGPUUtil.renderMaxSize;
    }

    /**
     * @description 指定長のFloat32Arrayを生成する
     *              Create a new Float32Array with the specified length
     *
     * @param {number} length - 配列の長さ / array length
     * @return {Float32Array}
     */
    public static createFloat32Array(length: number): Float32Array
    {
        return new Float32Array(length);
    }

    /**
     * @description 汎用の空配列を生成する
     *              Create a new empty generic array
     *
     * @return {T[]}
     */
    public static createArray<T>(): T[]
    {
        return [];
    }

    /**
     * @description Float32Array(4) をプールから取得する（なければ新規作成）
     *              Get a Float32Array(4) from the pool, or create a new one
     *
     * @return {Float32Array}
     */
    public static getFloat32Array4(): Float32Array
    {
        return WebGPUUtil.float32Array4Pool.length > 0
            ? WebGPUUtil.float32Array4Pool.pop()!
            : new Float32Array(4);
    }

    /**
     * @description Float32Array(4) をプールに返却する
     *              Return a Float32Array(4) to the pool for reuse
     *
     * @param {Float32Array} array - 返却する配列 / array to return
     * @return {void}
     */
    public static poolFloat32Array4(array: Float32Array): void
    {
        if (array.length === 4) {
            WebGPUUtil.float32Array4Pool.push(array);
        }
    }
}

/**
 * @description グローバルコンテキスト（WebGLUtilの$contextに相当）
 *              Global context instance (equivalent to $context in WebGLUtil)
 *
 * @type {any}
 */
export let $context: any = null;

/**
 * @description グローバルコンテキストを設定する
 *              Set the global context instance
 *
 * @param {any} context - コンテキスト / context instance
 * @return {void}
 */
export const $setContext = (context: any): void =>
{
    $context = context;
};

/**
 * @description Float32Array(4) をプールから取得する
 *              Get a Float32Array(4) from the pool
 *
 * @return {Float32Array}
 */
export const $getFloat32Array4 = (): Float32Array =>
{
    return WebGPUUtil.getFloat32Array4();
};

/**
 * @description Float32Array(4) をプールに返却する
 *              Return a Float32Array(4) to the pool
 *
 * @param {Float32Array} array - 返却する配列 / array to return
 * @return {void}
 */
export const $poolFloat32Array4 = (array: Float32Array): void =>
{
    WebGPUUtil.poolFloat32Array4(array);
};
