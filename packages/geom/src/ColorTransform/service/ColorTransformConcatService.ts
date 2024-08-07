import type { ColorTransform } from "../../ColorTransform";

/**
 * @description 指定のColorTransformを連結
 *              Concatenate the specified ColorTransform
 *
 * @param  {ColorTransform} color_transform1
 * @param  {ColorTransform} color_transform2
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    color_transform1: ColorTransform,
    color_transform2: ColorTransform
): void => {

    const multiColor = color_transform1._$multiplication(
        color_transform1._$colorTransform,
        color_transform2._$colorTransform
    );

    // update
    color_transform1._$colorTransform[0] = multiColor[0];
    color_transform1._$colorTransform[1] = multiColor[1];
    color_transform1._$colorTransform[2] = multiColor[2];
    color_transform1._$colorTransform[3] = multiColor[3];
    color_transform1._$colorTransform[4] = multiColor[4];
    color_transform1._$colorTransform[5] = multiColor[5];
    color_transform1._$colorTransform[6] = multiColor[6];
    color_transform1._$colorTransform[7] = multiColor[7];

    // pool
    color_transform1._$poolBuffer(multiColor);
};