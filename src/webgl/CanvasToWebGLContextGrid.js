/**
 * @class
 */
class CanvasToWebGLContextGrid
{
    /**
     * @constructor
     */
    constructor ()
    {
        this._$enabled        = false;
        this._$parentMatrix   = new Util.$window.Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        this._$ancestorMatrix = new Util.$window.Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        this._$parentViewport = new Util.$window.Float32Array(4);
        this._$gridMin        = new Util.$window.Float32Array([0.00001, 0.00001, 0.00001, 0.00001]);
        this._$gridMax        = new Util.$window.Float32Array([0.99999, 0.99999, 0.99999, 0.99999]);
    }

    /**
     * @memberof CanvasToWebGLContextGrid#
     * @property {boolean} enabled
     * @return {boolean}
     * @readonly
     * @public
     */
    get enabled ()
    {
        return this._$enabled;
    }

    /**
     * @param {number} width
     * @param {number} height
     * @param {object} bounds
     * @param {Rectangle} grid
     * @param {number} parentA
     * @param {number} parentB
     * @param {number} parentC
     * @param {number} parentD
     * @param {number} parentE
     * @param {number} parentF
     * @param {number} ancestorA
     * @param {number} ancestorB
     * @param {number} ancestorC
     * @param {number} ancestorD
     * @param {number} ancestorE
     * @param {number} ancestorF
     * @return void
     * @public
     */
    enable (
        x, y, width, height, bounds, grid,
        parentA, parentB, parentC, parentD, parentE, parentF,
        ancestorA, ancestorB, ancestorC, ancestorD, ancestorE, ancestorF
    ) {
        const boundsWidth  = bounds.xMax - bounds.xMin;
        const boundsHeight = bounds.yMax - bounds.yMin;
        const gridWidth  = grid._$width;
        const gridHeight = grid._$height;

        const sameScale  = Util.$getSameScaleBase();
        const sameWidth  = Util.$abs(Util.$ceil(boundsWidth  * sameScale));
        const sameHeight = Util.$abs(Util.$ceil(boundsHeight * sameScale));

        // 等倍サイズでの正規化grid
        const xMinST = (gridWidth  > 0) ? (grid._$x - bounds.xMin) / boundsWidth  : 0.00001;
        const yMinST = (gridHeight > 0) ? (grid._$y - bounds.yMin) / boundsHeight : 0.00001;
        const xMaxST = (gridWidth  > 0) ? ((grid._$x + grid._$width)  - bounds.xMin) / boundsWidth  : 0.99999;
        const yMaxST = (gridHeight > 0) ? ((grid._$y + grid._$height) - bounds.yMin) / boundsHeight : 0.99999;

        // 現在サイズでの正規化grid
        let xMinPQ = (sameWidth  * xMinST) / width;
        let yMinPQ = (sameHeight * yMinST) / height;
        let xMaxPQ = (width  - sameWidth  * (1 - xMaxST)) / width;
        let yMaxPQ = (height - sameHeight * (1 - yMaxST)) / height;

        if (xMinPQ >= xMaxPQ) {
            const m = xMinST / (xMinST + (1 - xMaxST));
            xMinPQ = Util.$max(m - 0.00001, 0);
            xMaxPQ = Util.$min(m + 0.00001, 1);
        }

        if (yMinPQ >= yMaxPQ) {
            const m = yMinST / (yMinST + (1 - yMaxST));
            yMinPQ = Util.$max(m - 0.00001, 0);
            yMaxPQ = Util.$min(m + 0.00001, 1);
        }

        this._$enabled = true;

        this._$parentMatrix[0] = parentA;
        this._$parentMatrix[1] = parentB;
        this._$parentMatrix[3] = parentC;
        this._$parentMatrix[4] = parentD;
        this._$parentMatrix[6] = parentE;
        this._$parentMatrix[7] = parentF;

        this._$ancestorMatrix[0] = ancestorA;
        this._$ancestorMatrix[1] = ancestorB;
        this._$ancestorMatrix[3] = ancestorC;
        this._$ancestorMatrix[4] = ancestorD;
        this._$ancestorMatrix[6] = ancestorE;
        this._$ancestorMatrix[7] = ancestorF;

        this._$parentViewport[0] = x;
        this._$parentViewport[1] = y;
        this._$parentViewport[2] = width;
        this._$parentViewport[3] = height;

        this._$gridMin[0] = xMinST;
        this._$gridMin[1] = yMinST;
        this._$gridMin[2] = xMinPQ;
        this._$gridMin[3] = yMinPQ;

        this._$gridMax[0] = xMaxST;
        this._$gridMax[1] = yMaxST;
        this._$gridMax[2] = xMaxPQ;
        this._$gridMax[3] = yMaxPQ;
    }

    /**
     * @return void
     * @public
     */
    disable ()
    {
        this._$enabled = false;
    }
}
