import type { Context } from "../../Context";
import { $getFloat32Array9 } from "../../WebGLUtil";

/**
 * @description 2D変換行列をスタックに保存します
 *              Save the 2D transformation matrix to the stack
 *
 * @param  {Context} context
 * @return {void}
 * @method
 * @protected
 */
export const execute = (context: Context): void =>
{
    context.$stack.push($getFloat32Array9(
        context.$matrix[0], context.$matrix[1], context.$matrix[2],
        context.$matrix[3], context.$matrix[4], context.$matrix[5],
        context.$matrix[6], context.$matrix[7], context.$matrix[8]
    ));

    // todo mask
};