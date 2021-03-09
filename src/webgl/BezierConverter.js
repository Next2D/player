/**
 * @class
 */
class BezierConverter
{
    /**
     * @static
     * @public
     */
    static buffer = Array(32);

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
            this.buffer[0], this.buffer[1], this.buffer[2], this.buffer[3],
            this.buffer[4], this.buffer[5], this.buffer[6], this.buffer[7],
            0, 8
        );
        this._$split2Cubic(
            this.buffer[16], this.buffer[17], this.buffer[18], this.buffer[19],
            this.buffer[20], this.buffer[21], this.buffer[22], this.buffer[23],
            16, 24
        );
        this._$split2Quad(
            this.buffer[0], this.buffer[1], this.buffer[2], this.buffer[3],
            this.buffer[4], this.buffer[5], this.buffer[6], this.buffer[7],
            0
        );
        this._$split2Quad(
            this.buffer[8], this.buffer[9], this.buffer[10], this.buffer[11],
            this.buffer[12], this.buffer[13], this.buffer[14], this.buffer[15],
            8
        );
        this._$split2Quad(
            this.buffer[16], this.buffer[17], this.buffer[18], this.buffer[19],
            this.buffer[20], this.buffer[21], this.buffer[22], this.buffer[23],
            16
        );
        this._$split2Quad(
            this.buffer[24], this.buffer[25], this.buffer[26], this.buffer[27],
            this.buffer[28], this.buffer[29], this.buffer[30], this.buffer[31],
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

        this.buffer[offset1    ] = p0;
        this.buffer[offset1 + 1] = p1;
        this.buffer[offset1 + 2] = (p0 + p2) * 0.5;
        this.buffer[offset1 + 3] = (p1 + p3) * 0.5;
        this.buffer[offset1 + 4] = mx - dx;
        this.buffer[offset1 + 5] = my - dy;
        this.buffer[offset1 + 6] = mx;
        this.buffer[offset1 + 7] = my;

        this.buffer[offset2    ] = mx;
        this.buffer[offset2 + 1] = my;
        this.buffer[offset2 + 2] = mx + dx;
        this.buffer[offset2 + 3] = my + dy;
        this.buffer[offset2 + 4] = (p4 + p6) * 0.5;
        this.buffer[offset2 + 5] = (p5 + p7) * 0.5;
        this.buffer[offset2 + 6] = p6;
        this.buffer[offset2 + 7] = p7;
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

        // 2次ベジェの始点の値は不要なので、結果配列に含めない

        // this.result[offset - 2] = p0;
        // this.result[offset - 1] = p1;
        this.buffer[offset    ] = p0 * 0.25 + p2 * 0.75;
        this.buffer[offset + 1] = p1 * 0.25 + p3 * 0.75;
        this.buffer[offset + 2] = mx;
        this.buffer[offset + 3] = my;

        // this.result[offset + 2] = mx;
        // this.result[offset + 3] = my;
        this.buffer[offset + 4] = p4 * 0.75 + p6 * 0.25;
        this.buffer[offset + 5] = p5 * 0.75 + p7 * 0.25;
        this.buffer[offset + 6] = p6;
        this.buffer[offset + 7] = p7;
    }
}
