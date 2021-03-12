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
        this.enabled = false;

        this.parentMatrixA = 1;
        this.parentMatrixB = 0;
        this.parentMatrixC = 0;
        this.parentMatrixD = 0;
        this.parentMatrixE = 1;
        this.parentMatrixF = 0;
        this.parentMatrixG = 0;
        this.parentMatrixH = 0;
        this.parentMatrixI = 1;

        this.ancestorMatrixA = 1;
        this.ancestorMatrixB = 0;
        this.ancestorMatrixC = 0;
        this.ancestorMatrixD = 0;
        this.ancestorMatrixE = 1;
        this.ancestorMatrixF = 0;
        this.ancestorMatrixG = 0;
        this.ancestorMatrixH = 0;
        this.ancestorMatrixI = 1;

        this.parentViewportX = 0;
        this.parentViewportY = 0;
        this.parentViewportW = 0;
        this.parentViewportH = 0;

        this.minXST = 0.00001;
        this.minYST = 0.00001;
        this.minXPQ = 0.00001;
        this.minYPQ = 0.00001;
        
        this.maxXST = 0.99999;
        this.maxYST = 0.99999;
        this.maxXPQ = 0.99999;
        this.maxYPQ = 0.99999;
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
        const minXST = (gridWidth  > 0) ? (grid._$x - bounds.xMin) / boundsWidth  : 0.00001;
        const minYST = (gridHeight > 0) ? (grid._$y - bounds.yMin) / boundsHeight : 0.00001;
        const maxXST = (gridWidth  > 0) ? ((grid._$x + grid._$width)  - bounds.xMin) / boundsWidth  : 0.99999;
        const maxYST = (gridHeight > 0) ? ((grid._$y + grid._$height) - bounds.yMin) / boundsHeight : 0.99999;

        // 現在サイズでの正規化grid
        let minXPQ = (sameWidth  * minXST) / width;
        let minYPQ = (sameHeight * minYST) / height;
        let maxXPQ = (width  - sameWidth  * (1 - maxXST)) / width;
        let maxYPQ = (height - sameHeight * (1 - maxYST)) / height;

        if (minXPQ >= maxXPQ) {
            const m = minXST / (minXST + (1 - maxXST));
            minXPQ = Util.$max(m - 0.00001, 0);
            maxXPQ = Util.$min(m + 0.00001, 1);
        }

        if (minYPQ >= maxYPQ) {
            const m = minYST / (minYST + (1 - maxYST));
            minYPQ = Util.$max(m - 0.00001, 0);
            maxYPQ = Util.$min(m + 0.00001, 1);
        }

        this.enabled = true;

        this.parentMatrixA = parentA;
        this.parentMatrixB = parentB;
        this.parentMatrixD = parentC;
        this.parentMatrixE = parentD;
        this.parentMatrixG = parentE;
        this.parentMatrixH = parentF;

        this.ancestorMatrixA = ancestorA;
        this.ancestorMatrixB = ancestorB;
        this.ancestorMatrixD = ancestorC;
        this.ancestorMatrixE = ancestorD;
        this.ancestorMatrixG = ancestorE;
        this.ancestorMatrixH = ancestorF;

        this.parentViewportX = x;
        this.parentViewportY = y;
        this.parentViewportW = width;
        this.parentViewportH = height;

        this.minXST = minXST;
        this.minYST = minYST;
        this.minXPQ = minXPQ;
        this.minYPQ = minYPQ;

        this.maxXST = maxXST;
        this.maxYST = maxYST;
        this.maxXPQ = maxXPQ;
        this.maxYPQ = maxYPQ;
    }

    /**
     * @return void
     * @public
     */
    disable ()
    {
        this.enabled = false;
    }
}
