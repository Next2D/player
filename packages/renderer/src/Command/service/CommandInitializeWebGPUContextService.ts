import { Context } from "@next2d/webgpu";
import {
    $setCanvas,
    $setContext,
    $samples
} from "../../RendererUtil";

/**
 * @description OffscreenCanvasからWebGPUのコンテキストを取得
 *              Get WebGPU context from OffscreenCanvas
 *
 * @param  {OffscreenCanvas} canvas
 * @param  {number} device_pixel_ratio
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (canvas: OffscreenCanvas, device_pixel_ratio: number): Promise<void> =>
{
    // Check if WebGPU is supported
    if (!navigator.gpu) {
        throw new Error("WebGPU is not supported in this browser.");
    }

    // Set OffscreenCanvas
    $setCanvas(canvas);

    try {
        // Request WebGPU adapter
        const adapter = await navigator.gpu.requestAdapter({
            "powerPreference": "high-performance"
        });

        if (!adapter) {
            throw new Error("Failed to get WebGPU adapter.");
        }

        // Request WebGPU device
        const device = await adapter.requestDevice({
            "requiredFeatures": ["texture-compression-bc"] as GPUFeatureName[],
            "requiredLimits": {
                "maxTextureDimension2D": 4096,
                "maxBindGroups": 4
            }
        });

        // Get canvas context
        const canvasContext = canvas.getContext("webgpu");
        if (!canvasContext) {
            throw new Error("Failed to get WebGPU canvas context.");
        }

        // Create and set WebGPU context
        $setContext(new Context(device, canvasContext, $samples, device_pixel_ratio));

    } catch (error) {
        console.error("WebGPU initialization failed:", error);
        throw new Error(`WebGPU initialization failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};