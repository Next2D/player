"use strict";

/**
 * @type {number}
 */
// eslint-disable-next-line no-unused-vars
let instanceId = 0;

/**
 * @type {number}
 */
// eslint-disable-next-line no-unused-vars
let loaderInfoId = 0;

/**
 * @type {number}
 */
// eslint-disable-next-line no-unused-vars
let programId = 0;

/**
 * @shortcut
 * @type {Window}
 * @const
 * @static
 */
const $window = window;

/**
 * @type {number}
 * @const
 * @static
 */
const $devicePixelRatio = $window.devicePixelRatio;

/**
 * @shortcut
 * @type {Document}
 * @const
 * @static
 */
const $document = $window.document;

/**
 * @shortcut
 * @type {Navigator}
 * @const
 * @static
 */
const $navigator = $window.navigator;

/**
 * @shortcut
 * @type {Location}
 * @const
 * @static
 */
const $location = $window.location;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
const $isNaN = $window.isNaN;

/**
 * @shortcut
 * @type {Math}
 * @const
 */
const $Math = $window.Math;

/**
 * @shortcut
 * @type {ArrayConstructor}
 * @const
 */
const $Array = $window.Array;

/**
 * @shortcut
 * @type {Number}
 * @const
 */
const $Number = $window.Number;

/**
 * @shortcut
 * @type {RegExp}
 * @const
 */
const $RegExp = $window.RegExp;

/**
 * @shortcut
 * @type {MapConstructor}
 * @const
 * @static
 */
const $Map = $window.Map;

/**
 * @shortcut
 * @type {URL}
 * @const
 * @static
 */
const $URL = $window.URL;

/**
 * @shortcut
 * @type {Blob}
 * @const
 * @static
 */
const $Blob = $window.Blob;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
const $parseFloat = $window.parseFloat;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
const $performance = $window.performance;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
const $clearTimeout = $window.clearTimeout;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
const $cancelAnimationFrame = $window.cancelAnimationFrame;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
const $CanvasRenderingContext2D = $window.CanvasRenderingContext2D;

/**
 * @shortcut
 * @type {function}
 * @const
 * @static
 */
const $OffscreenCanvas =  $window.OffscreenCanvas;

/**
 * @shortcut
 * @type {(handler: TimerHandler, timeout?: number, ...arguments: any[]) => number}
 * @const
 */
const $setTimeout = $window.setTimeout;

/**
 * @shortcut
 * @type {(callback: FrameRequestCallback) => number}
 * @const
 */
const $requestAnimationFrame = $window.requestAnimationFrame;

/**
 * @shortcut
 * @type {Image}
 * @const
 * @static
 */
const $Image = $window.Image;

/**
 * @shortcut
 * @type {WebGLTexture}
 * @const
 */
const $WebGLTexture = $window.WebGLTexture;

/**
 * @shortcut
 * @type {Uint8Array}
 * @const
 */
const $Uint8Array = $window.Uint8Array;

/**
 * @shortcut
 * @type {Float32Array}
 * @const
 */
const $Float32Array = $window.Float32Array;

/**
 * @shortcut
 * @type {Int16Array}
 * @const
 */
const $Int16Array = $window.Int16Array;

/**
 * @shortcut
 * @type {number}
 * @const
 * @static
 */
const $Infinity = $window.Infinity;