/**
 * @description ゲームパッドの前フレームのボタン押下状態 (gamepadIndex => boolean[])
 *              Previous frame button pressed state per gamepad (gamepadIndex => boolean[])
 *
 * @type {Map<number, boolean[]>}
 * @protected
 */
export const $gamepadButtonStates: Map<number, boolean[]> = new Map();

/**
 * @description ゲームパッドの前フレームの軸値 (gamepadIndex => number[])
 *              Previous frame axis values per gamepad (gamepadIndex => number[])
 *
 * @type {Map<number, number[]>}
 * @protected
 */
export const $gamepadAxisStates: Map<number, number[]> = new Map();
