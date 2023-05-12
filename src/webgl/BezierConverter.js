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
            Util.$bezierConverterBuffer[0], Util.$bezierConverterBuffer[1], Util.$bezierConverterBuffer[2], Util.$bezierConverterBuffer[3],
            Util.$bezierConverterBuffer[4], Util.$bezierConverterBuffer[5], Util.$bezierConverterBuffer[6], Util.$bezierConverterBuffer[7],
            0, 8
        );
        this._$split2Cubic(
            Util.$bezierConverterBuffer[16], Util.$bezierConverterBuffer[17], Util.$bezierConverterBuffer[18], Util.$bezierConverterBuffer[19],
            Util.$bezierConverterBuffer[20], Util.$bezierConverterBuffer[21], Util.$bezierConverterBuffer[22], Util.$bezierConverterBuffer[23],
            16, 24
        );
        this._$split2Quad(
            Util.$bezierConverterBuffer[0], Util.$bezierConverterBuffer[1], Util.$bezierConverterBuffer[2], Util.$bezierConverterBuffer[3],
            Util.$bezierConverterBuffer[4], Util.$bezierConverterBuffer[5], Util.$bezierConverterBuffer[6], Util.$bezierConverterBuffer[7],
            0
        );
        this._$split2Quad(
            Util.$bezierConverterBuffer[8], Util.$bezierConverterBuffer[9], Util.$bezierConverterBuffer[10], Util.$bezierConverterBuffer[11],
            Util.$bezierConverterBuffer[12], Util.$bezierConverterBuffer[13], Util.$bezierConverterBuffer[14], Util.$bezierConverterBuffer[15],
            8
        );
        this._$split2Quad(
            Util.$bezierConverterBuffer[16], Util.$bezierConverterBuffer[17], Util.$bezierConverterBuffer[18], Util.$bezierConverterBuffer[19],
            Util.$bezierConverterBuffer[20], Util.$bezierConverterBuffer[21], Util.$bezierConverterBuffer[22], Util.$bezierConverterBuffer[23],
            16
        );
        this._$split2Quad(
            Util.$bezierConverterBuffer[24], Util.$bezierConverterBuffer[25], Util.$bezierConverterBuffer[26], Util.$bezierConverterBuffer[27],
            Util.$bezierConverterBuffer[28], Util.$bezierConverterBuffer[29], Util.$bezierConverterBuffer[30], Util.$bezierConverterBuffer[31],
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

        Util.$bezierConverterBuffer[offset1    ] = p0;
        Util.$bezierConverterBuffer[offset1 + 1] = p1;
        Util.$bezierConverterBuffer[offset1 + 2] = (p0 + p2) * 0.5;
        Util.$bezierConverterBuffer[offset1 + 3] = (p1 + p3) * 0.5;
        Util.$bezierConverterBuffer[offset1 + 4] = mx - dx;
        Util.$bezierConverterBuffer[offset1 + 5] = my - dy;
        Util.$bezierConverterBuffer[offset1 + 6] = mx;
        Util.$bezierConverterBuffer[offset1 + 7] = my;

        Util.$bezierConverterBuffer[offset2    ] = mx;
        Util.$bezierConverterBuffer[offset2 + 1] = my;
        Util.$bezierConverterBuffer[offset2 + 2] = mx + dx;
        Util.$bezierConverterBuffer[offset2 + 3] = my + dy;
        Util.$bezierConverterBuffer[offset2 + 4] = (p4 + p6) * 0.5;
        Util.$bezierConverterBuffer[offset2 + 5] = (p5 + p7) * 0.5;
        Util.$bezierConverterBuffer[offset2 + 6] = p6;
        Util.$bezierConverterBuffer[offset2 + 7] = p7;
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
        Util.$bezierConverterBuffer[offset    ] = p0 * 0.25 + p2 * 0.75;
        Util.$bezierConverterBuffer[offset + 1] = p1 * 0.25 + p3 * 0.75;
        Util.$bezierConverterBuffer[offset + 2] = mx;
        Util.$bezierConverterBuffer[offset + 3] = my;

        // this.result[offset + 2] = mx;
        // this.result[offset + 3] = my;
        Util.$bezierConverterBuffer[offset + 4] = p4 * 0.75 + p6 * 0.25;
        Util.$bezierConverterBuffer[offset + 5] = p5 * 0.75 + p7 * 0.25;
        Util.$bezierConverterBuffer[offset + 6] = p6;
        Util.$bezierConverterBuffer[offset + 7] = p7;
    }
}
