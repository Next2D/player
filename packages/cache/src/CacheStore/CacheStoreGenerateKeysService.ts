/**
 * @description キャッシュストアのキーを生成
 *              Generate cache store keys
 *
 * @param  {string} unique_key
 * @param  {array} keys
 * @param  {array} [scales=null]
 * @param  {Float32Array} [color=null]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    unique_key: string,
    keys: string[],
    scales: number[] | null = null,
    color: Float32Array | null = null
): void => {

    let str: string = "";
    if (scales && scales.length) {
        str += scales.join("_");
    }

    // color
    if (color && color.length) {
        str += color[7] === 0 ? "" : `_${color[7]}`;
    }

    if (str) {
        let hash = 0;
        const length: number = str.length;
        for (let idx: number = 0; idx < length; idx++) {

            const chr: number = str.charCodeAt(idx);

            hash  = (hash << 5) - hash + chr;
            hash |= 0;
        }
        keys[1] = `${hash}`;
    } else {
        keys[1] = "0";
    }

    keys[0] = `${unique_key}`;
};