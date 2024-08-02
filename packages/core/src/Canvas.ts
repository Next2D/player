import { $devicePixelRatio } from "./CoreUtil";
import { execute as canvasInitializeService } from "./Canvas/CanvasInitializeService";
import { execute as canvasBootOffscreenCanvasService } from "./Canvas/CanvasBootOffscreenCanvasService";
import { execute as canvasRegisterEventService } from "./Canvas/CanvasRegisterEventService";

/**
 * @type {string}
 * @public
 */
export const $POINTER_DOWN: string = "pointerdown";

/**
 * @type {string}
 * @public
 */
export const $POINTER_UP: string = "pointerup";

/**
 * @type {string}
 * @public
 */
export const $POINTER_MOVE: string = "pointermove";

/**
 * @type {HTMLCanvasElement}
 * @public
 */
export const $canvas: HTMLCanvasElement = document.createElement("canvas");

// initial invoking function
canvasInitializeService($canvas, $devicePixelRatio);

// Register an event
canvasRegisterEventService($canvas);

// Boot offscreen canvas
canvasBootOffscreenCanvasService($canvas, $devicePixelRatio);