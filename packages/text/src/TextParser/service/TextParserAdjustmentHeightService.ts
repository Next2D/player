import type { TextData } from "../../TextData";

/**
 * @description 改行だけの行の高さを調整
 *              Adjust the height of a line that contains only line breaks
 *
 * @param {TextData} text_data
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_data: TextData): void =>
{
    const length = text_data.heightTable.length - 1;
    for (let idx = 1; idx < length; ++idx) {

        const height = text_data.heightTable[idx];
        if (height > 0) {
            continue;
        }

        // 改行があって、高さの設定がなければ前の行の高さを設定する
        const object = text_data.lineTable[idx];
        if (!object) {
            continue;
        }

        text_data.heightTable[idx] = object.h = text_data.heightTable[idx - 1];
    }
};