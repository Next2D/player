import { execute as meshStrokeCurrentPathUseCase } from "../../Mesh/usecase/MeshStrokeCurrentPathUseCase";
import { $gradientData } from "../../Gradient";
import {
    $fillTypes,
    $fillBufferIndexes
} from "../../Mesh";

/**
 * @description 線のグラデーションを実行
 *              Execute gradient of line
 *
 * @param  {number} type
 * @param  {array} stops
 * @param  {Float32Array} matrix
 * @param  {number} spread
 * @param  {number} interpolation
 * @param  {number} focal
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    type: number,
    stops: number[],
    matrix: Float32Array,
    spread: number,
    interpolation: number,
    focal: number
): void => {

    // いまの経路を線のメッシュにして、塗りのバッファへ追加する
    const indexCount = meshStrokeCurrentPathUseCase();
    if (indexCount < 0) {
        return ;
    }

    // 塗りの種類を追加
    $fillTypes.push(type === 0 ? "linear" : "radial");

    // 塗りのインデックスを追加
    $fillBufferIndexes.push(indexCount);

    $gradientData.push(stops, matrix, spread, interpolation);
    if (type === 1) {
        $gradientData.push(focal);
    }
};