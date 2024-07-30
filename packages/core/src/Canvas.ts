import { $devicePixelRatio } from "./CoreUtil";
import { execute as canvasInitializeService } from "./Canvas/CanvasInitializeService";
import { execute as canvasBootOffscreenCanvasService } from "./Canvas/CanvasBootOffscreenCanvasService";

/**
 * @type {HTMLCanvasElement}
 * @public
 */
export const $canvas: HTMLCanvasElement = document.createElement("canvas");

// initial invoking function
canvasInitializeService($canvas, $devicePixelRatio);

// Boot offscreen canvas
canvasBootOffscreenCanvasService($canvas, $devicePixelRatio);