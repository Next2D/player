import { Context } from "./Context";
import { $setDevice, $setCanvasContext } from "./WebGPUUtil";

/**
 * @description WebGPUデバイスの初期化オプション
 *              WebGPU device initialization options
 */
export interface IWebGPUInitOptions {
    canvas: HTMLCanvasElement;
    devicePixelRatio?: number;
    samples?: number;
    powerPreference?: GPUPowerPreference;
    requiredFeatures?: GPUFeatureName[];
}

/**
 * @description WebGPUコンテキストを初期化
 *              Initialize WebGPU context
 *
 * @param  {IWebGPUInitOptions} options
 * @return {Promise<Context>}
 * @method
 * @public
 */
export const initializeWebGPU = async (options: IWebGPUInitOptions): Promise<Context> =>
{
    const {
        canvas,
        devicePixelRatio = 1,
        samples = 4,
        powerPreference = "high-performance",
        requiredFeatures = []
    } = options;

    // WebGPUがサポートされているかチェック
    // Check if WebGPU is supported
    if (!navigator.gpu) {
        throw new Error("WebGPU is not supported in this browser");
    }

    // GPUアダプターを取得
    // Get GPU adapter
    const adapter = await navigator.gpu.requestAdapter({
        powerPreference,
        "forceFallbackAdapter": false
    });

    if (!adapter) {
        throw new Error("Failed to get WebGPU adapter");
    }

    // GPUデバイスを取得
    // Get GPU device
    const device = await adapter.requestDevice({
        requiredFeatures
    });

    if (!device) {
        throw new Error("Failed to get WebGPU device");
    }

    // キャンバスコンテキストを取得して設定
    // Get and configure canvas context
    const canvasContext = canvas.getContext("webgpu");
    if (!canvasContext) {
        throw new Error("Failed to get WebGPU canvas context");
    }

    // キャンバスコンテキストを設定
    // Configure canvas context
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    canvasContext.configure({
        device,
        "format": canvasFormat,
        "alphaMode": "premultiplied"
    });

    // グローバルな参照を設定
    // Set global references
    $setDevice(device);
    $setCanvasContext(canvasContext);

    // Next2Dコンテキストを作成
    // Create Next2D context
    const context = new Context(device, canvasContext, samples, devicePixelRatio);

    return context;
};

/**
 * @description WebGPU機能をチェック
 *              Check WebGPU features
 *
 * @return {Promise<GPUAdapterInfo | null>}
 * @method
 * @public
 */
export const checkWebGPUFeatures = async (): Promise<GPUAdapterInfo | null> =>
{
    if (!navigator.gpu) {
        return null;
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        return null;
    }

    return adapter.info;
};

/**
 * @description WebGPUがサポートされているかチェック
 *              Check if WebGPU is supported
 *
 * @return {boolean}
 * @method
 * @public
 */
export const isWebGPUSupported = (): boolean =>
{
    return "gpu" in navigator;
};

/**
 * @description 推奨されるキャンバスフォーマットを取得
 *              Get preferred canvas format
 *
 * @return {GPUTextureFormat | null}
 * @method
 * @public
 */
export const getPreferredCanvasFormat = (): GPUTextureFormat | null =>
{
    if (!navigator.gpu) {
        return null;
    }

    return navigator.gpu.getPreferredCanvasFormat();
};