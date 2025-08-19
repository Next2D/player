import { execute as webglInitialize } from "./CommandInitializeContextService";
import { execute as webgpuInitialize } from "./CommandInitializeWebGPUContextService";

/**
 * @description レンダリングバックエンドの種類
 *              Rendering backend type
 */
export type RenderingBackend = "webgl" | "webgpu" | "auto";

/**
 * @description 利用可能なレンダリングバックエンドを検出
 *              Detect available rendering backends
 *
 * @return {Promise<{ webgl: boolean, webgpu: boolean }>}
 * @method
 * @public
 */
export const detectAvailableBackends = async (): Promise<{ "webgl": boolean, "webgpu": boolean }> =>
{
    const canvas = new OffscreenCanvas(1, 1);

    // Check WebGL support
    const webglSupported = (() => {
        try {
            const gl = canvas.getContext("webgl2");
            return gl !== null;
        } catch {
            return false;
        }
    })();

    // Check WebGPU support
    const webgpuSupported = await (async () => {
        try {
            if (!navigator.gpu) {
                return false;
            }
            const adapter = await navigator.gpu.requestAdapter();
            return adapter !== null;
        } catch {
            return false;
        }
    })();

    return { "webgl": webglSupported, "webgpu": webgpuSupported };
};

/**
 * @description 指定されたバックエンドまたは最適なバックエンドでコンテキストを初期化
 *              Initialize context with specified backend or optimal backend
 *
 * @param  {OffscreenCanvas} canvas
 * @param  {number} device_pixel_ratio
 * @param  {RenderingBackend} [backend="auto"]
 * @return {Promise<RenderingBackend>}
 * @method
 * @public
 */
export const execute = async (
    canvas: OffscreenCanvas,
    device_pixel_ratio: number,
    backend: RenderingBackend = "auto"
): Promise<RenderingBackend> =>
{
    if (backend === "auto") {
        // Auto-detect best available backend
        const available = await detectAvailableBackends();

        if (available.webgpu) {
            try {
                await webgpuInitialize(canvas, device_pixel_ratio);
                return "webgpu";
            } catch (error) {
                console.warn("WebGPU initialization failed, falling back to WebGL:", error);

                if (available.webgl) {
                    webglInitialize(canvas, device_pixel_ratio);
                    return "webgl";
                }
                throw new Error("No supported rendering backend available.");
            }
        }
        if (available.webgl) {
            webglInitialize(canvas, device_pixel_ratio);
            return "webgl";
        }
        throw new Error("No supported rendering backend available.");
    }
    if (backend === "webgpu") {
        await webgpuInitialize(canvas, device_pixel_ratio);
        return "webgpu";
    }
    if (backend === "webgl") {
        webglInitialize(canvas, device_pixel_ratio);
        return "webgl";
    }
    throw new Error(`Unknown rendering backend: ${backend}`);
};