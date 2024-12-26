import { $getVertices } from "../../PathCommand";
import { execute as meshStrokeGenerateUseCase } from "../../Mesh/usecase/MeshStrokeGenerateUseCase";
import { $gradientData } from "../../Gradient";
import {
    $addFillBuffer,
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

    const vertices = $getVertices();
    if (!vertices.length) {
        return ;
    }

    // 塗りの種類を追加
    $fillTypes.push(type === 0 ? "linear" : "radial");

    const mesh = meshStrokeGenerateUseCase(vertices);
    $addFillBuffer(mesh.buffer);

    // 塗りのインデックスを追加
    $fillBufferIndexes.push(mesh.indexCount);

    $gradientData.push(stops, matrix, spread, interpolation);
    if (type === 1) {
        $gradientData.push(focal);
    }
};