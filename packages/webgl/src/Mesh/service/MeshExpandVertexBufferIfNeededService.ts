import {
    $getVertexBufferData,
    $setVertexBufferData,
    $getVertexBufferPosition
} from "../../Mesh";

/**
 * @description 頂点バッファのサイズを拡張する
 *              Expand the size of the vertex buffer
 *
 * @param {number} delta_length
 * @method
 * @protected
 */
export const execute = (delta_length: number): void =>
{
    const vertexBufferData = $getVertexBufferData();
    if ($getVertexBufferPosition() + delta_length > vertexBufferData.length) {

        const biggerBuffer = new Float32Array(vertexBufferData.length * 2);
        biggerBuffer.set(vertexBufferData);

        $setVertexBufferData(biggerBuffer);
    }
};