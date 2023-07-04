import { $Float32Array } from "@next2d/share";

/**
 * @class
 */
export class BezierConverter
{
    public readonly _$bezierConverterBuffer: Float32Array;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._$bezierConverterBuffer = new $Float32Array(32);
    }

    /**
     * @param  {number} from_x
     * @param  {number} from_y
     * @param  {number} cx1
     * @param  {number} cy1
     * @param  {number} cx2
     * @param  {number} cy2
     * @param  {number} x
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    cubicToQuad (
        from_x: number, from_y: number,
        cx1: number, cy1: number,
        cx2: number, cy2: number,
        x: number, y: number
    ): void {

        this._$split2Cubic(from_x, from_y, cx1, cy1, cx2, cy2, x, y, 0, 16);
        this._$split2Cubic(
            this._$bezierConverterBuffer[0], this._$bezierConverterBuffer[1], this._$bezierConverterBuffer[2], this._$bezierConverterBuffer[3],
            this._$bezierConverterBuffer[4], this._$bezierConverterBuffer[5], this._$bezierConverterBuffer[6], this._$bezierConverterBuffer[7],
            0, 8
        );
        this._$split2Cubic(
            this._$bezierConverterBuffer[16], this._$bezierConverterBuffer[17], this._$bezierConverterBuffer[18], this._$bezierConverterBuffer[19],
            this._$bezierConverterBuffer[20], this._$bezierConverterBuffer[21], this._$bezierConverterBuffer[22], this._$bezierConverterBuffer[23],
            16, 24
        );
        this._$split2Quad(
            this._$bezierConverterBuffer[0], this._$bezierConverterBuffer[1], this._$bezierConverterBuffer[2], this._$bezierConverterBuffer[3],
            this._$bezierConverterBuffer[4], this._$bezierConverterBuffer[5], this._$bezierConverterBuffer[6], this._$bezierConverterBuffer[7],
            0
        );
        this._$split2Quad(
            this._$bezierConverterBuffer[8], this._$bezierConverterBuffer[9], this._$bezierConverterBuffer[10], this._$bezierConverterBuffer[11],
            this._$bezierConverterBuffer[12], this._$bezierConverterBuffer[13], this._$bezierConverterBuffer[14], this._$bezierConverterBuffer[15],
            8
        );
        this._$split2Quad(
            this._$bezierConverterBuffer[16], this._$bezierConverterBuffer[17], this._$bezierConverterBuffer[18], this._$bezierConverterBuffer[19],
            this._$bezierConverterBuffer[20], this._$bezierConverterBuffer[21], this._$bezierConverterBuffer[22], this._$bezierConverterBuffer[23],
            16
        );
        this._$split2Quad(
            this._$bezierConverterBuffer[24], this._$bezierConverterBuffer[25], this._$bezierConverterBuffer[26], this._$bezierConverterBuffer[27],
            this._$bezierConverterBuffer[28], this._$bezierConverterBuffer[29], this._$bezierConverterBuffer[30], this._$bezierConverterBuffer[31],
            24
        );
    }

    /**
     * @description 3次ベジェを、2つの3次ベジェに分割する
     * @param  {number} p0
     * @param  {number} p1
     * @param  {number} p2
     * @param  {number} p3
     * @param  {number} p4
     * @param  {number} p5
     * @param  {number} p6
     * @param  {number} p7
     * @param  {number} offset1
     * @param  {number} offset2
     * @return void
     * @method
     * @private
     */
    _$split2Cubic (
        p0: number, p1: number,
        p2: number, p3: number,
        p4: number, p5: number,
        p6: number, p7: number,
        offset1: number, offset2: number
    ): void {

        const mx: number = (p0 + 3 * (p2 + p4) + p6) * 0.125;
        const my: number = (p1 + 3 * (p3 + p5) + p7) * 0.125;
        const dx: number = (p6 + p4 - p2 - p0) * 0.125;
        const dy: number = (p7 + p5 - p3 - p1) * 0.125;

        this._$bezierConverterBuffer[offset1    ] = p0;
        this._$bezierConverterBuffer[offset1 + 1] = p1;
        this._$bezierConverterBuffer[offset1 + 2] = (p0 + p2) * 0.5;
        this._$bezierConverterBuffer[offset1 + 3] = (p1 + p3) * 0.5;
        this._$bezierConverterBuffer[offset1 + 4] = mx - dx;
        this._$bezierConverterBuffer[offset1 + 5] = my - dy;
        this._$bezierConverterBuffer[offset1 + 6] = mx;
        this._$bezierConverterBuffer[offset1 + 7] = my;

        this._$bezierConverterBuffer[offset2    ] = mx;
        this._$bezierConverterBuffer[offset2 + 1] = my;
        this._$bezierConverterBuffer[offset2 + 2] = mx + dx;
        this._$bezierConverterBuffer[offset2 + 3] = my + dy;
        this._$bezierConverterBuffer[offset2 + 4] = (p4 + p6) * 0.5;
        this._$bezierConverterBuffer[offset2 + 5] = (p5 + p7) * 0.5;
        this._$bezierConverterBuffer[offset2 + 6] = p6;
        this._$bezierConverterBuffer[offset2 + 7] = p7;
    }

    /**
     * @description 3次ベジェを、2つの2次ベジェに変換する
     *
     * @param  {number} p0
     * @param  {number} p1
     * @param  {number} p2
     * @param  {number} p3
     * @param  {number} p4
     * @param  {number} p5
     * @param  {number} p6
     * @param  {number} p7
     * @param  {number} offset
     * @return {void}
     * @method
     * @private
     */
    _$split2Quad (
        p0: number, p1: number,
        p2: number, p3: number,
        p4: number, p5: number,
        p6: number, p7: number,
        offset: number
    ): void {

        const mx: number = (p0 + 3 * (p2 + p4) + p6) * 0.125;
        const my: number = (p1 + 3 * (p3 + p5) + p7) * 0.125;

        // 2次ベジェの始点の値は不要なので含めない

        // this.result[offset - 2] = p0;
        // this.result[offset - 1] = p1;
        this._$bezierConverterBuffer[offset    ] = p0 * 0.25 + p2 * 0.75;
        this._$bezierConverterBuffer[offset + 1] = p1 * 0.25 + p3 * 0.75;
        this._$bezierConverterBuffer[offset + 2] = mx;
        this._$bezierConverterBuffer[offset + 3] = my;

        // this.result[offset + 2] = mx;
        // this.result[offset + 3] = my;
        this._$bezierConverterBuffer[offset + 4] = p4 * 0.75 + p6 * 0.25;
        this._$bezierConverterBuffer[offset + 5] = p5 * 0.75 + p7 * 0.25;
        this._$bezierConverterBuffer[offset + 6] = p6;
        this._$bezierConverterBuffer[offset + 7] = p7;
    }
}
