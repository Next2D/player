import { Context } from "@next2d/webgl";
import {
    $setCanvas,
    $setContext,
    $samples
} from "../../RendererUtil";

/**
 * @description OffscreenCanvasからWebGL2のコンテキストを取得
 *              Get WebGL2 context from OffscreenCanvas
 *
 * @param  {OffscreenCanvas} canvas
 * @param  {number} device_pixel_ratio
 * @return {void}
 * @method
 * @public
 */
export const execute = (canvas: OffscreenCanvas, device_pixel_ratio: number): void =>
{
    // Set OffscreenCanvas
    $setCanvas(canvas);

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
    $setContext(new Context(gl, $samples, device_pixel_ratio));
};