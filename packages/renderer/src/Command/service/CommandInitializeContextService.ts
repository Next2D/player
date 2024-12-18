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
 * @return {void}
 * @method
 * @public
 */
export const execute = (canvas: OffscreenCanvas): void =>
{
    // Set OffscreenCanvas
    $setCanvas(canvas);

    const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2", {
        "stencil": true,
        "premultipliedAlpha": true,
        "antialias": false,
        "depth": false
        // "preserveDrawingBuffer": true
    });

    if (!gl) {
        throw new Error("webgl2 is not supported.");
    }

    // Set CanvasToWebGLContext
    $setContext(new Context(gl, $samples));
};