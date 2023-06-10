/**
 * @shortcut
 * @type {Window}
 * @const
 * @static
 */
export const $window: Window = window;

/**
 * @shortcut
 * @type {number}
 * @const
 * @static
 */
export const $devicePixelRatio: number = $window.devicePixelRatio;

/**
 * @shortcut
 * @type {Document}
 * @const
 * @static
 */
export const $document: Document = $window.document;

/**
 * @shortcut
 * @type {RegExp}
 * @const
 * @static
 */
export const $RegExp: typeof RegExp = RegExp;

/**
 * @shortcut
 * @type {Location}
 * @const
 * @static
 */
export const $location: Location = $window.location;

/**
 * @shortcut
 * @type {Navigator}
 * @const
 * @static
 */
export const $navigator: Navigator = $window.navigator;

/**
 * @shortcut
 * @type {Function}
 * @const
 */
export const $parseFloat: Function = parseFloat;
