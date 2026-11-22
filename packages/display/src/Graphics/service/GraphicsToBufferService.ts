import { write } from "./GraphicsToNumberArrayService";

/**
 * @description Graphicsのrecodesを解析して、描画用の Float32Array を生成します。
 *              内容は、GraphicsToNumberArrayService の結果を Float32Array にしたものと同じ。
 *
 *              数値は、この呼び出しのために作った配列へ集める。共有のプールから取った配列
 *              ($getArray) は、文字列やオブジェクトを入れたことがあると、数値専用の持ち方に
 *              戻らない。その配列へ小数を追加すると 1 つずつ別の領域が確保され、Float32Array への
 *              変換も 1 要素ずつになる (図形を作るたびに呼ばれる処理で、JIT が無い環境では
 *              約 1.5 倍の時間がかかった)。
 *
 *              Parses Graphics recodes and generates the Float32Array used for rendering.
 *              The content equals the result of GraphicsToNumberArrayService converted to a
 *              Float32Array. The numbers are collected in an array created for this call: an
 *              array taken from the shared pool ($getArray) that has ever held a string or an
 *              object never returns to a number-only representation, so every fraction pushed
 *              to it is allocated separately and the conversion to a Float32Array goes element
 *              by element (about 1.5x the time without a JIT, in a path run for every shape built).
 *
 * @param  {array} recodes
 * @return {Float32Array}
 * @method
 * @public
 */
export const execute = (recodes: any[] | null): Float32Array =>
{
    if (!recodes) {
        return new Float32Array(0);
    }

    const array: number[] = [];
    write(recodes, array);
    return new Float32Array(array);
};
