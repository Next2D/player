import { $devicePixelRatio } from "./CoreUtil";
import { execute as canvasInitializeService } from "./Canvas/service/CanvasInitializeService";
import { execute as canvasBootOffscreenCanvasService } from "./Canvas/service/CanvasBootOffscreenCanvasService";
import { execute as canvasRegisterEventUseCase } from "./Canvas/usecase/CanvasRegisterEventUseCase";

/**
 * @type {HTMLCanvasElement}
 * @public
 */
export const $canvas: HTMLCanvasElement = document.createElement("canvas");

// initial invoking function
canvasInitializeService($canvas, $devicePixelRatio);

// Register an event
canvasRegisterEventUseCase($canvas);

// Boot offscreen canvas
canvasBootOffscreenCanvasService($canvas, $devicePixelRatio);