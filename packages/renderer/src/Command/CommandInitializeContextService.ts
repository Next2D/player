import { CanvasToWebGLContext } from "@next2d/webgl";
import {
    $setCanvas,
    $setContext,
    $setDevicePixelRatio,
    $setWebGL2RenderingContext,
    $samples
} from "../RendererUtil";

/**
 * @description OffscreenCanvasからWebGL2のコンテキストを取得
 *              Get WebGL2 context from OffscreenCanvas
 *
 * @param  {OffscreenCanvas} canvas
 * @param  {number} ratio
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    canvas: OffscreenCanvas,
    ratio: number
): void => {

    // Set OffscreenCanvas
    $setCanvas(canvas);

    // // Set Device Pixel Ratio
    $setDevicePixelRatio(ratio);

    const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2", {
        "stencil": true,
        "premultipliedAlpha": true,
        "antialias": false,
        "depth": false,
        "preserveDrawingBuffer": true
    });

    if (!gl) {
        throw new Error("webgl2 is not supported.");
    }

    // Set WebGL2 context
    $setWebGL2RenderingContext(gl);

    // Set CanvasToWebGLContext
    $setContext(new CanvasToWebGLContext(gl, $samples));
};