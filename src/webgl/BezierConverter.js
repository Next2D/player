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
     * @return {array}
     * @method
     * @static
     */
    static cubicToQuad (fromX, fromY, cx1, cy1, cx2, cy2, x, y)
    {
        const array  = Util.$getArray(Util.$getArray(fromX, fromY, cx1, cy1, cx2, cy2, x, y));
        const cubic2 = this.split2Cubic(array);
        const cubic4 = this.split2Cubic(cubic2);
        const result = this.split2Quad(cubic4);

        Util.$poolArray(array[0]);
        Util.$poolArray(array);
        Util.$poolArray(cubic2[0]);
        Util.$poolArray(cubic2[1]);
        Util.$poolArray(cubic2);
        Util.$poolArray(cubic4[0]);
        Util.$poolArray(cubic4[1]);
        Util.$poolArray(cubic4[2]);
        Util.$poolArray(cubic4[3]);
        Util.$poolArray(cubic4);

        return result;
    }

    /**
     * @description 3次ベジェ配列の各要素を、2つの3次ベジェに分割する
     * @param  {array} cubics
     * @return {array}
     * @method
     * @static
     */
    static split2Cubic (cubics)
    {
        const result = Util.$getArray();
        for (let i = 0; i < cubics.length; i++) {
            const b  = cubics[i];
            const mx = (b[0] + 3 * (b[2] + b[4]) + b[6]) * 0.125;
            const my = (b[1] + 3 * (b[3] + b[5]) + b[7]) * 0.125;
            const dx = (b[6] + b[4] - b[2] - b[0]) * 0.125;
            const dy = (b[7] + b[5] - b[3] - b[1]) * 0.125;

            result.push(Util.$getArray(
                b[0], b[1],
                (b[0] + b[2]) * 0.5, (b[1] + b[3]) * 0.5,
                mx - dx, my - dy,
                mx, my
            ));

            result.push(Util.$getArray(
                mx, my,
                mx + dx, my + dy,
                (b[4] + b[6]) * 0.5, (b[5] + b[7]) * 0.5,
                b[6], b[7]
            ));
        }
        return result;
    }

    /**
     * @description 3次ベジェ配列の各要素を、2つの2次ベジェに分割する
     * @param  {array} cubics
     * @return {array}
     * @method
     * @static
     */
    static split2Quad (cubics)
    {
        const result = Util.$getArray();
        for (let i = 0; i < cubics.length; i++) {
            const b  = cubics[i];
            const mx = (b[0] + 3 * (b[2] + b[4]) + b[6]) * 0.125;
            const my = (b[1] + 3 * (b[3] + b[5]) + b[7]) * 0.125;

            result.push(Util.$getArray(
                b[0], b[1],
                b[0] * 0.25 + b[2] * 0.75, b[1] * 0.25 + b[3] * 0.75, 
                mx, my
            ));

            result.push(Util.$getArray(
                mx, my,
                b[4] * 0.75 + b[6] * 0.25, b[5] * 0.75 + b[7] * 0.25,
                b[6], b[7]
            ));
        }
        return result;
    }
}
