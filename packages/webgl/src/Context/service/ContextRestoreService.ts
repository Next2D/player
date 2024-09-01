import type { Context } from "../../Context";
import { $poolFloat32Array9 } from "../../WebGLUtil";

/**
 * @description 2D変換行列をスタックから復元します
 *              Restore the 2D transformation matrix from the stack
 *
 * @param  {Context} context
 * @return {void}
 * @method
 * @protected
 */
export const execute = (context: Context): void =>
{
    if (!context.$stack.length) {
        return ;
    }

    const matrix = context.$stack.pop() as Float32Array;
    context.$matrix[0] = matrix[0];
    context.$matrix[1] = matrix[1];
    context.$matrix[3] = matrix[3];
    context.$matrix[4] = matrix[4];
    context.$matrix[6] = matrix[6];
    context.$matrix[7] = matrix[7];

    $poolFloat32Array9(matrix);

    // todo mask
};