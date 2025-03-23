// @ts-ignore
import ZlibInflateWorker from "./ZlibInflateWorker?worker&inline";

/**
 * @type {Worker}
 * @private
 */
export const $unzipWorker: Worker = new ZlibInflateWorker();