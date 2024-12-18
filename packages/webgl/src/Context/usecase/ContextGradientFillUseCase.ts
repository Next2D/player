import { $getVertices } from "../../PathCommand";
import { execute as meshFillGenerateUseCase } from "../../Mesh/usecase/MeshFillGenerateUseCase";
import { $gradientData } from "../../Gradient";
import {
    $addFillBuffer,
    $fillTypes,
    $fillBufferIndexes
} from "../../Mesh";

/**
 * @description グラデーション塗りを描画
 *              Draw a gradient fill
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

    const fillMesh = meshFillGenerateUseCase(vertices);
    $addFillBuffer(fillMesh.buffer);

    // 塗りのインデックスを追加
    $fillBufferIndexes.push(fillMesh.indexCount);

    $gradientData.push(stops, matrix, spread, interpolation);
    if (type === 1) {
        $gradientData.push(focal);
    }
};