export class WebGPUUtil
{
    private static device: GPUDevice | null = null;
    private static devicePixelRatio: number = 1;
    private static renderMaxSize: number = 8192;
    private static float32Array4Pool: Float32Array[] = [];

    /**
     * @description Set GPUDevice
     * @param {GPUDevice} gpu_device
     * @return {void}
     */
    public static setDevice(gpu_device: GPUDevice): void
    {
        WebGPUUtil.device = gpu_device;
    }

    /**
     * @description Get GPUDevice
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
     * @description Set device pixel ratio
     * @param {number} ratio
     * @return {void}
     */
    public static setDevicePixelRatio(ratio: number): void
    {
        WebGPUUtil.devicePixelRatio = ratio;
    }

    /**
     * @description Get device pixel ratio
     * @return {number}
     */
    public static getDevicePixelRatio(): number
    {
        return WebGPUUtil.devicePixelRatio;
    }

    /**
     * @description Set render max size
     * @param {number} size
     * @return {void}
     */
    public static setRenderMaxSize(size: number): void
    {
        WebGPUUtil.renderMaxSize = size;
    }

    /**
     * @description Get render max size (for atlas)
     * @return {number}
     */
    public static getRenderMaxSize(): number
    {
        return WebGPUUtil.renderMaxSize;
    }

    /**
     * @description Create Float32Array
     * @param {number} length
     * @return {Float32Array}
     */
    public static createFloat32Array(length: number): Float32Array
    {
        return new Float32Array(length);
    }

    /**
     * @description Create generic array
     * @return {Array}
     */
    public static createArray<T>(): T[]
    {
        return [];
    }

    /**
     * @description Get Float32Array(4) from pool
     * @return {Float32Array}
     */
    public static getFloat32Array4(): Float32Array
    {
        return WebGPUUtil.float32Array4Pool.length > 0
            ? WebGPUUtil.float32Array4Pool.pop()!
            : new Float32Array(4);
    }

    /**
     * @description Return Float32Array(4) to pool
     * @param {Float32Array} array
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
 */
export let $context: any = null;

/**
 * @description コンテキストを設定
 * @param {any} context
 */
export const $setContext = (context: any): void =>
{
    $context = context;
};

/**
 * @description Float32Array(4) をプールから取得
 * @return {Float32Array}
 */
export const $getFloat32Array4 = (): Float32Array =>
{
    return WebGPUUtil.getFloat32Array4();
};

/**
 * @description Float32Array(4) をプールに返却
 * @param {Float32Array} array
 */
export const $poolFloat32Array4 = (array: Float32Array): void =>
{
    WebGPUUtil.poolFloat32Array4(array);
};
