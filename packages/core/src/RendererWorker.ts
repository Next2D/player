// @ts-ignore
import RendererWorker from "@next2d/renderer?worker&inline";

/**
 * @type {Worker}
 * @public
 */
export const $rendererWorker: Worker = new RendererWorker();