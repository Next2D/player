const BezierConverterBuffer = new Array(32);

/**
 * @class
 */
class BezierConverter
{
    /**
     * @param  {number} fromX
     * @param  {number} fromY
     * @param  {number} cx1
     * @param  {number} cy1
     * @param  {number} cx2
     * @param  {number} cy2
     * @param  {number} x
     * @param  {number} y
     * @return void
     * @method
     * @static
     * @public
     */
    static cubicToQuad (fromX, fromY, cx1, cy1, cx2, cy2, x, y)
    {
        this._$split2Cubic(fromX, fromY, cx1, cy1, cx2, cy2, x, y, 0, 16);
        this._$split2Cubic(
            BezierConverterBuffer[0], BezierConverterBuffer[1], BezierConverterBuffer[2], BezierConverterBuffer[3],
            BezierConverterBuffer[4], BezierConverterBuffer[5], BezierConverterBuffer[6], BezierConverterBuffer[7],
            0, 8
        );
        this._$split2Cubic(
            BezierConverterBuffer[16], BezierConverterBuffer[17], BezierConverterBuffer[18], BezierConverterBuffer[19],
            BezierConverterBuffer[20], BezierConverterBuffer[21], BezierConverterBuffer[22], BezierConverterBuffer[23],
            16, 24
        );
        this._$split2Quad(
            BezierConverterBuffer[0], BezierConverterBuffer[1], BezierConverterBuffer[2], BezierConverterBuffer[3],
            BezierConverterBuffer[4], BezierConverterBuffer[5], BezierConverterBuffer[6], BezierConverterBuffer[7],
            0
        );
        this._$split2Quad(
            BezierConverterBuffer[8], BezierConverterBuffer[9], BezierConverterBuffer[10], BezierConverterBuffer[11],
            BezierConverterBuffer[12], BezierConverterBuffer[13], BezierConverterBuffer[14], BezierConverterBuffer[15],
            8
        );
        this._$split2Quad(
            BezierConverterBuffer[16], BezierConverterBuffer[17], BezierConverterBuffer[18], BezierConverterBuffer[19],
            BezierConverterBuffer[20], BezierConverterBuffer[21], BezierConverterBuffer[22], BezierConverterBuffer[23],
            16
        );
        this._$split2Quad(
            BezierConverterBuffer[24], BezierConverterBuffer[25], BezierConverterBuffer[26], BezierConverterBuffer[27],
            BezierConverterBuffer[28], BezierConverterBuffer[29], BezierConverterBuffer[30], BezierConverterBuffer[31],
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
     * @static
     * @private
     */
    static _$split2Cubic (p0, p1, p2, p3, p4, p5, p6, p7, offset1, offset2)
    {
        const mx = (p0 + 3 * (p2 + p4) + p6) * 0.125;
        const my = (p1 + 3 * (p3 + p5) + p7) * 0.125;
        const dx = (p6 + p4 - p2 - p0) * 0.125;
        const dy = (p7 + p5 - p3 - p1) * 0.125;

        BezierConverterBuffer[offset1    ] = p0;
        BezierConverterBuffer[offset1 + 1] = p1;
        BezierConverterBuffer[offset1 + 2] = (p0 + p2) * 0.5;
        BezierConverterBuffer[offset1 + 3] = (p1 + p3) * 0.5;
        BezierConverterBuffer[offset1 + 4] = mx - dx;
        BezierConverterBuffer[offset1 + 5] = my - dy;
        BezierConverterBuffer[offset1 + 6] = mx;
        BezierConverterBuffer[offset1 + 7] = my;

        BezierConverterBuffer[offset2    ] = mx;
        BezierConverterBuffer[offset2 + 1] = my;
        BezierConverterBuffer[offset2 + 2] = mx + dx;
        BezierConverterBuffer[offset2 + 3] = my + dy;
        BezierConverterBuffer[offset2 + 4] = (p4 + p6) * 0.5;
        BezierConverterBuffer[offset2 + 5] = (p5 + p7) * 0.5;
        BezierConverterBuffer[offset2 + 6] = p6;
        BezierConverterBuffer[offset2 + 7] = p7;
    }

    /**
     * @description 3次ベジェを、2つの2次ベジェに変換する
     * @param  {number} p0
     * @param  {number} p1
     * @param  {number} p2
     * @param  {number} p3
     * @param  {number} p4
     * @param  {number} p5
     * @param  {number} p6
     * @param  {number} p7
     * @param  {number} offset
     * @return void
     * @method
     * @static
     * @private
     */
    static _$split2Quad (p0, p1, p2, p3, p4, p5, p6, p7, offset)
    {
        const mx = (p0 + 3 * (p2 + p4) + p6) * 0.125;
        const my = (p1 + 3 * (p3 + p5) + p7) * 0.125;

        // 2次ベジェの始点の値は不要なので含めない

        // this.result[offset - 2] = p0;
        // this.result[offset - 1] = p1;
        BezierConverterBuffer[offset    ] = p0 * 0.25 + p2 * 0.75;
        BezierConverterBuffer[offset + 1] = p1 * 0.25 + p3 * 0.75;
        BezierConverterBuffer[offset + 2] = mx;
        BezierConverterBuffer[offset + 3] = my;

        // this.result[offset + 2] = mx;
        // this.result[offset + 3] = my;
        BezierConverterBuffer[offset + 4] = p4 * 0.75 + p6 * 0.25;
        BezierConverterBuffer[offset + 5] = p5 * 0.75 + p7 * 0.25;
        BezierConverterBuffer[offset + 6] = p6;
        BezierConverterBuffer[offset + 7] = p7;
    }
}
