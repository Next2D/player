/**
 * @description ステンシル状態のキャッシュ
 *              Cache for stencil state
 */

/**
 * @description 現在のステンシルモード
 *              Current stencil mode
 *
 * @type {number}
 * @private
 */
let $currentStencilMode: number = 0;

/**
 * @description マスク描画モード
 *              Mask drawing mode
 *
 * @type {number}
 * @const
 */
export const STENCIL_MODE_MASK: number = 1;

/**
 * @description 塗り描画モード
 *              Fill drawing mode
 *
 * @type {number}
 * @const
 */
export const STENCIL_MODE_FILL: number = 2;

/**
 * @description 現在のステンシルモードを返却
 *              Returns the current stencil mode
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getStencilMode = (): number =>
{
    return $currentStencilMode;
};

/**
 * @description ステンシルモードを設定
 *              Set stencil mode
 *
 * @param  {number} mode
 * @return {void}
 * @method
 * @protected
 */
export const $setStencilMode = (mode: number): void =>
{
    $currentStencilMode = mode;
};

/**
 * @description ステンシル状態をリセット
 *              Reset stencil state
 *
 * @return {void}
 * @method
 * @protected
 */
export const $resetStencilMode = (): void =>
{
    $currentStencilMode = 0;
};

/**
 * @description カラーマスク状態
 *              Color mask state
 *
 * @type {boolean}
 * @private
 */
let $colorMaskEnabled: boolean = true;

/**
 * @description カラーマスク状態を返却
 *              Returns the color mask state
 *
 * @return {boolean}
 * @method
 * @protected
 */
export const $getColorMaskEnabled = (): boolean =>
{
    return $colorMaskEnabled;
};

/**
 * @description カラーマスク状態を設定
 *              Set color mask state
 *
 * @param  {boolean} enabled
 * @return {void}
 * @method
 * @protected
 */
export const $setColorMaskEnabled = (enabled: boolean): void =>
{
    $colorMaskEnabled = enabled;
};

/**
 * @description SAMPLE_ALPHA_TO_COVERAGE状態
 *              SAMPLE_ALPHA_TO_COVERAGE state
 *              Note: WebGPUではalphaToCoverageEnabledとしてパイプライン作成時に設定
 *
 * @type {boolean}
 * @private
 */
let $sampleAlphaToCoverageEnabled: boolean = false;

/**
 * @description SAMPLE_ALPHA_TO_COVERAGE状態を返却
 *              Returns the SAMPLE_ALPHA_TO_COVERAGE state
 *
 * @return {boolean}
 * @method
 * @protected
 */
export const $getSampleAlphaToCoverageEnabled = (): boolean =>
{
    return $sampleAlphaToCoverageEnabled;
};

/**
 * @description SAMPLE_ALPHA_TO_COVERAGE状態を設定
 *              Set SAMPLE_ALPHA_TO_COVERAGE state
 *
 * @param  {boolean} enabled
 * @return {void}
 * @method
 * @protected
 */
export const $setSampleAlphaToCoverageEnabled = (enabled: boolean): void =>
{
    $sampleAlphaToCoverageEnabled = enabled;
};

/**
 * @description ステンシル参照値（クリップレベル）
 *              Stencil reference value (clip level)
 *
 * @type {number}
 * @private
 */
let $stencilRef: number = 0;

/**
 * @description ステンシル参照値を取得
 *              Get stencil reference value
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getStencilRef = (): number =>
{
    return $stencilRef;
};

/**
 * @description ステンシル参照値を設定
 *              Set stencil reference value
 *
 * @param  {number} ref
 * @return {void}
 * @method
 * @protected
 */
export const $setStencilRef = (ref: number): void =>
{
    $stencilRef = ref;
};

/**
 * @description ステンシル参照値をインクリメント
 *              Increment stencil reference value
 *
 * @return {void}
 * @method
 * @protected
 */
export const $incrementStencilRef = (): void =>
{
    $stencilRef++;
};

/**
 * @description ステンシル参照値をデクリメント
 *              Decrement stencil reference value
 *
 * @return {void}
 * @method
 * @protected
 */
export const $decrementStencilRef = (): void =>
{
    if ($stencilRef > 0) {
        $stencilRef--;
    }
};
