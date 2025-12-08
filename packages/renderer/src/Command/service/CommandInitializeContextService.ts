import { Context as WebGLContext } from "@next2d/webgl";
import { Context as WebGPUContext } from "@next2d/webgpu";
import {
    $setCanvas,
    $setContext,
    $samples
} from "../../RendererUtil";

/**
 * @description 開発時用のフラグ
 *              Flag for development use
 *
 * @type {boolean}
 * @private
 */
const useWebGPU: boolean = true;

/**
 * @description OffscreenCanvasからWebGL2またはWebGPUのコンテキストを取得
 *              Get WebGL2 or WebGPU context from OffscreenCanvas
 *
 * @param  {OffscreenCanvas} canvas
 * @param  {number} device_pixel_ratio
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    canvas: OffscreenCanvas,
    device_pixel_ratio: number
): Promise<void> => {

    // Set OffscreenCanvas
    $setCanvas(canvas);

    if (useWebGPU && "gpu" in navigator) {
        const gpu = navigator.gpu as GPU;
        const adapter = await gpu.requestAdapter();
        if (!adapter) {
            throw new Error("WebGPU adapter not available");
        }

        const device = await adapter.requestDevice();
        if (!device) {
            throw new Error("WebGPU device not available");
        }

        const context = canvas.getContext("webgpu");
        if (!context) {
            throw new Error("WebGPU context not available");
        }

        const preferredFormat = gpu.getPreferredCanvasFormat();
        $setContext(new WebGPUContext(device, context, preferredFormat, device_pixel_ratio));
            
    } else {
        const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2", {
            "stencil": true,
            "premultipliedAlpha": true,
            "antialias": false,
            "depth": false
        });

        if (!gl) {
            throw new Error("webgl2 is not supported.");
        }

        // Set CanvasToWebGLContext
        $setContext(new WebGLContext(gl, $samples, device_pixel_ratio));
    }
};