import type { Rectangle } from "@next2d/geom";
import type { BoundsImpl } from "@next2d/interface";
import { $Math } from "@next2d/share";

/**
 * @class
 */
export class CanvasToWebGLContextGrid
{
    public enabled: boolean;
    public parentMatrixA: number;
    public parentMatrixB: number;
    public parentMatrixC: number;
    public parentMatrixD: number;
    public parentMatrixE: number;
    public parentMatrixF: number;
    public parentMatrixG: number;
    public parentMatrixH: number;
    public parentMatrixI: number;
    public ancestorMatrixA: number;
    public ancestorMatrixB: number;
    public ancestorMatrixC: number;
    public ancestorMatrixD: number;
    public ancestorMatrixE: number;
    public ancestorMatrixF: number;
    public ancestorMatrixG: number;
    public ancestorMatrixH: number;
    public ancestorMatrixI: number;
    public parentViewportX: number;
    public parentViewportY: number;
    public parentViewportW: number;
    public parentViewportH: number;
    public minXST: number;
    public minYST: number;
    public minXPQ: number;
    public minYPQ: number;
    public maxXST: number;
    public maxYST: number;
    public maxXPQ: number;
    public maxYPQ: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {boolean}
         * @default false
         * @public
         */
        this.enabled = false;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.parentMatrixA = 1;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.parentMatrixB = 0;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.parentMatrixC = 0;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.parentMatrixD = 0;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.parentMatrixE = 1;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.parentMatrixF = 0;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.parentMatrixG = 0;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.parentMatrixH = 0;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.parentMatrixI = 1;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.ancestorMatrixA = 1;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.ancestorMatrixB = 0;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.ancestorMatrixC = 0;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.ancestorMatrixD = 0;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.ancestorMatrixE = 1;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.ancestorMatrixF = 0;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.ancestorMatrixG = 0;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.ancestorMatrixH = 0;

        /**
         * @type {number}
         * @default 1
         * @public
         */
        this.ancestorMatrixI = 1;

        /**
         * @type {number}
         * @default 0
         * @public
         */
        this.parentViewportX = 0;

        /**
         * @type {number}
         * @default 0
         * @public
         */
        this.parentViewportY = 0;

        /**
         * @type {number}
         * @default 0
         * @public
         */
        this.parentViewportW = 0;

        /**
         * @type {number}
         * @default 0
         * @public
         */
        this.parentViewportH = 0;

        /**
         * @type {number}
         * @default 0.00001
         * @public
         */
        this.minXST = 0.00001;

        /**
         * @type {number}
         * @default 0.00001
         * @public
         */
        this.minYST = 0.00001;

        /**
         * @type {number}
         * @default 0.00001
         * @public
         */
        this.minXPQ = 0.00001;

        /**
         * @type {number}
         * @default 0.00001
         * @public
         */
        this.minYPQ = 0.00001;

        /**
         * @type {number}
         * @default 0.99999
         * @public
         */
        this.maxXST = 0.99999;

        /**
         * @type {number}
         * @default 0.99999
         * @public
         */
        this.maxYST = 0.99999;

        /**
         * @type {number}
         * @default 0.99999
         * @public
         */
        this.maxXPQ = 0.99999;

        /**
         * @type {number}
         * @default 0.99999
         * @public
         */
        this.maxYPQ = 0.99999;
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @param  {object} bounds
     * @param  {Rectangle} grid
     * @param  {number} same_scale
     * @param  {number} parentA
     * @param  {number} parentB
     * @param  {number} parentC
     * @param  {number} parentD
     * @param  {number} parentE
     * @param  {number} parentF
     * @param  {number} ancestorA
     * @param  {number} ancestorB
     * @param  {number} ancestorC
     * @param  {number} ancestorD
     * @param  {number} ancestorE
     * @param  {number} ancestorF
     * @return {void}
     * @method
     * @public
     */
    enable (
        x: number, y: number, width: number, height: number,
        bounds: BoundsImpl, grid: Rectangle, same_scale: number,
        parentA: number, parentB: number, parentC: number,
        parentD: number, parentE: number, parentF: number,
        ancestorA: number, ancestorB: number, ancestorC: number,
        ancestorD: number, ancestorE: number, ancestorF: number
    ): void {

        const boundsWidth: number  = bounds.xMax - bounds.xMin;
        const boundsHeight: number = bounds.yMax - bounds.yMin;
        const gridWidth: number    = grid.width;
        const gridHeight: number   = grid.height;

        const sameWidth: number  = $Math.abs($Math.ceil(boundsWidth  * same_scale));
        const sameHeight: number = $Math.abs($Math.ceil(boundsHeight * same_scale));

        // 等倍サイズでの正規化grid
        const minXST: number = gridWidth  > 0 ? (grid.x - bounds.xMin) / boundsWidth  : 0.00001;
        const minYST: number = gridHeight > 0 ? (grid.y - bounds.yMin) / boundsHeight : 0.00001;
        const maxXST: number = gridWidth  > 0 ? (grid.x + grid.width  - bounds.xMin) / boundsWidth  : 0.99999;
        const maxYST: number = gridHeight > 0 ? (grid.y + grid.height - bounds.yMin) / boundsHeight : 0.99999;

        // 現在サイズでの正規化grid
        let minXPQ: number = sameWidth  * minXST / width;
        let minYPQ: number = sameHeight * minYST / height;
        let maxXPQ: number = (width  - sameWidth  * (1 - maxXST)) / width;
        let maxYPQ: number = (height - sameHeight * (1 - maxYST)) / height;

        if (minXPQ >= maxXPQ) {
            const m: number = minXST / (minXST + (1 - maxXST));
            minXPQ = $Math.max(m - 0.00001, 0);
            maxXPQ = $Math.min(m + 0.00001, 1);
        }

        if (minYPQ >= maxYPQ) {
            const m: number = minYST / (minYST + (1 - maxYST));
            minYPQ = $Math.max(m - 0.00001, 0);
            maxYPQ = $Math.min(m + 0.00001, 1);
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
     * @method
     * @public
     */
    disable (): void
    {
        this.enabled = false;
    }
}