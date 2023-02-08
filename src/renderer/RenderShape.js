/**
 * @class
 */
class RenderShape extends RenderGraphics
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {Rectangle|null}
         * @default null
         * @private
         */
        this._$scale9Grid = null;

        /**
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$matrixBase = null;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {void}
     * @method
     * @private
     */
    _$clip (context, matrix)
    {
        let multiMatrix = matrix;
        const rawMatrix = this._$matrix;
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        // size
        const baseBounds = this._$getBounds();

        const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
        let width    = $Math.ceil($Math.abs(bounds.xMax - bounds.xMin));
        let height   = $Math.ceil($Math.abs(bounds.yMax - bounds.yMin));
        Util.$poolBoundsObject(baseBounds);
        Util.$poolBoundsObject(bounds);

        switch (true) {

            case width === 0:
            case height === 0:
            case width === -$Infinity:
            case height === -$Infinity:
            case width === $Infinity:
            case height === $Infinity:
                return;

            default:
                break;

        }

        super._$clip(context, multiMatrix);

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @return {void}
     * @method
     * @private
     */
    _$draw (context, matrix, color_transform)
    {
        if (!this._$visible) {
            return ;
        }

        let multiColor = color_transform;
        const rawColor = this._$colorTransform;
        if (rawColor[0] !== 1 || rawColor[1] !== 1
            || rawColor[2] !== 1 || rawColor[3] !== 1
            || rawColor[4] !== 0 || rawColor[5] !== 0
            || rawColor[6] !== 0 || rawColor[7] !== 0
        ) {
            multiColor = Util.$multiplicationColor(color_transform, rawColor);
        }

        const alpha = Util.$clamp(multiColor[3] + multiColor[7] / 255, 0, 1, 0);
        if (!alpha || !this._$maxAlpha) {
            if (multiColor !== color_transform) {
                Util.$poolFloat32Array8(multiColor);
            }
            return ;
        }

        let multiMatrix = matrix;
        const rawMatrix = this._$matrix;
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        super._$draw(
            context, multiMatrix, multiColor,
            this._$blendMode, this._$filters
        );

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }

        if (multiColor !== color_transform) {
            Util.$poolFloat32Array8(multiColor);
        }
    }

    /**
     * @description Playerから登録を削除
     *
     * @return {void}
     * @method
     * @private
     */
    _$remove ()
    {
        this._$xMin    = 0;
        this._$yMin    = 0;
        this._$xMax    = 0;
        this._$yMax    = 0;
        this._$recodes = null;

        super._$remove();

        Util.$shapes.push(this);
    }
}