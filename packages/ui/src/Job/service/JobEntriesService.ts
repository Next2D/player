import type { IEntriesObject } from "../../interface/IEntriesObject";
import type { IObject } from "../../interface/IObject";

/**
 * @description Tweenの開始/終了のオブジェクトを配列に変換
 *              Convert tween start/end objects to arrays
 *
 * @param  {object} object
 * @return {array}
 * @method
 * @private
 */
export const execute = (object: IObject): IEntriesObject[] =>
{
    const entries: IEntriesObject[] = [];
    for (const [name, value] of Object.entries(object))
    {
        entries.push({
            "name": name,
            "value": typeof value === "number" ? value : execute(value)
        });
    }
    return entries;
};