import type { TextField } from "../../TextField";

/**
 * @description 文字コードの範囲情報
 *              Character code range information
 *
 * @private
 */
interface IRange {
    min: number;
    max: number;
}

/**
 * @description 指定の文字コードが範囲内に含まれるかを判定します。
 *              Determines whether the specified character code is included in the ranges.
 *
 * @param  {IRange[]} ranges
 * @param  {number} code
 * @return {boolean}
 * @method
 * @private
 */
const $contains = (ranges: IRange[], code: number): boolean =>
{
    for (let idx = 0; idx < ranges.length; ++idx) {
        const range = ranges[idx];
        if (code >= range.min && code <= range.max) {
            return true;
        }
    }
    return false;
};

/**
 * @description restrict に設定された制限文字列を解析して、入力可能な文字だけを返します。
 *              許可文字の列挙(例 "abc")、範囲指定(例 "a-z")、"^" による除外指定、
 *              "\" によるエスケープに対応します。restrict が空文字列の場合は制限しません。
 *              Parses the restriction string set in restrict and returns only the characters
 *              that can be entered. Supports enumeration of allowed characters (e.g. "abc"),
 *              range specification (e.g. "a-z"), exclusion by "^", and escaping by "\".
 *              If restrict is an empty string, no restriction is applied.
 *
 * @param  {TextField} text_field
 * @param  {string} texts
 * @return {string}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, texts: string): string =>
{
    const restrict = text_field.restrict;
    if (!restrict || !texts) {
        return texts;
    }

    const allowedRanges: IRange[] = [];
    const deniedRanges: IRange[]  = [];

    let denied = false;

    const length = restrict.length;
    for (let idx = 0; idx < length;) {

        let character = restrict[idx];

        // "^" 以降は除外指定に切り替わる(再度 "^" が現れると許可指定に戻る)
        if (character === "^") {
            denied = !denied;
            idx++;
            continue;
        }

        if (character === "\\" && idx + 1 < length) {
            idx++;
            character = restrict[idx];
        }

        const min = character.charCodeAt(0);
        let max = min;

        if (idx + 2 < length && restrict[idx + 1] === "-") {

            let endCharacter = restrict[idx + 2];
            let step = 3;
            if (endCharacter === "\\" && idx + 3 < length) {
                endCharacter = restrict[idx + 3];
                step = 4;
            }

            max = endCharacter.charCodeAt(0);
            idx += step;

        } else {
            idx++;
        }

        const ranges = denied ? deniedRanges : allowedRanges;
        ranges.push({
            "min": Math.min(min, max),
            "max": Math.max(min, max)
        });
    }

    let filteredTexts = "";
    for (let idx = 0; idx < texts.length; ++idx) {

        const code = texts.charCodeAt(idx);

        if ($contains(deniedRanges, code)) {
            continue;
        }

        // 許可指定が一つもない場合(除外指定のみ)は、除外以外のすべての文字を許可する
        if (allowedRanges.length && !$contains(allowedRanges, code)) {
            continue;
        }

        filteredTexts += texts[idx];
    }

    return filteredTexts;
};
