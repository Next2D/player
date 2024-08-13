import { execute as bezierConverterSplit2CubicService } from "../service/BezierConverterSplit2CubicService";
import { execute as bezierConverterSplit2QuadService } from "../service/BezierConverterSplit2QuadService";
import { $bezierBuffer } from "../../BezierConverter";

/**
 * @description 3次ベジェ曲線を2次ベジェ曲線に分割
 *              Split cubic Bezier curve into quadratic Bezier curve
 *
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
    from_x: number, from_y: number,
    cx1: number, cy1: number,
    cx2: number, cy2: number,
    x: number, y: number
): Float32Array => {

    bezierConverterSplit2CubicService(
        from_x, from_y, cx1, cy1, cx2, cy2, x, y,
        0, 16
    );

    bezierConverterSplit2CubicService(
        $bezierBuffer[0], $bezierBuffer[1], $bezierBuffer[2], $bezierBuffer[3],
        $bezierBuffer[4], $bezierBuffer[5], $bezierBuffer[6], $bezierBuffer[7],
        0, 8
    );
    bezierConverterSplit2CubicService(
        $bezierBuffer[16], $bezierBuffer[17], $bezierBuffer[18], $bezierBuffer[19],
        $bezierBuffer[20], $bezierBuffer[21], $bezierBuffer[22], $bezierBuffer[23],
        16, 24
    );
    
    bezierConverterSplit2QuadService(
        $bezierBuffer[0], $bezierBuffer[1], $bezierBuffer[2], $bezierBuffer[3],
        $bezierBuffer[4], $bezierBuffer[5], $bezierBuffer[6], $bezierBuffer[7],
        0
    );
    bezierConverterSplit2QuadService(
        $bezierBuffer[8], $bezierBuffer[9], $bezierBuffer[10], $bezierBuffer[11],
        $bezierBuffer[12], $bezierBuffer[13], $bezierBuffer[14], $bezierBuffer[15],
        8
    );
    bezierConverterSplit2QuadService(
        $bezierBuffer[16], $bezierBuffer[17], $bezierBuffer[18], $bezierBuffer[19],
        $bezierBuffer[20], $bezierBuffer[21], $bezierBuffer[22], $bezierBuffer[23],
        16
    );
    bezierConverterSplit2QuadService(
        $bezierBuffer[24], $bezierBuffer[25], $bezierBuffer[26], $bezierBuffer[27],
        $bezierBuffer[28], $bezierBuffer[29], $bezierBuffer[30], $bezierBuffer[31],
        24
    );

    return $bezierBuffer;
};