/**
 * @type {boolean}
 * @private
 */
let $enabled: boolean = false;

/**
 * @type {Float32Array}
 * @private
 */
export const $gridData: Float32Array = new Float32Array(28);

/**
 * @description グリッドの有効状態を返却
 *              Returns the enabled state of the grid.
 *
 * @returns {boolean}
 * @method
 * @protected
 */
export const $gridEnabled = (): boolean =>
{
    return $enabled;
};

/**
 * @description グリッドの有効状態を設定
 *              Set the enabled state of the grid.
 *
 * @param  {Float32Array} grid_data
 * @param enabled {boolean}
 * @method
 * @protected
 */
export const $setGridData = (grid_data: Float32Array): void =>
{
    // グリッドデータをセット
    $gridData.set(grid_data);

    // グリッドの有効状態を設定
    $enabled = true;
};

/**
 * @description グリッドのオフセットを設定
 *              Set the grid offset.
 * 
 * @param {number} x
 * @param {number} y
 * @return {void}
 * @method
 * @protected
 */
export const $setGridOffset = (x: number, y: number): void =>
{
    // グリッドデータをセット
    $gridData[24] = x;
    $gridData[25] = y;
};

/**
 * @description グリッドの有効状態を解除
 *              Disable the grid.
 *
 * 
 * @return {void}
 * @method
 * @protected
 */
export const $terminateGrid = (): void =>
{
    $enabled = false;
};