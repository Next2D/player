import { execute as bezierConverterSplit2CubicService } from "../service/BezierConverterSplit2CubicService";
import { execute as bezierConverterSplit2QuadService } from "../service/BezierConverterSplit2QuadService";

/**
 * @description 3次ベジェ曲線を2次ベジェ曲線に分割
 *              Split cubic Bezier curve into quadratic Bezier curve
 *
 * @param  {Float32Array} bezier_buffer 
 * @param  {number} from_x 
 * @param  {number} from_y 
 * @param  {number} cx1 
 * @param  {number} cy1 
 * @param  {number} cx2 
 * @param  {number} cy2 
 * @param  {number} x 
 * @param  {number} y 
 * @return {Float32Array}
 * @method
 * @protected
 */
export const execute = (
    bezier_buffer: Float32Array,
    from_x: number, from_y: number,
    cx1: number, cy1: number,
    cx2: number, cy2: number,
    x: number, y: number
): Float32Array => {

    bezierConverterSplit2CubicService(bezier_buffer,
        from_x, from_y, cx1, cy1, cx2, cy2, x, y,
        0, 16
    );

    bezierConverterSplit2CubicService(bezier_buffer,
        bezier_buffer[0], bezier_buffer[1], bezier_buffer[2], bezier_buffer[3],
        bezier_buffer[4], bezier_buffer[5], bezier_buffer[6], bezier_buffer[7],
        0, 8
    );
    bezierConverterSplit2CubicService(bezier_buffer,
        bezier_buffer[16], bezier_buffer[17], bezier_buffer[18], bezier_buffer[19],
        bezier_buffer[20], bezier_buffer[21], bezier_buffer[22], bezier_buffer[23],
        16, 24
    );
    
    bezierConverterSplit2QuadService(bezier_buffer,
        bezier_buffer[0], bezier_buffer[1], bezier_buffer[2], bezier_buffer[3],
        bezier_buffer[4], bezier_buffer[5], bezier_buffer[6], bezier_buffer[7],
        0
    );
    bezierConverterSplit2QuadService(bezier_buffer,
        bezier_buffer[8], bezier_buffer[9], bezier_buffer[10], bezier_buffer[11],
        bezier_buffer[12], bezier_buffer[13], bezier_buffer[14], bezier_buffer[15],
        8
    );
    bezierConverterSplit2QuadService(bezier_buffer,
        bezier_buffer[16], bezier_buffer[17], bezier_buffer[18], bezier_buffer[19],
        bezier_buffer[20], bezier_buffer[21], bezier_buffer[22], bezier_buffer[23],
        16
    );
    bezierConverterSplit2QuadService(bezier_buffer,
        bezier_buffer[24], bezier_buffer[25], bezier_buffer[26], bezier_buffer[27],
        bezier_buffer[28], bezier_buffer[29], bezier_buffer[30], bezier_buffer[31],
        24
    );

    return bezier_buffer;
};