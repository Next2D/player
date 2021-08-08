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
     * @return void
     * @public
     */
    disable ()
    {
        this.enabled = false;
    }
}