import type { ColorTransform } from "../../ColorTransform";

/**
 * @description 指定のColorTransformを連結
 *              Concatenate the specified ColorTransform
 *
 * @param {ColorTransform} src
 * @param {ColorTransform} dst
 * @return {void}
 * @method
 * @public
 */
export const execute = (src: ColorTransform, dst: ColorTransform): void =>
{
    const multiColor = src._$multiplicationColor(
        src._$colorTransform,
        dst._$colorTransform
    );

    // update
    src._$colorTransform[0] = multiColor[0];
    src._$colorTransform[1] = multiColor[1];
    src._$colorTransform[2] = multiColor[2];
    src._$colorTransform[3] = multiColor[3];
    src._$colorTransform[4] = multiColor[4];
    src._$colorTransform[5] = multiColor[5];
    src._$colorTransform[6] = multiColor[6];
    src._$colorTransform[7] = multiColor[7];

    // pool
    src._$poolBuffer(multiColor);
};